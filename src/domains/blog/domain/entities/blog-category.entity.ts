import type { BlogCategoryStatus } from '../enums/blog-category-status.enum';

export interface BlogCategoryEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  order: number;
  status: BlogCategoryStatus;
  createdAt?: string;
  updatedAt?: string;
}
