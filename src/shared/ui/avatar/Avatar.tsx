import { useState, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/string';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'busy' | 'offline';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusClasses: Record<AvatarStatus, string> = {
  online: 'bg-emerald-500',
  busy: 'bg-amber-500',
  offline: 'bg-slate-400',
};

export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  status,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name || alt);

  const showImage = src && !imageError;

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden bg-slate-100 font-semibold text-slate-700 select-none dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials || '?'}</span>
      )}

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900',
            statusClasses[status],
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
