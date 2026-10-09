import { useRef, useState, type ReactNode } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useUIStore, type ThemeMode } from '@/core/stores/ui.store';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { cn } from '@/shared/utils/cn';

export interface ThemeToggleProps {
  variant?: 'dropdown' | 'segmented';
  className?: string;
  align?: 'left' | 'right';
}

interface ThemeOption {
  value: ThemeMode;
  label: string;
  description: string;
  icon: ReactNode;
}

export function ThemeToggle({
  variant = 'dropdown',
  className = '',
  align = 'right',
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const themeOptions: ThemeOption[] = [
    {
      value: 'light',
      label: 'Light',
      description: 'Clean, high-clarity daylight theme',
      icon: <Sun className="h-4 w-4" />,
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Deep contrast, reduced eye fatigue',
      icon: <Moon className="h-4 w-4" />,
    },
    {
      value: 'system',
      label: 'System',
      description: `Follows your OS appearance (currently ${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`,
      icon: <Laptop className="h-4 w-4" />,
    },
  ];

  if (variant === 'segmented') {
    return (
      <div
        role="group"
        aria-label="Theme mode selector"
        className={cn(
          'inline-flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80',
          className,
        )}
      >
        {themeOptions.map((option) => {
          const isActive = theme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              aria-pressed={isActive}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer',
                isActive
                  ? 'bg-white text-brand-600 shadow-xs dark:bg-slate-900 dark:text-brand-400 font-semibold ring-1 ring-slate-200/60 dark:ring-slate-700/60'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/40',
              )}
              title={`${option.label}: ${option.description}`}
            >
              <span className={cn('shrink-0', isActive ? 'text-brand-500' : 'text-slate-400 dark:text-slate-500')}>
                {option.icon}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown variant (Header default)
  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Current theme: ${theme} (active: ${resolvedTheme}). Click to choose theme.`}
        title={`Theme: ${theme.toUpperCase()} (${resolvedTheme} active). Click to change.`}
        className={cn(
          'relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 p-2 text-slate-600 shadow-xs backdrop-blur-xs transition-all hover:border-brand-500/50 hover:bg-slate-100 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-brand-400/50 dark:hover:bg-slate-800 dark:hover:text-brand-400 cursor-pointer',
          isOpen && 'ring-2 ring-brand-500/30 border-brand-500/50 dark:border-brand-400/50',
        )}
      >
        {theme === 'light' ? (
          <Sun className="h-4 w-4 text-amber-500 transition-transform hover:rotate-45" />
        ) : theme === 'dark' ? (
          <Moon className="h-4 w-4 text-indigo-400 transition-transform hover:-rotate-12" />
        ) : (
          <Laptop className="h-4 w-4 text-brand-500 transition-transform" />
        )}
        {theme === 'system' && (
          <span
            className={cn(
              'absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full ring-1 ring-white dark:ring-slate-900',
              resolvedTheme === 'dark' ? 'bg-indigo-400' : 'bg-amber-500',
            )}
          />
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Theme options"
          className={cn(
            'absolute z-50 mt-2 w-64 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-all animate-in fade-in-0 zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Appearance &amp; Theme
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Active mode:{' '}
              <span className="font-semibold text-brand-600 dark:text-brand-400 capitalize">
                {theme}
              </span>{' '}
              {theme === 'system' && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  ({resolvedTheme} rendered)
                </span>
              )}
            </p>
          </div>

          <div className="space-y-1">
            {themeOptions.map((option) => {
              const isSelected = theme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setTheme(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all cursor-pointer',
                    isSelected
                      ? 'bg-brand-50/80 text-brand-900 dark:bg-brand-950/40 dark:text-brand-200 ring-1 ring-brand-500/20'
                      : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/70',
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
                      isSelected
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700 dark:group-hover:text-white',
                    )}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{option.label}</span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeToggle;
