import { useMemo } from 'react';
import { Link } from 'react-router';
import { Edit3, Trash2, Send, Clock } from 'lucide-react';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';
import { BlogPostStatus } from '../../domain/enums/blog-post-status.enum';
import { Table, type ColumnDef } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';

export interface BlogTableProps {
  posts: BlogPostEntity[];
  onEdit: (post: BlogPostEntity) => void;
  onDelete: (post: BlogPostEntity) => void;
  onPublishToggle: (post: BlogPostEntity) => void;
  isLoading?: boolean;
}

const statusVariants: Record<string, 'neutral' | 'success' | 'warning' | 'info' | 'danger'> = {
  [BlogPostStatus.PUBLISHED]: 'success',
  [BlogPostStatus.DRAFT]: 'neutral',
  [BlogPostStatus.REVIEW]: 'warning',
  [BlogPostStatus.SCHEDULED]: 'info',
  [BlogPostStatus.ARCHIVED]: 'danger',
};

export function BlogTable({
  posts,
  onEdit,
  onDelete,
  onPublishToggle,
  isLoading = false,
}: BlogTableProps) {
  const columns = useMemo<ColumnDef<BlogPostEntity, any>[]>(
    () => [
      {
        id: 'article',
        header: 'Article',
        cell: ({ row }: { row: { original: BlogPostEntity } }) => {
          const post = row.original;
          return (
            <div className="max-w-xs">
              <Link
                to={`/blog/${post.slug}`}
                className="font-semibold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400 line-clamp-1 transition-colors"
              >
                {post.title}
              </Link>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                /{post.slug}
              </div>
            </div>
          );
        },
      },
      {
        id: 'category',
        header: 'Category',
        cell: ({ row }: { row: { original: BlogPostEntity } }) => (
          <span className="text-xs text-slate-700 dark:text-slate-300">
            {row.original.categoryName || 'General'}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }: { row: { original: BlogPostEntity } }) => {
          const post = row.original;
          return (
            <Badge
              variant={statusVariants[post.status] || 'neutral'}
              size="sm"
              className="capitalize"
            >
              {post.status}
            </Badge>
          );
        },
      },
      {
        id: 'metrics',
        header: 'Engagement',
        cell: ({ row }: { row: { original: BlogPostEntity } }) => {
          const post = row.original;
          return (
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {post.viewCount} views &bull; {post.likeCount} likes
            </div>
          );
        },
      },
      {
        id: 'date',
        header: 'Date',
        cell: ({ row }: { row: { original: BlogPostEntity } }) => {
          const post = row.original;
          const dateStr = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString()
            : post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : '—';
          return (
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{dateStr}</span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: BlogPostEntity } }) => {
          const post = row.original;
          const isPublished = post.status === BlogPostStatus.PUBLISHED;

          return (
            <div className="flex items-center justify-end gap-1.5">
              <PermissionGate permission="blog:publish">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => onPublishToggle(post)}
                  title={isPublished ? 'Unpublish (convert to draft)' : 'Publish immediately'}
                  className="text-xs"
                >
                  {isPublished ? (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Draft</span>
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Send className="h-3.5 w-3.5" />
                      <span>Publish</span>
                    </span>
                  )}
                </Button>
              </PermissionGate>

              <PermissionGate permission="blog:write">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => onEdit(post)}
                  className="flex items-center gap-1"
                  title="Edit Article"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Edit</span>
                </Button>
              </PermissionGate>

              <PermissionGate permission="blog:delete">
                <Button
                  type="button"
                  variant="danger"
                  size="xs"
                  onClick={() => onDelete(post)}
                  title="Delete Article"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </PermissionGate>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete, onPublishToggle],
  );

  return (
    <Table<BlogPostEntity>
      data={posts}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No articles found matching current filters."
    />
  );
}

export default BlogTable;
