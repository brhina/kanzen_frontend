import { HeaderBanner } from '@/layouts/components/HeaderBanner';

export interface BlogHeroProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  totalArticles?: number;
}

export function BlogHero({ totalArticles = 0 }: BlogHeroProps) {
  return (
    <HeaderBanner
      badge={
        <>
          <span>Engineering Insights & Architecture</span>
          {totalArticles > 0 && (
            <>
              <span className="text-brand-500 mx-1.5">&bull;</span>
              <span>{totalArticles} Articles Published</span>
            </>
          )}
        </>
      }
      title={
        <>
          Architectural Blueprints <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 dark:from-brand-400 dark:via-indigo-300 dark:to-cyan-400 bg-clip-text text-transparent">
            &amp; Engineering Radar
          </span>
        </>
      }
      description="Deep dives into distributed systems, event-driven microservices, high-throughput pipelines, and production AI engineering."
    />
  );
}

export default BlogHero;
