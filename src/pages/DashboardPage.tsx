import { Link } from 'react-router';
import {
  Users,
  Mail,
  Activity,
  Shield,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

export function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Executive Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Executive Console
            </h1>
            <Badge variant="brand" size="sm">
              Live
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.fullName || 'Operator'}. System telemetry and administration hub.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/health">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-500" />
              <span>Health Metrics</span>
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="primary" size="sm">
              System Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase font-semibold">
                Client Inquiries
              </CardDescription>
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <CardTitle className="text-2xl font-bold">24</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              +18% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase font-semibold">
                Team Personnel
              </CardDescription>
              <Users className="h-4 w-4 text-slate-400" />
            </div>
            <CardTitle className="text-2xl font-bold">12</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active staff & engineers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase font-semibold">
                Published Offerings
              </CardDescription>
              <Layers className="h-4 w-4 text-slate-400" />
            </div>
            <CardTitle className="text-2xl font-bold">18</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Services, solutions & products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase font-semibold">
                Security Posture
              </CardDescription>
              <Shield className="h-4 w-4 text-emerald-500" />
            </div>
            <CardTitle className="text-2xl font-bold">A+</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Zero vulnerabilities detected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Link
          to="/leads"
          className="group block p-6 rounded-2xl border border-slate-200 bg-white hover:border-brand-500/50 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              Leads & Inquiries
            </h3>
            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review incoming project briefs, contact requests, and conversion pipelines.
          </p>
        </Link>

        <Link
          to="/blog"
          className="group block p-6 rounded-2xl border border-slate-200 bg-white hover:border-brand-500/50 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              Knowledge Hub
            </h3>
            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Author engineering articles, manage tags, drafts, and publication schedules.
          </p>
        </Link>

        <Link
          to="/media"
          className="group block p-6 rounded-2xl border border-slate-200 bg-white hover:border-brand-500/50 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              Media Assets
            </h3>
            <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload and organize architecture diagrams, brand photography, and documents.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
export { DashboardPage as Component };
