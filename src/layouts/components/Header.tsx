import { Link, NavLink, useNavigate } from 'react-router';
import {
  Menu,
  Sun,
  Moon,
  Laptop,
  LayoutDashboard,
  Settings as SettingsIcon,
  LogOut,
  Edit3,
  Sparkles,
  Calendar,
  Layers,
  Shield,
  Briefcase,
} from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Dropdown, type DropdownItem } from '@/shared/ui/dropdown';
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
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers', badge: 'Hiring' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Header({ className = '' }: HeaderProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, setTheme, toggleSidebar, isEditMode, toggleEditMode } = useUIStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

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
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: <LayoutDashboard className="h-4 w-4 text-slate-500" />,
      onClick: () => navigate('/dashboard'),
    },
    {
      id: 'leads',
      label: 'CRM Leads Pipeline',
      icon: <Layers className="h-4 w-4 text-indigo-500" />,
      onClick: () => navigate('/leads'),
    },
    {
      id: 'consultations',
      label: 'Appointments & Consultations',
      icon: <Calendar className="h-4 w-4 text-cyan-500" />,
      onClick: () => navigate('/consultations'),
    },
    {
      id: 'applications',
      label: 'Talent & Applications',
      icon: <Briefcase className="h-4 w-4 text-amber-500" />,
      onClick: () => navigate('/applications'),
    },
    {
      id: 'users',
      label: 'Team & RBAC Users',
      icon: <Shield className="h-4 w-4 text-emerald-500" />,
      onClick: () => navigate('/users'),
    },
    {
      id: 'settings',
      label: 'Account & Settings',
      icon: <SettingsIcon className="h-4 w-4 text-slate-500" />,
      onClick: () => navigate('/settings'),
    },
    ...(user?.isAdmin || (user?.permissions && user.permissions.length > 0)
      ? [
          {
            id: 'edit-mode',
            label: isEditMode ? 'Exit Edit Mode' : 'Enable Edit Mode',
            icon: <Edit3 className="h-4 w-4 text-amber-500" />,
            onClick: () => toggleEditMode(),
          },
        ]
      : []),
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
            aria-label="Kanzen Tech Homepage"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-500 text-white shadow-md shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
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
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                Enterprise Engineering
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-6 lg:flex"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400',
                    isActive
                      ? 'text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme switcher */}
          <button
            type="button"
            onClick={cycleTheme}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            title={`Current theme: ${theme}. Click to switch.`}
            aria-label={`Toggle color theme. Active mode: ${theme}`}
          >
            {theme === 'light' ? (
              <Sun className="h-4 w-4" />
            ) : theme === 'dark' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Laptop className="h-4 w-4" />
            )}
          </button>

          {/* User authentication status */}
          {isAuthenticated && user ? (
            <Dropdown
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full p-0.5 ring-1 ring-slate-200 hover:ring-brand-500/60 dark:ring-slate-800 dark:hover:ring-brand-400/60 transition-all focus:outline-none"
                  aria-label="Open user profile menu"
                >
                  <Avatar
                    name={user.fullName || user.email}
                    src={user.avatar}
                    size="sm"
                  />
                </button>
              }
              items={userDropdownItems}
              align="right"
            />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden text-sm font-medium text-slate-700 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 sm:inline-block transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <Link to="/contact">
                <Button
                  variant="primary"
                  size="sm"
                  className="hidden sm:inline-flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Start Project</span>
                </Button>
              </Link>
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
