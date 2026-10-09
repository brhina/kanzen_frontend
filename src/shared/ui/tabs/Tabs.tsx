import { useState, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab: controlledActiveTab,
  defaultTab,
  onChange,
  variant = 'pills',
  className,
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    defaultTab || tabs[0]?.id || '',
  );

  const active = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1.5',
        variant === 'pills'
          ? 'rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80 inline-flex'
          : 'border-b border-slate-200 dark:border-slate-800 w-full gap-6',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isSelected = tab.id === active;

        if (variant === 'underline') {
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isSelected}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'relative flex items-center gap-2 pb-3 pt-2 text-sm font-medium transition-colors select-none cursor-pointer',
                isSelected
                  ? 'text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                tab.disabled && 'pointer-events-none opacity-40',
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    isSelected
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
                  )}
                >
                  {tab.count}
                </span>
              )}
              {isSelected && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-500 dark:bg-brand-400 rounded-full" />
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isSelected}
            disabled={tab.disabled}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all select-none cursor-pointer',
              isSelected
                ? 'bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200',
              tab.disabled && 'pointer-events-none opacity-40',
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[11px]',
                  isSelected
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300'
                    : 'bg-slate-200/60 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
