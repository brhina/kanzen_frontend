import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/core/auth/auth.store';
import { authApi } from '../../infrastructure/auth.api';
import { useToastStore } from '@/shared/ui/toast';

export interface UseLogoutOptions {
  redirectTo?: string;
  onSuccess?: () => void;
}

export function useLogout(options: UseLogoutOptions = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          await authApi.logout(refreshToken);
        } catch {
          // Proceed with local teardown even if remote call fails (e.g. offline)
        }
      }
    },
    onSettled: () => {
      // Clear client store
      useAuthStore.getState().logout();

      // Reset query cache to remove cached private data
      queryClient.clear();

      addToast({
        title: 'Signed Out',
        message: 'You have been successfully signed out.',
        type: 'info',
      });

      options.onSuccess?.();
      navigate(options.redirectTo ?? '/', { replace: true });
    },
  });
}
