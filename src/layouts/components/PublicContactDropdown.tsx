import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router';
import {
  ChevronDown,
  Calendar,
  Sparkles,
  Mail,
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
        <div className="w-48 sm:w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-0.5" role="menu">
            {/* 1. Consultation */}
            <Link
              to="/consultations"
              onClick={handleClose}
              role="menuitem"
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                isConsultationActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
              )}
            >
              <Calendar className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
              <span>Consultations &amp; Trainings</span>
            </Link>

            {/* 2. Leads & Project Scoping */}
            <Link
              to="/leads"
              onClick={handleClose}
              role="menuitem"
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                isLeadsActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
              )}
            >
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400" />
              <span>Leads &amp; Project Scoping</span>
            </Link>

            {/* 3. Direct Contact */}
            <Link
              to="/contact"
              onClick={handleClose}
              role="menuitem"
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                isContactActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
              )}
            >
              <Mail className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicContactDropdown;
