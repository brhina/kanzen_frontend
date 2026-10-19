import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import {
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
        className="w-full relative min-h-[620px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-between py-8 sm:py-10 lg:py-14 px-4 sm:px-8 lg:px-12 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 sm:px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 self-center max-w-full">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
          </span>
          <span className="truncate">Next-Generation Digital Infrastructure</span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">&bull;</span>
          <span className="font-mono uppercase tracking-wider text-[11px] text-brand-600 dark:text-brand-400 hidden sm:inline">
            High-Impact Engineering, Architecture &amp; AI
          </span>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4 my-auto px-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            High-Impact Engineering,{' '}
            <span className="text-brand-600 dark:text-brand-400">
              Architecture &amp; AI
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            {isLoading
              ? 'Loading latest platform dispatches...'
              : 'Enterprise cloud microservices, mission-critical distributed systems, and AI infrastructure.'}
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pt-2 w-full max-w-xs sm:max-w-none mx-auto">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto justify-center font-bold">
                <span>Start an Engagement</span>
              </Button>
            </Link>
            <Link to="/solutions" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto justify-center border-slate-200 dark:border-slate-800">
                <span>Explore Solutions</span>
              </Button>
            </Link>
          </div>
        </div>

        {proofPoints && proofPoints.length > 0 && (
          <div className="w-full max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-6">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
              {proofPoints.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 shadow-2xs text-[11px] sm:text-xs text-slate-700 dark:text-slate-300"
                >
                  <DynamicIcon name={item.icon || 'CheckCircle2'} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-500 shrink-0" />
                  <span className="font-semibold tracking-tight">{item.label}</span>
                </div>
              ))}
            </div>
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
      className="w-full relative min-h-[620px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-between py-8 sm:py-10 lg:py-14 bg-white dark:bg-slate-950 text-slate-900 dark:text-white select-none border-b border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      {/* Top Header Row: Live indicator & branding overline */}
      <div className="relative z-10 flex items-center justify-center sm:justify-start px-4 sm:px-8 lg:px-12 pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800 w-full">
        {/* Brand & live dispatch badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 sm:px-4 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-full">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
          </span>
          <span className="truncate">Next-Generation Digital Infrastructure</span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">&bull;</span>
          <span className="font-mono uppercase tracking-wider text-[11px] text-brand-600 dark:text-brand-400 hidden sm:inline">
            High-Impact Engineering, Architecture &amp; AI
          </span>
        </div>
      </div>

      {/* Full-Width Horizontal Scrolling & Auto-Changing Track */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none my-auto relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {updates.map((item) => (
          <div
            key={item.id}
            className="w-full min-w-full shrink-0 snap-center snap-always relative flex flex-col justify-center items-center text-center px-4 sm:px-8 lg:px-12 py-8 sm:py-8 lg:py-10 space-y-5 sm:space-y-6 overflow-hidden"
          >
            {/* If the post has an image, display it clearly visible behind the titles with gradient overlay */}
            {item.image && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <img
                  src={item.image}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover object-center opacity-70 dark:opacity-60 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/40 to-white/80 dark:from-slate-950/80 dark:via-slate-950/45 dark:to-slate-950/85" />
              </div>
            )}

            {/* Category Pill Badge + Tag + Date with thin border */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-800 dark:text-slate-200">
                {renderUpdateIcon(item.iconName, 'w-3.5 h-3.5 text-brand-500')}
                <span>{item.typeLabel}</span>
              </span>

              {item.isUpdated && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border border-brand-500/40 bg-brand-50/90 dark:bg-brand-950/80 backdrop-blur-xs text-brand-700 dark:text-brand-300">
                  Updated
                </span>
              )}

              {item.tag && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xs text-slate-600 dark:text-slate-400">
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
            <h1 className="relative z-10 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.2] sm:leading-[1.15] max-w-4xl mx-auto px-2 drop-shadow-xs dark:drop-shadow-sm">
              <Link
                to={item.href}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {item.title}
              </Link>
            </h1>

            {/* Action CTAs with mobile responsive layout */}
            <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pt-1 sm:pt-2 w-full max-w-xs sm:max-w-none mx-auto">
              <Link to={item.href} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
                  className="w-full sm:w-auto justify-center font-bold border border-brand-600"
                >
                  <span>{getActionLabel(item.type)}</span>
                </Button>
              </Link>

              <Link to="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto justify-center border-slate-200 dark:border-slate-800"
                >
                  <span>Start an Engagement</span>
                </Button>
              </Link>

              <Link to="/solutions" className="w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto justify-center border border-slate-200/60 dark:border-slate-800/60"
                >
                  <span>Explore Solutions</span>
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Area: Slide Indicator Dots & Technical Proof Points (with thin border-t) */}
      <div className="relative z-10 w-full border-t border-slate-200 dark:border-slate-800 pt-4 sm:pt-6 px-4 sm:px-8 lg:px-12 space-y-4 sm:space-y-6">
        {/* Slide Indicator Dots (1 to 5) */}
        <div
          role="tablist"
          aria-label="Post slides"
          className="flex items-center justify-center gap-2 py-1"
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
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
              {proofPoints.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 shadow-2xs text-[11px] sm:text-xs text-slate-700 dark:text-slate-300"
                >
                  <DynamicIcon name={item.icon || 'CheckCircle2'} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-500 shrink-0" />
                  <span className="font-semibold tracking-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroLatestUpdates;
