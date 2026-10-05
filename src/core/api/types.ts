export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  code: string;
  message: string | string[];
  details?: unknown;
  path?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}
