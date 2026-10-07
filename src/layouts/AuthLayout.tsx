import { Link, Outlet } from 'react-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ToastContainer } from '@/shared/ui/toast';

export interface AuthLayoutProps {
  className?: string;
}

/**
 * Focused Authentication Shell.
 * Provides a secure, distraction-free environment for login, account verification,
 * and password recovery workflows.
 */
export function AuthLayout({ className = '' }: AuthLayoutProps) {
  return (
    <div
      className={`min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased relative overflow-hidden ${className}`}
    >
      {/* Ambient background decoration */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/15"
        aria-hidden="true"
      />

      {/* Top Header */}
      <header className="relative z-10 flex w-full items-center justify-between p-6">
        <Link
          to="/"
          className="group flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
          aria-label="Kanzen Tech Homepage"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
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
          <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
            KANZEN<span className="text-brand-500 ml-1">TECH</span>
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Site</span>
        </Link>
      </header>

      {/* Centered Auth Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500 dark:text-slate-500">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-500" />
          <span>Enterprise End-to-End Encryption & RBAC Guarded</span>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default AuthLayout;
