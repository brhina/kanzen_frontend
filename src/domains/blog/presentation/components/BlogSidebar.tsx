import { Link } from 'react-router';
import { TrendingUp, Tag, Mail } from 'lucide-react';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';
import type { BlogCategoryEntity } from '../../domain/entities/blog-category.entity';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export interface BlogSidebarProps {
  featuredPosts?: BlogPostEntity[];
  categories?: BlogCategoryEntity[];
}

export function BlogSidebar({ featuredPosts = [], categories = [] }: BlogSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Featured Articles Widget */}
      {featuredPosts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span>Featured Engineering</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredPosts.slice(0, 4).map((post) => (
              <div key={post.id} className="space-y-1">
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-xs font-semibold text-slate-800 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400 line-clamp-2 transition-colors"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{post.readingTime} min read</span>
                  <span>&bull;</span>
                  <span>{post.viewCount} views</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Categories Widget */}
      {categories.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Tag className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span>Explore Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/blog/category/${cat.slug}`}
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white transition-colors"
                >
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Newsletter Mini CTA */}
      <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-900/10 via-slate-900/10 to-indigo-900/10 p-5 dark:border-brand-500/30 dark:bg-slate-900/70 space-y-3">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider">
          <Mail className="h-4 w-4" />
          <span>Engineering Dispatch</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Bi-weekly architecture breakdowns, distributed systems patterns, and cloud cost engineering.
        </p>
        <Link to="/newsletter">
          <Button variant="primary" size="xs" className="w-full mt-1">
            Subscribe Free
          </Button>
        </Link>
      </div>
    </aside>
  );
}

export default BlogSidebar;
