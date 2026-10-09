import { Link } from 'react-router';
import { Activity } from 'lucide-react';
import { usePublicSettings } from '@/domains/settings/application/use-cases/usePublicSettings';
import { SocialIcon } from '@/shared/ui/social/SocialIcon';
import { cn } from '@/shared/utils/cn';

export interface FooterProps {
  className?: string;
}

const CURRENT_YEAR = new Date().getFullYear();

export function Footer({ className = '' }: FooterProps) {
  const { company, socialLinks } = usePublicSettings();

  return (
    <footer
      className={cn(
        'w-full border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400',
        className,
      )}
    >
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand & Overview Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2.5"
              aria-label={`${company?.name || 'Kanzen Tech'} Homepage`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
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
              {company?.tagline ||
                'Architecting mission-critical digital systems, high-concurrency microservices, and enterprise AI infrastructure with uncompromising engineering rigor.'}
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
                <Link to="/careers" className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <span>Careers</span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800">Hiring</span>
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Candidate Status Portal
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
          <div className="col-span-2 md:col-span-1 space-y-3">
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
                <Link to="/leads" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Scope &amp; Budget Estimator
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

        {/* Bottom Bar: Legal & Dynamic Social Icons */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-slate-800 md:flex-row">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {CURRENT_YEAR} {company?.name || 'Kanzen Tech'}. All rights reserved.
          </p>

          {/* Dynamically configured social links from settings */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label={link.label}
                title={link.label}
              >
                <SocialIcon platform={link.platform} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
