import type { ReactNode } from 'react';
import { useAuthStore } from '../auth.store';
import type { Permission } from '../permissions.constants';

export interface PermissionGateProps {
  /** Single permission string or array of permissions */
  permission?: Permission | string | (Permission | string)[];
  /** Strategy when multiple permissions are provided: all must match or any */
  mode?: 'all' | 'any';
  /** If true, strictly requires the user to have isAdmin === true */
  requireAdmin?: boolean;
  /** Component or element to render when permission checks pass */
  children: ReactNode;
  /** Optional fallback to render when authorization fails (default: null) */
  fallback?: ReactNode;
}

/**
 * Inline authorization gate component.
 * Allows components, actions, buttons, and management panels to conditionally render
 * based on the active user's permissions, with built-in administrator bypass.
 */
export function PermissionGate({
  permission,
  mode = 'all',
  requireAdmin = false,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { user, isAuthenticated, hasPermission, hasAnyPermission, hasAllPermissions } =
    useAuthStore();

  if (!isAuthenticated || !user) {
    return fallback ? <>{fallback}</> : null;
  }

  // If strictly requireAdmin is flagged
  if (requireAdmin && !user.isAdmin) {
    return fallback ? <>{fallback}</> : null;
  }

  // Super-admin bypass: if user.isAdmin, grant access unless requireAdmin was false and unmet
  if (user.isAdmin) {
    return <>{children}</>;
  }

  // Check specific permissions if specified
  if (permission !== undefined) {
    if (Array.isArray(permission)) {
      if (permission.length === 0) {
        return <>{children}</>;
      }
      const hasAccess =
        mode === 'any' ? hasAnyPermission(permission) : hasAllPermissions(permission);
      if (!hasAccess) {
        return fallback ? <>{fallback}</> : null;
      }
    } else {
      if (!hasPermission(permission)) {
        return fallback ? <>{fallback}</> : null;
      }
    }
  }

  return <>{children}</>;
}

export default PermissionGate;
