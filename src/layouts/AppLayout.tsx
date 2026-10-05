import { Outlet } from 'react-router';
import { AdminBar } from './components/AdminBar';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { BreadcrumbTrail } from './components/BreadcrumbTrail';
import { ToastContainer } from '@/shared/ui/toast';

export interface AppLayoutProps {
  className?: string;
}

/**
 * Universal Application Shell.
 * Unifies public visitors and authenticated administrators into a single, cohesive
 * interface layout. Administrative tools (AdminBar, Edit Mode toggles) dynamically mount
 * without separate admin route structures or split page trees.
 */
export function AppLayout({ className = '' }: AppLayoutProps) {
  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-500/20 selection:text-brand-700 dark:bg-slate-950 dark:text-slate-100 dark:selection:text-brand-300 ${className}`}
    >
      {/* Dynamic Administrative Control Bar (mounts for staff/admins) */}
      <AdminBar />

      {/* Primary Brand Navigation Header */}
      <Header />

      {/* Dynamic Route Breadcrumb Trail (rendered on nested pages) */}
      <BreadcrumbTrail />

      {/* Main Content Router Outlet */}
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      {/* Comprehensive Enterprise Footer */}
      <Footer />

      {/* Mobile Drawer Navigation */}
      <Navigation />

      {/* Global Toast Notifications Container */}
      <ToastContainer />
    </div>
  );
}

export default AppLayout;
