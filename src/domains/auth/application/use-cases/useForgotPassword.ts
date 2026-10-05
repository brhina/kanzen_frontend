import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../infrastructure/auth.api';
import { useToastStore } from '@/shared/ui/toast';

export interface UseForgotPasswordOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useForgotPassword(options: UseForgotPasswordOptions = {}) {
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: (response) => {
      addToast({
        title: 'Reset Link Dispatched',
        message:
          response.message ||
          'If the email address exists in our system, instructions have been sent.',
        type: 'success',
      });
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      addToast({
        title: 'Request Failed',
        message: error.message || 'Unable to process password reset request.',
        type: 'error',
      });
      options.onError?.(error);
    },
  });
}
