import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';
import { StarRating } from './StarRating';
import { cn } from '@/shared/utils/cn';

export interface TestimonialCarouselProps {
  testimonials: TestimonialEntity[];
  autoPlayInterval?: number;
  className?: string;
}

export function TestimonialCarousel({
  testimonials,
  autoPlayInterval = 6000,
  className = '',
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;
    const timer = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [testimonials.length, autoPlayInterval, isPaused, handleNext]);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-brand-50/40 via-white to-slate-50 text-slate-900 p-8 sm:p-12 shadow-xl shadow-slate-200/50 dark:border-slate-800/80 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white dark:shadow-2xl w-full transition-all',
        className,
      )}
    >
      <Quote className="absolute top-6 right-8 h-20 w-20 text-slate-900/5 dark:text-white/5 pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <StarRating rating={current.rating} size="md" />

        <p className="text-xl sm:text-2xl font-medium leading-relaxed italic text-slate-800 dark:text-slate-100 transition-opacity duration-300">
          "{current.content}"
        </p>

        <div className="flex items-center gap-4 pt-2">
          {current.avatar ? (
            <img
              src={current.avatar}
              alt={current.author}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-500/40"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm uppercase">
              {current.author.slice(0, 2)}
            </div>
          )}

          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{current.author}</h4>
            <p className="text-xs text-brand-700 dark:text-brand-300">
              {current.role ? `${current.role}, ` : ''}
              <span className="font-semibold">{current.company}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons and Indicators */}
      {testimonials.length > 1 && (
        <div className="relative z-10 flex items-center justify-between pt-6 mt-6 border-t border-slate-200/90 dark:border-white/10">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Testimonial slides">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  'h-2 rounded-full transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-400',
                  currentIndex === idx
                    ? 'w-6 bg-brand-500 dark:bg-brand-400'
                    : 'w-2 bg-slate-300 hover:bg-slate-400 dark:bg-white/30 dark:hover:bg-white/60',
                )}
                title={`Go to slide ${idx + 1}`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-selected={currentIndex === idx}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-xs dark:border-slate-700/80 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-400"
              title="Previous Testimonial"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-xs dark:border-slate-700/80 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-400"
              title="Next Testimonial"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
