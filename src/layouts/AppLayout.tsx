import { Outlet } from 'react-router';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import { AdminBar } from './components/AdminBar';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { BreadcrumbTrail } from './components/BreadcrumbTrail';
import { ToastContainer } from '@/shared/ui/toast';
import { cn } from '@/shared/utils/cn';

export interface AppLayoutProps {
  className?: string;
}

/**
 * Universal Application Shell.
 * Unifies public visitors and authenticated administrators into a single, cohesive
 * interface layout.
 * The primary Brand Navigation Header (navbar) is full-width.
 * When AdminBar is active, it renders under the navbar (as a right sidebar on lg+).
 * The content area below the navbar is offset via lg:pr-64 to clear the sidebar.
 */
export function AppLayout({ className = '' }: AppLayoutProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { adminBarMinimized } = useUIStore();

  const isElevated =
    isAuthenticated &&
    user &&
    (user.isAdmin || (Array.isArray(user.permissions) && user.permissions.length > 0));

  const hasRightAdminSidebar = isElevated && !adminBarMinimized;

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-500/20 selection:text-brand-700 dark:bg-slate-950 dark:text-slate-100 dark:selection:text-brand-300',
        className,
      )}
    >
      {/* Primary Brand Navigation Header (Full Width) */}
      <Header />

      {/* Dynamic Administrative Control Bar (mounts under navbar) */}
      <AdminBar />

      {/* Page Content Shell below navbar (offset on lg when AdminBar sidebar is active) */}
      <div
        className={cn(
          'flex-1 flex flex-col w-full transition-[padding] duration-200',
          hasRightAdminSidebar && 'lg:pr-64',
        )}
      >
        {/* Dynamic Route Breadcrumb Trail (rendered on nested pages) */}
        <BreadcrumbTrail />

        {/* Main Content Router Outlet */}
        <main className="flex-1 flex flex-col w-full">
          <Outlet />
        </main>

        {/* Comprehensive Enterprise Footer */}
        <Footer />
      </div>

      {/* Mobile Drawer Navigation */}
      <Navigation />

      {/* Global Toast Notifications Container */}
      <ToastContainer />
    </div>
  );
}

export default AppLayout;
