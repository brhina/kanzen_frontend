import { useState } from 'react';
import { Link } from 'react-router';
import {
  Shield,
  Edit3,
  Eye,
  LayoutGrid,
  Table as TableIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
  ChevronUp,
  ChevronDown,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import { Badge } from '@/shared/ui/badge';

export interface AdminBarProps {
  className?: string;
}

/**
 * Administrative Control Toolbar.
 * Automatically mounts when an authenticated user has elevated privileges
 * (isAdmin or at least one explicit permission).
 * Provides immediate inline toggling between Public Showcase and Admin Edit Mode.
 */
export function AdminBar({ className = '' }: AdminBarProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { isEditMode, toggleEditMode, viewMode, setViewMode } = useUIStore();
  const [isMinimized, setIsMinimized] = useState(false);

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
          className="flex items-center gap-2 rounded-full bg-slate-900/95 px-4 py-2 text-xs font-semibold text-slate-100 shadow-xl ring-1 ring-slate-800 backdrop-blur-md transition-all hover:bg-slate-850 hover:ring-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          title="Expand Administrative Control Bar"
          aria-expanded={false}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <Shield className="h-3.5 w-3.5 text-brand-400" />
          <span>Admin Bar</span>
          {isEditMode && (
            <Badge variant="warning" size="sm" className="ml-1 text-[10px]">
              Edit Mode
            </Badge>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Administrative toolbar"
      className={`sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/95 text-slate-100 shadow-lg backdrop-blur-md transition-all ${className}`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        {/* Left: Identity & Elevation Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
              <Shield className="h-3.5 w-3.5 text-brand-400" />
              <span className="hidden sm:inline font-semibold text-white">
                {user.fullName || user.email}
              </span>
              <span className="sm:hidden font-semibold text-white truncate max-w-[120px]">
                {user.firstName || user.email}
              </span>
            </div>
            <Badge
              variant={user.isAdmin ? 'success' : 'info'}
              size="sm"
              className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5"
            >
              {roleLabel}
            </Badge>
          </div>
        </div>

        {/* Center: Inline Edit & View Mode Toggles */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Edit Mode Toggle */}
          <button
            type="button"
            onClick={toggleEditMode}
            aria-pressed={isEditMode}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              isEditMode
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50 shadow-inner'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title={isEditMode ? 'Exit inline edit mode' : 'Enable inline edit mode'}
          >
            {isEditMode ? (
              <>
                <Edit3 className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span>Edit Mode: <strong className="text-amber-300">ON</strong></span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 text-slate-400" />
                <span>Edit Mode: <span className="text-slate-400">OFF</span></span>
              </>
            )}
          </button>

          {/* View Mode Switcher (Grid vs Table) */}
          <div
            role="group"
            aria-label="View format switcher"
            className="hidden items-center rounded-lg bg-slate-900 p-0.5 ring-1 ring-slate-800 md:flex"
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Showcase Grid Layout"
            >
              <LayoutGrid className="h-3 w-3" />
              <span>Showcase</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Management Table Layout"
            >
              <TableIcon className="h-3 w-3" />
              <span>Manage</span>
            </button>
          </div>
        </div>

        {/* Right: Quick Action Links & Collapse */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Open Executive Dashboard"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>

          <Link
            to="/media"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Open Media Library"
          >
            <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden lg:inline">Media</span>
          </Link>

          <Link
            to="/users"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Manage Team & Permissions"
          >
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden lg:inline">Users</span>
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="System Settings"
          >
            <SettingsIcon className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden lg:inline">Settings</span>
          </Link>

          {/* Minimize toggle */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            aria-label="Minimize administrative bar"
            className="ml-1 rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
            title="Minimize Bar"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminBar;
