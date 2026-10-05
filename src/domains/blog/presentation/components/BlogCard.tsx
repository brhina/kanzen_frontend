import { Link } from 'react-router';
import { Clock, Eye, Heart, Calendar, ArrowRight, Edit3 } from 'lucide-react';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';
import { BlogPostStatus } from '../../domain/enums/blog-post-status.enum';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';

export interface BlogCardProps {
  post: BlogPostEntity;
  onEdit?: (post: BlogPostEntity) => void;
  showAdminActions?: boolean;
}

const statusVariants: Record<string, 'neutral' | 'success' | 'warning' | 'info' | 'danger'> = {
  [BlogPostStatus.PUBLISHED]: 'success',
  [BlogPostStatus.DRAFT]: 'neutral',
  [BlogPostStatus.REVIEW]: 'warning',
  [BlogPostStatus.SCHEDULED]: 'info',
  [BlogPostStatus.ARCHIVED]: 'danger',
};

export function BlogCard({ post, onEdit, showAdminActions = true }: BlogCardProps) {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : post.createdAt
      ? new Date(post.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Unpublished';

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
      {/* Top Media / Thumbnail */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-brand-900/20 via-slate-900/40 to-cyan-900/20 p-6 text-center text-slate-400">
            <span className="text-sm font-semibold tracking-wide uppercase text-brand-600 dark:text-brand-400">
              Kanzen Engineering
            </span>
          </div>
        )}

        {/* Overlay category badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {post.categoryName && (
            <Badge variant="info" size="sm" className="backdrop-blur-md bg-slate-900/70 text-white border-0">
              {post.categoryName}
            </Badge>
          )}
          {post.status !== BlogPostStatus.PUBLISHED && (
            <Badge variant={statusVariants[post.status] || 'neutral'} size="sm" className="capitalize">
              {post.status}
            </Badge>
          )}
        </div>

        {/* Inline staff edit trigger button */}
        {showAdminActions && onEdit && (
          <PermissionGate permission="blog:write">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="secondary"
                size="xs"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(post);
                }}
                className="shadow-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex items-center gap-1"
                title="Edit Post"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </Button>
            </div>
          </PermissionGate>
        )}
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-3">
          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readingTime} min read</span>
            </span>
          </div>

          {/* Title Link */}
          <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400 line-clamp-2">
            <Link to={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Card Footer: Author + Metrics */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName || 'Author'}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {(post.authorName || 'K')[0]}
              </div>
            )}
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {post.authorName || 'Kanzen Team'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{post.viewCount}</span>
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>{post.likeCount}</span>
            </span>
            <Link
              to={`/blog/${post.slug}`}
              className="ml-1 text-brand-600 hover:text-brand-700 dark:text-brand-400"
              aria-label={`Read ${post.title}`}
            >
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogCard;
