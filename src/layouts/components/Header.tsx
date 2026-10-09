import { Link, NavLink, useNavigate } from 'react-router';
import {
  Menu,
  LogOut,
  Briefcase,
  Bell,
} from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import { Avatar } from '@/shared/ui/avatar';
import { Dropdown, type DropdownItem } from '@/shared/ui/dropdown';
import { NotificationBell } from '@/domains/notifications/presentation/components/NotificationBell';
import { useCompanySettings } from '@/domains/settings/application/use-cases/usePublicSettings';
import { PublicContactDropdown } from './PublicContactDropdown';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/shared/utils/cn';

export interface HeaderProps {
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Products', href: '/products' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Process', href: '/process' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'About', href: '/about' },
];

const ADMIN_BAR_PATHS = new Set([
  '/dashboard',
  '/leads',
  '/consultations',
  '/applications',
  '/newsletter',
  '/media',
  '/analytics',
  '/audit',
  '/health',
  '/users',
  '/settings',
]);

export function Header({ className = '' }: HeaderProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const { company } = useCompanySettings();

  const isElevated = Boolean(
    isAuthenticated &&
      user &&
      (user.isAdmin || (Array.isArray(user.permissions) && user.permissions.length > 0)),
  );

  // If a route is in the Admin Bar, it should not appear in the header navigation for admins
  const visibleNavItems = isElevated
    ? NAV_ITEMS.filter((item) => !ADMIN_BAR_PATHS.has(item.href))
    : NAV_ITEMS;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // User menu in header: For admins, all management routes are accessed directly in the AdminBar,
  // so the header dropdown does not duplicate AdminBar routes.
  const userDropdownItems: DropdownItem[] = [
    {
      id: 'header-info',
      label: (
        <div className="px-2 py-1.5 text-left border-b border-slate-100 dark:border-slate-800 pb-2 mb-1">
          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
            {user?.fullName || 'Authenticated User'}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {user?.email}
          </p>
        </div>
      ),
      disabled: true,
    },
    ...(!isElevated
      ? [
          {
            id: 'applications',
            label: 'Candidate Status Portal',
            icon: <Briefcase className="h-4 w-4 text-amber-500" />,
            onClick: () => navigate('/applications'),
          },
        ]
      : []),
    {
      id: 'notifications',
      label: 'Notifications Center',
      icon: <Bell className="h-4 w-4 text-amber-500" />,
      onClick: () => navigate('/notifications'),
    },
    {
      divider: true,
      label: '',
    },
    {
      id: 'logout',
      label: 'Sign Out',
      icon: <LogOut className="h-4 w-4 text-rose-500" />,
      destructive: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/90',
        className,
      )}
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4 xl:gap-6 2xl:gap-8 min-w-0 flex-1">
          <Link
            to="/"
            className="group flex items-center gap-2.5 transition-transform hover:scale-[1.01] shrink-0"
            aria-label="Kanzen Tech Homepage"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-500 text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">
                KANZEN<span className="text-brand-500 ml-1">TECH</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[150px]">
                {company?.tagline || 'Enterprise Engineering'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-2 xl:gap-3.5 2xl:gap-5 lg:flex min-w-0 overflow-x-auto no-scrollbar py-1"
          >
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'text-xs xl:text-sm font-medium whitespace-nowrap transition-colors hover:text-brand-600 dark:hover:text-brand-400 inline-flex items-center gap-1 shrink-0',
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300',
                  )
                }
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-brand-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-brand-600 dark:text-brand-400">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-3">
          {/* Theme switcher */}
          <ThemeToggle />

          {/* Notification bell for authenticated users */}
          {isAuthenticated && <NotificationBell />}

          {/* User authentication status */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {!isElevated && <PublicContactDropdown />}
              <Dropdown
                trigger={
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-semibold text-slate-800 hover:bg-slate-100 ring-1 ring-slate-200 hover:ring-brand-500/60 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:ring-slate-800 dark:hover:ring-brand-400/60 transition-all focus:outline-none cursor-pointer"
                    aria-label="Open user profile menu"
                  >
                    <Avatar
                      name={user.fullName || user.email}
                      src={user.avatar}
                      size="sm"
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[120px] sm:max-w-[160px]">
                      {user.fullName || user.firstName || user.email}
                    </span>
                  </button>
                }
                items={userDropdownItems}
                align="right"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden text-sm font-medium text-slate-700 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 sm:inline-block transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <PublicContactDropdown />
            </div>
          )}

          {/* Mobile hamburger menu button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
