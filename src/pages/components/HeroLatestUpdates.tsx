import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  BookOpen,
  FolderGit2,
  GraduationCap,
  Video,
  Package,
  Layers,
  Cpu,
  Sparkles,
} from 'lucide-react';
import {
  useHeroLatestUpdates,
  type HeroUpdateItem,
} from '../hooks/useHeroLatestUpdates';
import { Button } from '@/shared/ui/button';
import { DynamicIcon } from '@/shared/ui/icon/DynamicIcon';
import { cn } from '@/shared/utils/cn';

const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  FolderGit2,
  GraduationCap,
  Video,
  Package,
  Layers,
  Cpu,
  Sparkles,
};

function renderUpdateIcon(iconName: string, className = 'w-4 h-4') {
  const Comp = ICON_COMPONENTS[iconName] || Sparkles;
  return <Comp className={className} />;
}

export interface HeroLatestUpdatesProps {
  proofPoints?: { label: string; icon?: string }[];
}

export function HeroLatestUpdates({ proofPoints }: HeroLatestUpdatesProps) {
  const { updates, isLoading } = useHeroLatestUpdates();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const total = updates.length;

  // Smoothly scroll horizontally to a specific slide index
  const scrollToSlide = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const width = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollTo({
      left: index * width,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  }, []);

  const handleNext = useCallback(() => {
    if (total === 0) return;
    const nextIndex = (activeIndex + 1) % total;
    scrollToSlide(nextIndex);
  }, [total, activeIndex, scrollToSlide]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    const prevIndex = (activeIndex - 1 + total) % total;
    scrollToSlide(prevIndex);
  }, [total, activeIndex, scrollToSlide]);

  // Auto-changing / scrolling timer: smoothly advances horizontally every 5 seconds unless paused
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % total;
        if (scrollContainerRef.current) {
          const width = scrollContainerRef.current.clientWidth;
          scrollContainerRef.current.scrollTo({
            left: next * width,
            behavior: 'smooth',
          });
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [total, isPaused]);

  // Sync activeIndex when the user manually scrolls or swipes horizontally
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const width = scrollContainerRef.current.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex >= 0 && newIndex < total && newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  if (total === 0) {
    return (
      <div
        role="region"
        aria-label="Latest engineering dispatches and system updates"
        className="w-full relative min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between py-10 px-4 sm:px-8 lg:px-12 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 self-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
          </span>
          <span>Next-Generation Digital Infrastructure</span>
          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
          <span className="font-mono uppercase tracking-wider text-[11px] text-brand-600 dark:text-brand-400">
            High-Impact Engineering, Architecture &amp; AI
          </span>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4 my-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
            High-Impact Engineering,{' '}
            <span className="text-brand-600 dark:text-brand-400">
              Architecture &amp; AI
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            {isLoading
              ? 'Loading latest platform dispatches...'
              : 'Enterprise cloud microservices, mission-critical distributed systems, and AI infrastructure.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/contact">
              <Button variant="primary" size="lg">
                <span>Start an Engagement</span>
              </Button>
            </Link>
            <Link to="/solutions">
              <Button variant="outline" size="lg" className="border-slate-200 dark:border-slate-800">
                <span>Explore Solutions</span>
              </Button>
            </Link>
          </div>
        </div>

        {proofPoints && proofPoints.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-medium text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-6">
            {proofPoints.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
              >
                <DynamicIcon name={item.icon || 'CheckCircle2'} className="h-4 w-4 text-brand-500" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const getActionLabel = (type: HeroUpdateItem['type']) => {
    switch (type) {
      case 'blog':
        return 'Read Article';
      case 'training':
        return 'Reserve Workshop Cohort';
      case 'consultation':
        return 'Book Discovery Call';
      case 'product':
        return 'Explore Product Platform';
      case 'solution':
        return 'View Enterprise Solution';
      case 'service':
        return 'Explore Service Syllabus';
      case 'portfolio':
        return 'View Case Study';
      default:
        return 'Explore Update';
    }
  };

  return (
    <div
      role="region"
      aria-label="Latest engineering dispatches and system updates"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full relative min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between py-8 sm:py-12 lg:py-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-white select-none border-b border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      {/* Top Header Row: Live indicator, branding overline, counter & controls (with thin border-b) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8 lg:px-12 pb-6 border-b border-slate-200 dark:border-slate-800 w-full">
        {/* Brand & live dispatch badge with thin border */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
          </span>
          <span>Next-Generation Digital Infrastructure</span>
          <span className="text-slate-300 dark:text-slate-700">&bull;</span>
          <span className="font-mono uppercase tracking-wider text-[11px] text-brand-600 dark:text-brand-400">
            High-Impact Engineering, Architecture &amp; AI
          </span>
        </div>

        {/* Slide Counter and Horizontal Controls with thin borders */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
            [ 0{activeIndex + 1} / 0{total} ]
          </span>

          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono hidden md:inline-block">
            {isPaused ? 'Paused' : 'Auto-changing & scrolling'}
          </span>

          {/* Auto-play pause / resume toggle */}
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? 'Resume auto changing' : 'Pause auto changing'}
            title={isPaused ? 'Resume auto rotation' : 'Pause auto rotation'}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Step buttons */}
          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous update"
              title="Previous update"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next update"
              title="Next update"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Horizontal Scrolling & Auto-Changing Track */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none my-auto relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {updates.map((item, idx) => (
          <div
            key={item.id}
            className="w-full min-w-full shrink-0 snap-center snap-always relative flex flex-col justify-center items-center text-center px-4 sm:px-8 lg:px-12 py-10 space-y-6 overflow-hidden"
          >
            {/* If the post has an image, display it behind the titles and descriptions with subtle overlay */}
            {item.image && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <img
                  src={item.image}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover opacity-15 dark:opacity-20 filter blur-xs scale-105"
                />
                <div className="absolute inset-0 bg-white/75 dark:bg-slate-950/80" />
              </div>
            )}

            {/* Category Pill Badge + Tag + Date with thin border */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                {renderUpdateIcon(item.iconName, 'w-3.5 h-3.5 text-brand-500')}
                <span>{item.typeLabel}</span>
              </span>

              {item.tag && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
                  {item.tag}
                </span>
              )}

              {item.dateFormatted && (
                <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">
                  &bull; {item.dateFormatted}
                </span>
              )}
            </div>

            {/* Grand Post Title (Just the post only, no extra descriptions) */}
            <h1 className="relative z-10 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15] max-w-4xl mx-auto">
              <Link
                to={item.href}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {item.title}
              </Link>
            </h1>

            {/* Action CTAs with thin borders */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to={item.href}>
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold border border-brand-600"
                >
                  <span>{getActionLabel(item.type)}</span>
                </Button>
              </Link>

              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-slate-200 dark:border-slate-800">
                  <span>Start an Engagement</span>
                </Button>
              </Link>

              <Link to="/solutions">
                <Button variant="ghost" size="lg" className="border border-slate-200/60 dark:border-slate-800/60">
                  <span>Explore Solutions</span>
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Area: Slide Indicator Dots & Technical Proof Points (with thin border-t) */}
      <div className="relative z-10 w-full border-t border-slate-200 dark:border-slate-800 pt-6 px-4 sm:px-8 lg:px-12 space-y-6">
        {/* Slide Indicator Dots (1 to 5) */}
        <div
          role="tablist"
          aria-label="Post slides"
          className="flex items-center justify-center gap-2"
        >
          {updates.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${item.title}`}
              aria-selected={activeIndex === idx}
              title={`Switch to: ${item.title}`}
              className={cn(
                'h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-brand-500 border',
                activeIndex === idx
                  ? 'w-10 bg-brand-500 border-brand-500'
                  : 'w-2.5 bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700',
              )}
            />
          ))}
        </div>

        {/* Technical Proof Points with thin borders */}
        {proofPoints && proofPoints.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            {proofPoints.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
              >
                <DynamicIcon name={item.icon || 'CheckCircle2'} className="h-4 w-4 text-brand-500" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroLatestUpdates;
