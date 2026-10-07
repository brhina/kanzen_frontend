import { Sparkles } from 'lucide-react';

export interface BlogHeroProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  totalArticles?: number;
}

export function BlogHero({ totalArticles = 0 }: BlogHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
      {/* Background glow or accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span>Engineering Insights &amp; Architecture</span>
          {totalArticles > 0 && (
            <>
              <span className="text-brand-500">&bull;</span>
              <span>{totalArticles} Articles Published</span>
            </>
          )}
        </div>

        <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white">
          Architectural Blueprints <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            &amp; Engineering Radar
          </span>
        </h1>

        <p className="text-base text-slate-300 sm:text-lg leading-relaxed max-w-2xl">
          Deep dives into distributed systems, event-driven microservices, high-throughput pipelines, and production AI engineering.
        </p>
      </div>
    </div>
  );
}

export default BlogHero;
