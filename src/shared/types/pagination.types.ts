import type { PaginationMeta } from '../../core/api/types';

export type { PaginationMeta };

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TableSortState {
  column: string;
  direction: 'asc' | 'desc';
}
