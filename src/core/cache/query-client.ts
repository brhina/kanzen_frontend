import { QueryClient } from '@tanstack/react-query';
import { QUERY_CONFIG } from '../config/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.defaultStaleTime,
      gcTime: QUERY_CONFIG.defaultGcTime,
      retry: QUERY_CONFIG.defaultRetryCount,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
