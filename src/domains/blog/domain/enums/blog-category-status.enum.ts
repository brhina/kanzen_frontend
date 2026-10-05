export const BlogCategoryStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type BlogCategoryStatus = (typeof BlogCategoryStatus)[keyof typeof BlogCategoryStatus];
export type BlogCategoryStatusType = BlogCategoryStatus;
