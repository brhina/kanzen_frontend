export const BlogPostStatus = {
  DRAFT: 'draft',
  REVIEW: 'review',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type BlogPostStatus = (typeof BlogPostStatus)[keyof typeof BlogPostStatus];
export type BlogPostStatusType = BlogPostStatus;
