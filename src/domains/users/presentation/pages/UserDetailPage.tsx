import { useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  Shield,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  Edit2,
  Key,
} from 'lucide-react';
import { useUser } from '../../application/use-cases/useUser';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';
import { Avatar } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Drawer } from '@/shared/ui/drawer';
import { Spinner } from '@/shared/ui/spinner';
import { UserStatusBadge } from '../components/UserStatusBadge';
import { UserForm } from '../components/UserForm';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error } = useUser(id);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" aria-label="Loading user profile..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          User Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The requested team member record does not exist or has been deleted.
        </p>
        <Link to="/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span>Return to Directory</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* User Header Profile Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-md">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <Avatar
                name={user.fullName || user.email}
                src={user.avatar}
                size="lg"
                className="ring-4 ring-brand-500/10 text-xl"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                    {user.fullName}
                  </h1>
                  <UserStatusBadge status={user.status} size="md" />
                  {user.isAdmin && (
                    <Badge variant="brand" size="md" className="font-mono text-xs">
                      <Shield className="h-3.5 w-3.5 mr-1 text-brand-500" />
                      <span>Super Admin</span>
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user.isAdmin
                    ? 'Principal Administrator & Systems Architect'
                    : 'Engineering Team Personnel'}
                </p>
              </div>
            </div>

            {/* Inline Admin Action */}
            <PermissionGate permission="users:write">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-2 shadow-sm"
              >
                <Edit2 className="h-4 w-4" />
                <span>Configure Account</span>
              </Button>
            </PermissionGate>
          </div>

          {/* Quick Metadata Bar */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>

            {user.phone && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{user.phone}</span>
              </div>
            )}

            {user.createdAt && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <span>
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}

            {user.lastLoginAt && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <span>
                  Active {new Date(user.lastLoginAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permissions & Security Matrix Card */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-brand-500" />
            <CardTitle className="text-lg">Access Governance & Capabilities</CardTitle>
          </div>
          <CardDescription>
            Granular Role-Based Access Control (RBAC) grants mapped to this account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.isAdmin ? (
            <div className="rounded-xl border border-brand-500/20 bg-brand-50/50 p-4 dark:border-brand-500/30 dark:bg-brand-950/20 text-xs text-brand-800 dark:text-brand-300 flex items-center gap-3">
              <Shield className="h-6 w-6 text-brand-500 shrink-0" />
              <div>
                <p className="font-bold">Super Administrator Authority Active</p>
                <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                  This user holds unconstrained root access across all 22 domain services and automatically bypasses explicit permission gates.
                </p>
              </div>
            </div>
          ) : user.permissions.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-4 italic">
              No elevated capabilities assigned. This user possesses standard read-only member status.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-2">
              {user.permissions.map((perm) => (
                <Badge
                  key={perm}
                  variant="neutral"
                  size="md"
                  className="font-mono text-xs px-2.5 py-1"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1.5 text-emerald-500" />
                  <span>{perm}</span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        size="lg"
        title="Configure User Account"
        description={`Modify capabilities and credentials for ${user.fullName}`}
      >
        <UserForm
          user={user}
          onSuccess={() => setIsDrawerOpen(false)}
          onCancel={() => setIsDrawerOpen(false)}
        />
      </Drawer>
    </div>
  );
}

export default UserDetailPage;
export { UserDetailPage as Component };
