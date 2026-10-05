import { Link } from 'react-router';
import { Activity, ArrowUpRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface FooterProps {
  className?: string;
}

const CURRENT_YEAR = new Date().getFullYear();

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer
      className={cn(
        'w-full border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Overview Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2.5"
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
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                KANZEN<span className="text-brand-500 ml-1">TECH</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm text-slate-600 dark:text-slate-400">
              Architecting mission-critical digital systems, high-concurrency microservices,
              and enterprise AI infrastructure with uncompromising engineering rigor.
            </p>

            {/* System Health Badge */}
            <div className="pt-2">
              <Link
                to="/health"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>All Systems Operational</span>
              </Link>
            </div>
          </div>

          {/* Solutions & Offerings */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Offerings
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Engineering Services
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Enterprise Solutions
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Proprietary Products
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Engineering Portfolio
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Culture */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  About Kanzen
                </Link>
              </li>
              <li>
                <Link to="/process" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Delivery Process
                </Link>
              </li>
              <li>
                <Link to="/careers" className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <span>Careers</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Client Endorsements
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Engineering Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Engage & Inquire */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Engage
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/consultations" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Book Technical Consultation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Contact Leadership
                </Link>
              </li>
              <li>
                <Link to="/newsletter" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Tech Radar Newsletter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Legal & Social */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-slate-800 md:flex-row">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {CURRENT_YEAR} Kanzen Tech Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="GitHub Repository"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="X Twitter Profile"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
