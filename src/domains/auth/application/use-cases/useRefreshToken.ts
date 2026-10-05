import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/auth.store';
import { authApi } from '../../infrastructure/auth.api';

export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      const currentRefresh = useAuthStore.getState().refreshToken;
      if (!currentRefresh) {
        throw new Error('No refresh token available');
      }
      return authApi.refresh(currentRefresh);
    },
    onSuccess: (data) => {
      const currentRefresh = useAuthStore.getState().refreshToken;
      useAuthStore
        .getState()
        .setTokens(data.accessToken, data.refreshToken || currentRefresh || '');
    },
    onError: () => {
      // If refresh fails permanently, terminate session
      useAuthStore.getState().logout();
    },
  });
}
