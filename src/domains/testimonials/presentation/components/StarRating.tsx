import { useState } from 'react';
import { Star } from 'lucide-react';

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  interactive = false,
  onChange,
  size = 'md',
  className = '',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starIndex = index + 1;
        const isFilled = starIndex <= currentVal;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starIndex)}
            onMouseEnter={() => interactive && setHoverRating(starIndex)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={`transition-colors ${
              interactive
                ? 'cursor-pointer hover:scale-110 active:scale-95'
                : 'cursor-default pointer-events-none'
            }`}
            aria-label={`${starIndex} of ${maxRating} stars`}
          >
            <Star
              className={`${starSizes[size]} transition-all ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                  : 'fill-slate-200 dark:fill-slate-800 text-slate-300 dark:text-slate-700'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
