import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router';
import {
  ChevronDown,
  Calendar,
  Sparkles,
  Mail,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface PublicContactDropdownProps {
  className?: string;
  align?: 'left' | 'right';
}

export function PublicContactDropdown({
  className = '',
  align = 'right',
}: PublicContactDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();
  const isConsultationActive = location.pathname.startsWith('/consultations');
  const isLeadsActive = location.pathname.startsWith('/leads');
  const isContactActive = location.pathname.startsWith('/contact');
  const isAnyActive = isConsultationActive || isLeadsActive || isContactActive;

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setIsOpen(false);
    }, 150);
  }, []);

  const handleClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(false);
    setIsHovered(false);
  }, []);

  const handleToggleClick = () => {
    setIsOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [handleClose]);

  const showDropdown = isOpen || isHovered;

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block text-left group', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggleClick}
        aria-expanded={showDropdown}
        aria-haspopup="true"
        aria-label="Contact and consultation options"
        className={cn(
          'hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
          isAnyActive
            ? 'bg-brand-700 ring-2 ring-brand-400/80'
            : 'bg-brand-600 hover:bg-brand-500',
        )}
      >
        <span>Contact</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200 shrink-0',
            showDropdown ? 'rotate-180' : 'group-hover:rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu with Hover Bridge */}
      <div
        className={cn(
          'absolute top-full pt-2 z-50 transition-all duration-200',
          align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
          showDropdown
            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
            : 'opacity-0 invisible -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto',
        )}
      >
        <div className="w-[340px] sm:w-[390px] rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900/95 ring-1 ring-slate-950/5 dark:ring-white/10">
          {/* Header Description */}
          <div className="px-3 pt-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Contact &amp; Engagement
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-500/20 px-2 py-0.5 rounded-full">
                <Zap className="h-3 w-3" />
                <span>Fast Response</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              Select how you would like to connect with our engineering team:
            </p>
          </div>

          {/* Engagement Options */}
          <div className="space-y-1 pt-1.5" role="menu">
            {/* 1. Technical Consultation */}
            <Link
              to="/consultations"
              onClick={handleClose}
              role="menuitem"
              className={cn(
                'group/item flex items-start gap-3 rounded-xl p-2.5 transition-all',
                isConsultationActive
                  ? 'bg-brand-50/90 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 ring-1 ring-brand-500/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200',
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 group-hover/item:scale-105 group-hover/item:bg-cyan-100 dark:group-hover/item:bg-cyan-900/60 transition-all">
                <Calendar className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-brand-600 dark:group-hover/item:text-brand-400 transition-colors">
                    Consultation
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-700 bg-cyan-100/70 dark:bg-cyan-950/80 dark:text-cyan-300 px-1.5 py-0.5 rounded-md shrink-0">
                    <Clock className="h-2.5 w-2.5" />
                    <span>45m Advisory</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  Schedule a 1-on-1 architecture &amp; roadmap discovery session with Principal Engineers.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all self-center shrink-0" />
            </Link>

            {/* 2. Leads & Estimator */}
            <Link
              to="/leads"
              onClick={handleClose}
              role="menuitem"
              className={cn(
                'group/item flex items-start gap-3 rounded-xl p-2.5 transition-all',
                isLeadsActive
                  ? 'bg-brand-50/90 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 ring-1 ring-brand-500/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200',
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 group-hover/item:scale-105 group-hover/item:bg-amber-100 dark:group-hover/item:bg-amber-900/60 transition-all">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-brand-600 dark:group-hover/item:text-brand-400 transition-colors">
                    Leads &amp; Project Scoping
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/70 dark:bg-amber-950/80 dark:text-amber-300 px-1.5 py-0.5 rounded-md shrink-0">
                    &lt; 24h Proposal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  Submit requirements, estimate scope &amp; budget, and receive a formal technical proposal.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all self-center shrink-0" />
            </Link>

            {/* 3. Direct Contact */}
            <Link
              to="/contact"
              onClick={handleClose}
              role="menuitem"
              className={cn(
                'group/item flex items-start gap-3 rounded-xl p-2.5 transition-all',
                isContactActive
                  ? 'bg-brand-50/90 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 ring-1 ring-brand-500/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200',
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover/item:scale-105 group-hover/item:bg-emerald-100 dark:group-hover/item:bg-emerald-900/60 transition-all">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/item:text-brand-600 dark:group-hover/item:text-brand-400 transition-colors">
                    Contact Us
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 dark:bg-emerald-950/80 dark:text-emerald-300 px-1.5 py-0.5 rounded-md shrink-0">
                    Direct Inquiry
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  Direct message, reach corporate phone &amp; email, or connect with our headquarters.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all self-center shrink-0" />
            </Link>
          </div>

          {/* Footer with NDA Reassurance */}
          <div className="mt-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 px-2.5 pb-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Mutual NDA Protected</span>
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-300">
              hello@kanzen.tech
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicContactDropdown;
