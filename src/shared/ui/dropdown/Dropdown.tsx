import {
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { cn } from '../../utils/cn';

export interface DropdownItem {
  id?: string;
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items?: DropdownItem[];
  children?: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  children,
  align = 'right',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen((prev) => !prev)} className="inline-flex cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            'absolute z-50 mt-2 min-w-[180px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {items
            ? items.map((item, index) => {
                if (item.divider) {
                  return (
                    <div
                      key={`divider-${index}`}
                      className="my-1 border-t border-slate-100 dark:border-slate-800"
                    />
                  );
                }

                return (
                  <button
                    key={item.id || index}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors',
                      item.destructive
                        ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                      item.disabled &&
                        'pointer-events-none opacity-40 cursor-not-allowed',
                    )}
                  >
                    {item.icon && (
                      <span className="shrink-0 text-current">{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </button>
                );
              })
            : children}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  icon,
  destructive = false,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors cursor-pointer',
        destructive
          ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'
          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0 text-current">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
