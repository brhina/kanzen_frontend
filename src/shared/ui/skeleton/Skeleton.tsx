import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  count = 1,
  className,
  style,
  ...props
}: SkeletonProps) {
  const inlineStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  const variantClass =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'text'
        ? 'h-4 rounded'
        : 'rounded-lg';

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-800',
        variantClass,
        className,
      )}
      style={inlineStyle}
      aria-hidden="true"
      {...props}
    />
  ));

  return count === 1 ? items[0] : <div className="space-y-2">{items}</div>;
}
