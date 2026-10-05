import { useCallback, useMemo, useState } from 'react';
import { PAGINATION_DEFAULTS } from '../../core/config/constants';
import type { PaginationParams } from '../types/pagination.types';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialSortBy?: string;
  initialSortOrder?: 'asc' | 'desc';
}

export function usePagination(options: UsePaginationOptions = {}) {
  const [page, setPage] = useState<number>(options.initialPage ?? PAGINATION_DEFAULTS.defaultPage);
  const [limit, setLimit] = useState<number>(options.initialLimit ?? PAGINATION_DEFAULTS.defaultLimit);
  const [search, setSearch] = useState<string>(options.initialSearch ?? '');
  const [sortBy, setSortBy] = useState<string | undefined>(options.initialSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(options.initialSortOrder ?? 'desc');

  const setSort = useCallback((column: string) => {
    setSortBy((prevColumn) => {
      if (prevColumn === column) {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        return column;
      }
      setSortOrder('asc');
      return column;
    });
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page on search query change
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const nextPage = useCallback((totalPages?: number) => {
    setPage((curr) => {
      if (totalPages !== undefined && curr >= totalPages) return curr;
      return curr + 1;
    });
  }, []);

  const prevPage = useCallback(() => {
    setPage((curr) => Math.max(1, curr - 1));
  }, []);

  const reset = useCallback(() => {
    setPage(options.initialPage ?? PAGINATION_DEFAULTS.defaultPage);
    setLimit(options.initialLimit ?? PAGINATION_DEFAULTS.defaultLimit);
    setSearch(options.initialSearch ?? '');
    setSortBy(options.initialSortBy);
    setSortOrder(options.initialSortOrder ?? 'desc');
  }, [options]);

  const queryParams: PaginationParams = useMemo(() => {
    const params: PaginationParams = {
      page,
      limit,
    };
    if (search.trim()) params.search = search.trim();
    if (sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;
    }
    return params;
  }, [page, limit, search, sortBy, sortOrder]);

  return {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    queryParams,
    setPage,
    setLimit: handleLimitChange,
    setSearch: handleSearchChange,
    setSort,
    nextPage,
    prevPage,
    reset,
  };
}
