import { useState } from 'react';
import { Calendar, Clock, Eye, Heart, Share2, Check } from 'lucide-react';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { toast } from '@/shared/ui/toast/toast.store';

export interface BlogPostContentProps {
  post: BlogPostEntity;
  onLike?: () => void;
  isLiking?: boolean;
}

export function BlogPostContent({ post, onLike, isLiking = false }: BlogPostContentProps) {
  const [copied, setCopied] = useState(false);

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : post.createdAt
      ? new Date(post.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Unpublished';

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Article link copied to clipboard!', 'Link Copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* Header section */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {post.categoryName && (
            <Badge variant="info" size="md">
              {post.categoryName}
            </Badge>
          )}
          {post.isFeatured && (
            <Badge variant="warning" size="md">
              Featured Deep-Dive
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-slate-900 dark:text-white leading-[1.15]">
          {post.title}
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Metadata & Author Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName || 'Author'}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-500/20"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                {(post.authorName || 'K')[0]}
              </div>
            )}
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">
                {post.authorName || 'Kanzen Engineering'}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formattedDate}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{post.readingTime} min read</span>
                </span>
              </div>
            </div>
          </div>

          {/* Share & Metrics */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
              <Eye className="h-3.5 w-3.5" />
              <span>{post.viewCount} views</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onLike}
              isLoading={isLiking}
              className="flex items-center gap-1.5 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/40"
            >
              <Heart className="h-4 w-4 fill-current text-red-500" />
              <span>{post.likeCount}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-1.5"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Cover Image */}
      {post.coverImage && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Main Content Body */}
      <div
        className="prose prose-slate prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand-600 prose-pre:bg-slate-900 prose-pre:text-slate-100 dark:prose-pre:bg-slate-950 prose-img:rounded-xl leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags section */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Topics:
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author Card Footer */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center gap-4">
          {post.authorAvatar ? (
            <img
              src={post.authorAvatar}
              alt={post.authorName || 'Author'}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-500"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
              {(post.authorName || 'K')[0]}
            </div>
          )}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Written by {post.authorName || 'Kanzen Engineering'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Staff Architect &bull; Kanzen Technology Solutions. Delivering resilient distributed architectures and AI systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPostContent;
