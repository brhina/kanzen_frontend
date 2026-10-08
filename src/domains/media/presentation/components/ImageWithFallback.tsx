import { useState, type ImgHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

export interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackText?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc,
  fallbackText = 'Image unavailable',
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt={alt || fallbackText}
          className={className}
          onError={() => setHasError(true)}
          {...props}
        />
      );
    }

    return (
      <div
        className={cn(
          'flex items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 text-xs font-mono select-none',
          className,
        )}
        aria-label={alt || fallbackText}
      >
        <span>{fallbackText}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
      {...props}
    />
  );
}
