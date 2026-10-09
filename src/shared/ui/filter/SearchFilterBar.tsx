import React, { useState } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../utils/cn';
import { ActiveFilterChips, type FilterChip } from './ActiveFilterChips';

export interface SearchFilterBarProps {
  // Search state
  search?: string;
  searchValue?: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchClassName?: string;
  showSearch?: boolean;

  // Filter expand/collapse state
  isExpanded?: boolean;
  isFilterExpanded?: boolean;
  onToggleExpanded?: (expanded: boolean) => void;
  onToggleFilter?: () => void;
  defaultExpanded?: boolean;
  showFilterToggle?: boolean;
  filterButtonLabel?: string;
  activeFilterCount?: number;

  // Reset & Clear
  onReset?: () => void;
  onClearAllFilters?: () => void;
  hasActiveFilters?: boolean;

  // Result counts & summary
  totalCount?: number;
  filteredCount?: number;
  resultsLabel?: string;
  resultsSummary?: React.ReactNode;

  // Active filter chips
  activeChips?: FilterChip[];
  onClearAllChips?: () => void;

  // Action slots
  actions?: React.ReactNode;
  children?: React.ReactNode;

  // Styling
  className?: string;
  panelClassName?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  search: explicitSearch,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  searchClassName,
  showSearch = true,
  isExpanded: controlledExpanded,
  isFilterExpanded,
  onToggleExpanded,
  onToggleFilter,
  defaultExpanded = false,
  showFilterToggle = true,
  filterButtonLabel = 'Filters',
  activeFilterCount = 0,
  onReset,
  onClearAllFilters,
  hasActiveFilters = false,
  totalCount,
  filteredCount,
  resultsLabel,
  resultsSummary,
  activeChips,
  onClearAllChips,
  actions,
  children,
  className,
  panelClassName,
}) => {
  const search = explicitSearch ?? searchValue ?? '';
  const resetHandler = onReset ?? onClearAllFilters;
  const isExpandedProp = controlledExpanded !== undefined ? controlledExpanded : isFilterExpanded;
  // Uncontrolled expansion support
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = isExpandedProp !== undefined ? isExpandedProp : internalExpanded;

  const handleToggle = () => {
    const next = !isExpanded;
    if (onToggleFilter) {
      onToggleFilter();
    } else if (onToggleExpanded) {
      onToggleExpanded(next);
    } else {
      setInternalExpanded(next);
    }
  };

  const showClearAction = hasActiveFilters || activeFilterCount > 0 || Boolean(search);

  return (
    <div className={cn('space-y-3 w-full', className)}>
      {/* Primary Toolbar Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xs transition-colors">
        {/* Left Side: Search & Filter Toggle */}
        <div className="flex flex-1 flex-wrap sm:flex-nowrap items-center gap-2.5 min-w-0">
          {showSearch && showFilterToggle ? (
            /* Seamlessly Joined End-to-End Input Group */
            <div
              className={cn(
                'inline-flex items-center w-full sm:w-auto rounded-xl border border-slate-200/90 dark:border-slate-700/90 bg-slate-50 dark:bg-slate-800/70 transition-all duration-150',
                'focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-brand-500 dark:focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20',
                searchClassName,
              )}
            >
              {/* Search Segment */}
              <div className="relative flex-1 sm:w-64 md:w-72 sm:flex-none">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-10 bg-transparent pl-10 pr-8 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border-0 focus:outline-hidden"
                  aria-label={searchPlaceholder}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Vertical Divider */}
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" aria-hidden="true" />

              {/* Filters Toggle Segment */}
              <button
                type="button"
                onClick={handleToggle}
                aria-expanded={isExpanded}
                className={cn(
                  'inline-flex items-center gap-2 h-10 px-3.5 text-xs font-semibold select-none transition-colors duration-150 cursor-pointer shrink-0 rounded-r-xl',
                  isExpanded
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60',
                )}
              >
                <SlidersHorizontal className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span>{filterButtonLabel}</span>

                {/* Active Filter Count Badge */}
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold bg-brand-600 text-white animate-scaleIn">
                    {activeFilterCount}
                  </span>
                )}

                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0',
                    isExpanded && 'rotate-180 text-brand-600 dark:text-brand-400',
                  )}
                />
              </button>
            </div>
          ) : (
            <>
              {/* Standalone Search Input (if toggle hidden) */}
              {showSearch && (
                <div className={cn('relative w-full sm:w-64 md:w-72 shrink-0', searchClassName)}>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={cn(
                      'w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800/70 pl-10 pr-9 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border border-slate-200/80 dark:border-slate-700/80 transition-all duration-150',
                      'focus:bg-white dark:focus:bg-slate-900 focus:border-brand-500 dark:focus:border-brand-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20',
                    )}
                    aria-label={searchPlaceholder}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Standalone Filters Button (if search hidden) */}
              {showFilterToggle && (
                <button
                  type="button"
                  onClick={handleToggle}
                  aria-expanded={isExpanded}
                  className={cn(
                    'inline-flex items-center gap-2 h-10 px-3.5 rounded-xl text-xs font-semibold select-none transition-all duration-150 cursor-pointer shrink-0 border',
                    isExpanded
                      ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-700 ring-2 ring-brand-500/15'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700',
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>{filterButtonLabel}</span>
                  {activeFilterCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold bg-brand-600 text-white animate-scaleIn">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0',
                      isExpanded && 'rotate-180 text-brand-600 dark:text-brand-400',
                    )}
                  />
                </button>
              )}
            </>
          )}

          {/* Quick Clear Reset Button */}
          {showClearAction && resetHandler && (
            <button
              type="button"
              onClick={resetHandler}
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0"
              title="Reset all filters and search"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Right Side: Results Summary and Optional Actions */}
        {(resultsSummary || actions) && (
          <div className="flex items-center gap-3 self-end md:self-auto shrink-0 flex-wrap">
            {resultsSummary && (
              <div className="hidden sm:flex items-center">
                {resultsSummary}
              </div>
            )}
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filter Chips (if provided) */}
      {activeChips && activeChips.length > 0 && (
        <ActiveFilterChips
          chips={activeChips}
          onClearAll={onClearAllChips || resetHandler}
          className="px-1"
        />
      )}

      {/* Expandable Advanced Filters Panel */}
      <AnimatePresence initial={false}>
        {isExpanded && children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                'rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 p-4 sm:p-5 backdrop-blur-xs space-y-4',
                panelClassName,
              )}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Advanced Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                      ({activeFilterCount} active)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {onReset && (
                    <button
                      type="button"
                      onClick={onReset}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors cursor-pointer"
                    >
                      Reset to defaults
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Hide panel
                  </button>
                </div>
              </div>

              {/* Filter Controls Body */}
              <div>{children}</div>

              {/* Panel Footer / Summary */}
              {(filteredCount !== undefined || totalCount !== undefined) && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800 text-2xs text-slate-500 dark:text-slate-400">
                  <span>
                    Showing{' '}
                    <strong className="text-slate-700 dark:text-slate-200">
                      {filteredCount ?? totalCount}
                    </strong>
                    {totalCount !== undefined && filteredCount !== undefined && filteredCount !== totalCount && (
                      <> of {totalCount}</>
                    )}{' '}
                    {resultsLabel || 'records'}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="px-3 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300/70 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer transition-colors"
                  >
                    Apply &amp; Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
