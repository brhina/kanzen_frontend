import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../auth.store';
import type { Permission } from '../permissions.constants';
import { Spinner } from '@/shared/ui/spinner';

export interface PermissionGuardProps {
  /** Single permission string or array of permissions */
  permission?: Permission | string | (Permission | string)[];
  /** Strategy when multiple permissions are provided: all must match or any */
  mode?: 'all' | 'any';
  /** If true, strictly requires the user to have isAdmin === true */
  requireAdmin?: boolean;
  /** Custom redirect path when permission check fails */
  redirectTo?: string;
  /** Optional custom unauthorized fallback UI instead of redirecting */
  fallback?: ReactNode;
  /** Optional children, defaults to <Outlet /> */
  children?: ReactNode;
}

/**
 * Route-level guard verifying both authentication and explicit permissions.
 * Redirects to login if not authenticated, and redirects or renders fallback if unauthorized.
 */
export function PermissionGuard({
  permission,
  mode = 'all',
  requireAdmin = false,
  redirectTo = '/',
  fallback,
  children,
}: PermissionGuardProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center p-8">
        <Spinner size="lg" aria-label="Checking permissions..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  // Admin strict check
  if (requireAdmin && !user.isAdmin) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to={redirectTo} replace />;
  }

  // Admin bypass
  if (user.isAdmin) {
    return children ? <>{children}</> : <Outlet />;
  }

  // Permission checks
  if (permission !== undefined) {
    let hasAccess = false;
    if (Array.isArray(permission)) {
      if (permission.length === 0) {
        hasAccess = true;
      } else {
        hasAccess =
          mode === 'any' ? hasAnyPermission(permission) : hasAllPermissions(permission);
      }
    } else {
      hasAccess = hasPermission(permission);
    }

    if (!hasAccess) {
      if (fallback) return <>{fallback}</>;
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}

export default PermissionGuard;
