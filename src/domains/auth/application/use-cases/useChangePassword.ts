import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../infrastructure/auth.api';
import type { ChangePasswordDto } from '../../infrastructure/auth.dto';
import { useToastStore } from '@/shared/ui/toast';

export interface UseChangePasswordOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useChangePassword(options: UseChangePasswordOptions = {}) {
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (dto: ChangePasswordDto) => authApi.changePassword(dto),
    onSuccess: (response) => {
      addToast({
        title: 'Password Updated',
        message: response.message || 'Your account password has been changed successfully.',
        type: 'success',
      });
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      addToast({
        title: 'Update Failed',
        message:
          error.message || 'Current password was incorrect or the new password is invalid.',
        type: 'error',
      });
      options.onError?.(error);
    },
  });
}
