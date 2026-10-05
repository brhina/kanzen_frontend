import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authApi } from '../../infrastructure/auth.api';
import { useToastStore } from '@/shared/ui/toast';

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface UseResetPasswordOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useResetPassword(options: UseResetPasswordOptions = {}) {
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: ({ token, password }: ResetPasswordPayload) =>
      authApi.resetPassword(token, password),
    onSuccess: (response) => {
      addToast({
        title: 'Password Reset Successful',
        message: response.message || 'You can now sign in with your new password.',
        type: 'success',
      });
      options.onSuccess?.();
      navigate('/login', { replace: true });
    },
    onError: (error: Error) => {
      addToast({
        title: 'Reset Failed',
        message:
          error.message ||
          'Password reset token is invalid or has expired. Please request a new link.',
        type: 'error',
      });
      options.onError?.(error);
    },
  });
}
