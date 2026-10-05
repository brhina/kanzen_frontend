import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';
import { StarRating } from './StarRating';

export interface TestimonialCarouselProps {
  testimonials: TestimonialEntity[];
  autoPlayInterval?: number;
}

export function TestimonialCarousel({
  testimonials,
  autoPlayInterval = 6000,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [testimonials.length, autoPlayInterval, handleNext]);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl border border-primary-900/40">
      <Quote className="absolute top-6 right-8 h-20 w-20 text-white/5 pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <StarRating rating={current.rating} size="md" />

        <p className="text-xl sm:text-2xl font-medium leading-relaxed italic text-slate-100">
          "{current.content}"
        </p>

        <div className="flex items-center gap-4 pt-2">
          {current.avatar ? (
            <img
              src={current.avatar}
              alt={current.author}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-500/40"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center font-bold text-sm uppercase">
              {current.author.slice(0, 2)}
            </div>
          )}

          <div>
            <h4 className="text-base font-bold text-white">{current.author}</h4>
            <p className="text-xs text-primary-300">
              {current.role ? `${current.role}, ` : ''}
              <span className="font-semibold">{current.company}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {testimonials.length > 1 && (
        <div className="absolute bottom-8 right-8 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Previous Testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Next Testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
