import { Link } from 'react-router';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/utils/cn';

export interface AdminBarProps {
  className?: string;
}

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', title: 'Open Executive Dashboard' },
  { to: '/leads', label: 'Leads', title: 'CRM Leads Pipeline' },
  { to: '/applications', label: 'Recruiting', title: 'Recruitment & Applications' },
  { to: '/media', label: 'Media', title: 'Open Media Library' },
  { to: '/users', label: 'Users', title: 'Manage Team & Permissions' },
  { to: '/settings', label: 'Settings', title: 'System Settings' },
];

/**
 * Administrative Control Toolbar & Sidebar.
 * Automatically mounts when an authenticated user has elevated privileges
 * (isAdmin or at least one explicit permission).
 * - On mobile/tablet (< lg): Renders as a top sticky administrative bar.
 * - On desktop (lg+): Renders as a dedicated right-side sidebar.
 * All icons beside and within buttons have been removed for a clean, typographic interface.
 */
export function AdminBar({ className = '' }: AdminBarProps) {
  const { user, isAuthenticated } = useAuthStore();
  const {
    isEditMode,
    toggleEditMode,
    viewMode,
    setViewMode,
    adminBarMinimized,
    setAdminBarMinimized,
  } = useUIStore();

  const isMinimized = Boolean(adminBarMinimized);
  const setIsMinimized = (minimized: boolean) => setAdminBarMinimized(minimized);

  // Mounts strictly for staff with administrative capabilities
  const isElevated =
    isAuthenticated &&
    user &&
    (user.isAdmin || (Array.isArray(user.permissions) && user.permissions.length > 0));

  if (!isElevated) {
    return null;
  }

  const roleLabel = user.isAdmin ? 'Super Admin' : 'Staff Editor';

  // Minimized floating trigger pill
  if (isMinimized) {
    return (
      <aside
        aria-label="Administrative controls collapsed"
        className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 rounded-full bg-slate-900/95 px-4 py-2 text-xs font-semibold text-slate-100 shadow-xl ring-1 ring-slate-800 backdrop-blur-md transition-all hover:bg-slate-850 hover:ring-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          title="Expand Administrative Control Bar"
          aria-expanded={false}
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>Admin Bar</span>
          {isEditMode && (
            <Badge variant="warning" size="sm" className="ml-1 text-[10px]">
              Edit Mode
            </Badge>
          )}
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Administrative toolbar"
      className={cn(
        // Mobile / Tablet: sticky bar under navbar (top-16)
        'sticky top-16 z-30 w-full border-b border-slate-800/80 bg-slate-950/95 text-slate-100 shadow-lg backdrop-blur-md transition-all',
        // Desktop (lg+): fixed right-side sidebar under navbar (top-16)
        'lg:fixed lg:top-16 lg:right-0 lg:bottom-0 lg:h-[calc(100vh-4rem)] lg:w-64 lg:border-b-0 lg:border-l lg:border-slate-800/80 lg:shadow-2xl lg:overflow-y-auto lg:z-30',
        className,
      )}
    >
      <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:flex-col lg:items-stretch lg:justify-start lg:gap-5 lg:p-5 lg:h-full lg:max-w-none">
        {/* Section 1: Identity & Elevation Status */}
        <div className="flex items-center gap-3 lg:flex-col lg:items-stretch lg:gap-2 lg:border-b lg:border-slate-800/80 lg:pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-300">
                {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim()}
              </span>
              <Badge
                variant={user.isAdmin ? 'success' : 'info'}
                size="sm"
                className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5"
              >
                {roleLabel}
              </Badge>
            </div>
            {/* Desktop Minimize Button */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              aria-label="Minimize administrative bar"
              className="hidden lg:inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
              title="Minimize Bar"
            >
              Minimize
            </button>
          </div>
        </div>

        {/* Section 2: Inline Edit & View Mode Toggles */}
        <div className="flex items-center gap-2 sm:gap-4 lg:flex-col lg:items-stretch lg:gap-3 lg:border-b lg:border-slate-800/80 lg:pb-4">
          <div className="hidden lg:block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Mode Controls
          </div>
          {/* Edit Mode Toggle */}
          <button
            type="button"
            onClick={toggleEditMode}
            aria-pressed={isEditMode}
            className={cn(
              'flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-all lg:w-full lg:py-2 cursor-pointer',
              isEditMode
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50 shadow-inner'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white',
            )}
            title={isEditMode ? 'Exit inline edit mode' : 'Enable inline edit mode'}
          >
            {isEditMode ? (
              <span>
                Edit Mode: <strong className="text-amber-300">ON</strong>
              </span>
            ) : (
              <span>
                Edit Mode: <span className="text-slate-400">OFF</span>
              </span>
            )}
          </button>

          {/* View Mode Switcher (Grid vs Table) */}
          <div
            role="group"
            aria-label="View format switcher"
            className="flex items-center rounded-lg bg-slate-900 p-0.5 ring-1 ring-slate-800 lg:w-full lg:grid lg:grid-cols-2"
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={cn(
                'flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors lg:w-full lg:py-1.5 cursor-pointer',
                viewMode === 'grid'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200',
              )}
              title="Showcase Grid Layout"
            >
              <span>Showcase</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              className={cn(
                'flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors lg:w-full lg:py-1.5 cursor-pointer',
                viewMode === 'table'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200',
              )}
              title="Management Table Layout"
            >
              <span>Manage</span>
            </button>
          </div>
        </div>

        {/* Section 3: Quick Action Links & Mobile Minimize */}
        <div className="flex items-center gap-1 sm:gap-2 lg:flex-col lg:items-stretch lg:gap-1.5 lg:w-full">
          <div className="hidden lg:block text-[10px] font-bold uppercase tracking-wider text-slate-400 lg:mb-1">
            Quick Access
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap lg:flex-col lg:items-stretch lg:gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-center lg:justify-start rounded-md px-2.5 py-1 lg:py-2 lg:px-3 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                title={link.title}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Minimize Toggle (< lg) */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            aria-label="Minimize administrative bar"
            className="lg:hidden ml-1 rounded-md px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            title="Minimize Bar"
          >
            Minimize
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminBar;
