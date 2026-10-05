import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../auth.store';
import { Spinner } from '@/shared/ui/spinner';

export interface AuthGuardProps {
  /** Optional custom redirect path when unauthenticated (defaults to '/login') */
  redirectTo?: string;
  /** Optional custom loading placeholder */
  fallback?: ReactNode;
  /** Optional nested children, defaults to <Outlet /> */
  children?: ReactNode;
}

/**
 * Route-level guard that verifies user authentication.
 * If unauthenticated, smoothly redirects to the login route with return state.
 */
export function AuthGuard({
  redirectTo = '/login',
  fallback,
  children,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      fallback ?? (
        <div className="flex min-h-[50vh] w-full items-center justify-center p-8">
          <Spinner size="lg" aria-label="Verifying authentication session..." />
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
}

export default AuthGuard;
