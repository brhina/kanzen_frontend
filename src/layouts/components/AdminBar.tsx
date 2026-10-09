import { NavLink } from 'react-router';
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
  { to: '/consultations', label: 'Consultations', title: 'Appointments & Consultations' },
  { to: '/applications', label: 'Recruiting', title: 'Recruitment & Applications' },
  { to: '/newsletter', label: 'Newsletter', title: 'Audience & Newsletter Engine' },
  { to: '/media', label: 'Media', title: 'Open Media Library' },
  { to: '/analytics', label: 'Analytics', title: 'Performance Analytics' },
  { to: '/audit', label: 'Audit', title: 'Security Audit Log' },
  { to: '/health', label: 'Health', title: 'System Health & Services' },
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
        className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2 text-xs font-semibold text-slate-800 shadow-xl shadow-slate-200/50 backdrop-blur-md transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100 dark:shadow-2xl dark:hover:bg-slate-850 dark:hover:border-slate-700 cursor-pointer"
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
        'sticky top-16 z-30 w-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-slate-200 bg-white/95 text-slate-900 shadow-lg backdrop-blur-md transition-all dark:border-slate-800/80 dark:bg-slate-950/95 dark:text-slate-100',
        // Desktop (lg+): fixed right-side sidebar under navbar (top-16)
        'lg:fixed lg:top-16 lg:right-0 lg:bottom-0 lg:h-[calc(100vh-4rem)] lg:max-h-none lg:w-64 lg:border-b-0 lg:border-l lg:border-slate-200 lg:shadow-xl lg:overflow-y-auto lg:z-30 dark:lg:border-slate-800/80 dark:lg:shadow-2xl',
        className,
      )}
    >
      <div className="mx-auto flex w-full flex-col items-stretch gap-3 px-4 py-3 sm:px-6 lg:gap-5 lg:p-5 lg:h-full lg:max-w-none">
        {/* Section 1: Elevation Status */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800/80 lg:flex-col lg:items-stretch lg:gap-2 lg:pb-4">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
              <Badge
                variant={user.isAdmin ? 'success' : 'info'}
                size="sm"
                className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5"
              >
                {roleLabel}
              </Badge>
            </div>
            {/* Minimize Button */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              aria-label="Minimize administrative bar"
              className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
              title="Minimize Bar"
            >
              Minimize
            </button>
          </div>
        </div>

        {/* Section 2: Inline Edit Mode Control */}
        <div className="flex flex-col items-stretch gap-2 border-b border-slate-200 pb-3 dark:border-slate-800/80 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch lg:gap-3 lg:pb-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Mode Controls
          </div>
          <button
            type="button"
            onClick={toggleEditMode}
            aria-pressed={isEditMode}
            className={cn(
              'flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-all w-full sm:w-auto lg:w-full lg:py-2 cursor-pointer',
              isEditMode
                ? 'bg-amber-500/15 text-amber-900 ring-1 ring-amber-500/40 shadow-inner dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-500/50'
                : 'border border-slate-200 bg-slate-100/80 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:border-transparent dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
            )}
            title={isEditMode ? 'Exit inline edit mode' : 'Enable inline edit mode'}
          >
            {isEditMode ? (
              <span>
                Edit Mode: <strong className="text-amber-700 dark:text-amber-300">ON</strong>
              </span>
            ) : (
              <span>
                Edit Mode: <span className="text-slate-500 dark:text-slate-400">OFF</span>
              </span>
            )}
          </button>
        </div>

        {/* Section 3: Quick Action Links (Stacked vertically, never side-by-side) */}
        <div className="flex flex-col items-stretch gap-1.5 w-full">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Quick Access
          </div>

          <div className="flex flex-col items-stretch w-full gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-start w-full rounded-md px-3 py-1.5 lg:py-2 text-xs transition-colors',
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 font-semibold bg-brand-500/10 dark:bg-brand-950/40'
                      : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                  )
                }
                title={link.title}
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminBar;
