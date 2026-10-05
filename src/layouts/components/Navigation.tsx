import { Link, NavLink, useNavigate } from 'react-router';
import {
  Briefcase,
  Layers,
  Package,
  FolderGit2,
  FileText,
  BookOpen,
  Info,
  Workflow,
  Users2,
  MessageSquareQuote,
  Mail,
  LayoutDashboard,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import { Drawer } from '@/shared/ui/drawer';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/utils/cn';

export interface NavigationProps {
  className?: string;
}

interface NavGroup {
  title: string;
  items: {
    label: string;
    href: string;
    icon: typeof Briefcase;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Solutions & Offerings',
    items: [
      { label: 'Services', href: '/services', icon: Briefcase },
      { label: 'Solutions', href: '/solutions', icon: Layers },
      { label: 'Products', href: '/products', icon: Package },
      { label: 'Portfolio', href: '/portfolio', icon: FolderGit2 },
      { label: 'Case Studies', href: '/case-studies', icon: FileText },
    ],
  },
  {
    title: 'Knowledge & Insights',
    items: [
      { label: 'Engineering Blog', href: '/blog', icon: BookOpen },
      { label: 'Newsletter', href: '/newsletter', icon: Mail },
    ],
  },
  {
    title: 'Company & Trust',
    items: [
      { label: 'About Us', href: '/about', icon: Info },
      { label: 'Engineering Process', href: '/process', icon: Workflow },
      { label: 'Careers', href: '/careers', icon: Users2, badge: 'Hiring' },
      { label: 'Client Testimonials', href: '/testimonials', icon: MessageSquareQuote },
      { label: 'Contact', href: '/contact', icon: Mail },
    ],
  },
];

export function Navigation({ className = '' }: NavigationProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, theme, setTheme, isEditMode, toggleEditMode } =
    useUIStore();

  const handleClose = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    handleClose();
    navigate(path);
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

  return (
    <Drawer
      isOpen={sidebarOpen}
      onClose={handleClose}
      size="sm"
      className={className}
      title={
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
          </div>
          <span className="font-black text-slate-900 dark:text-white">
            KANZEN<span className="text-brand-500 ml-1">TECH</span>
          </span>
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>Theme:</span>
            <button
              type="button"
              onClick={cycleTheme}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium capitalize"
            >
              {theme === 'light' ? (
                <Sun className="h-3 w-3" />
              ) : theme === 'dark' ? (
                <Moon className="h-3 w-3" />
              ) : (
                <Laptop className="h-3 w-3" />
              )}
              {theme}
            </button>
          </div>
          <span className="text-[11px]">&copy; 2026 Kanzen</span>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        {/* User Account / Identity Section if authenticated */}
        {isAuthenticated && user && (
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800/80 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user.fullName || user.email}
              </span>
              <Badge variant={user.isAdmin ? 'success' : 'info'} size="sm">
                {user.isAdmin ? 'Admin' : 'Staff'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs">
              <button
                type="button"
                onClick={() => handleNavigate('/dashboard')}
                className="flex items-center gap-1.5 rounded-lg p-2 text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-slate-500" />
                <span>Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('/media')}
                className="flex items-center gap-1.5 rounded-lg p-2 text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
                <span>Media</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('/settings')}
                className="flex items-center gap-1.5 rounded-lg p-2 text-slate-700 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <SettingsIcon className="h-3.5 w-3.5 text-slate-500" />
                <span>Settings</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors text-left"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {(user.isAdmin || (user.permissions && user.permissions.length > 0)) && (
              <button
                type="button"
                onClick={toggleEditMode}
                className={`mt-2 flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  isEditMode
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                    : 'bg-slate-200/50 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/60 dark:text-slate-300'
                }`}
              >
                <span>Edit Mode</span>
                <span className="font-semibold">{isEditMode ? 'ON' : 'OFF'}</span>
              </button>
            )}
          </div>
        )}

        {/* Grouped Navigation Links */}
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={handleClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-brand-50 text-brand-600 font-semibold dark:bg-brand-950/40 dark:text-brand-400'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-850',
                      )
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="brand" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {/* Unauthenticated CTAs */}
        {!isAuthenticated && (
          <div className="space-y-2 pt-2">
            <Link to="/contact" onClick={handleClose} className="block">
              <Button variant="primary" size="md" className="w-full justify-center">
                <Sparkles className="h-4 w-4 mr-1.5" />
                <span>Start a Project</span>
              </Button>
            </Link>
            <Link to="/login" onClick={handleClose} className="block">
              <Button variant="outline" size="md" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Drawer>
  );
}

export default Navigation;
