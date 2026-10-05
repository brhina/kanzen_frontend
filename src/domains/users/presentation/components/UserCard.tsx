import { Link } from 'react-router';
import { Mail, Shield, ArrowRight } from 'lucide-react';
import type { UserEntity } from '../../domain/entities/user.entity';
import { Avatar } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { UserStatusBadge } from './UserStatusBadge';

export interface UserCardProps {
  user: UserEntity;
  showAdminActions?: boolean;
  onEditClick?: (user: UserEntity) => void;
  className?: string;
}

export function UserCard({
  user,
  showAdminActions = false,
  onEditClick,
  className = '',
}: UserCardProps) {
  return (
    <Card
      className={`group overflow-hidden border-slate-200/90 dark:border-slate-800/90 hover:border-brand-500/50 hover:shadow-lg transition-all ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <Avatar
            name={user.fullName || user.email}
            src={user.avatar}
            size="lg"
            className="ring-2 ring-brand-500/10 group-hover:ring-brand-500/30 transition-all"
          />

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {user.isAdmin && (
              <Badge variant="brand" size="sm" className="font-mono text-[10px]">
                <Shield className="h-3 w-3 mr-1 text-brand-500" />
                <span>Admin</span>
              </Badge>
            )}
            <UserStatusBadge status={user.status} size="sm" />
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <Link
            to={`/users/${user.id}`}
            className="block text-base font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            {user.fullName}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {user.isAdmin
              ? 'Full System Authority'
              : `${user.permissions.length} Assigned Capabilities`}
          </span>

          {showAdminActions && onEditClick ? (
            <button
              type="button"
              onClick={() => onEditClick(user)}
              className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors"
            >
              Configure
            </button>
          ) : (
            <Link
              to={`/users/${user.id}`}
              className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              <span>Profile</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default UserCard;
