import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { authApi } from '../../infrastructure/auth.api';
import { authMapper } from '../../infrastructure/auth.mapper';
import type { LoginCredentialsDto } from '../../infrastructure/auth.dto';
import { useToastStore } from '@/shared/ui/toast';
import { queryKeys } from '@/core/cache/query-keys.factory';

export interface UseLoginOptions {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useLogin(options: UseLoginOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentialsDto) => authApi.login(credentials),
    onSuccess: (data) => {
      // Synchronize session tokens and user state
      authMapper.syncAuthStore(data);

      // Invalidate current user query to refresh cache
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });

      addToast({
        title: 'Welcome Back',
        message: `Successfully signed in as ${data?.user?.fullName || data?.user?.email || 'User'}`,
        type: 'success',
      });

      options.onSuccess?.();

      // Check return location from router state
      const locationState = location.state as { from?: string } | undefined;
      const targetDestination =
        options.redirectTo ?? locationState?.from ?? '/dashboard';
      navigate(targetDestination, { replace: true });
    },
    onError: (error: Error) => {
      addToast({
        title: 'Authentication Failed',
        message: error.message || 'Invalid email or password. Please try again.',
        type: 'error',
      });
      options.onError?.(error);
    },
  });
}
