import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useChangePassword } from '../../application/use-cases/useChangePassword';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export interface ChangePasswordFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function ChangePasswordForm({
  onSuccess,
  className = '',
}: ChangePasswordFormProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { mutate: changePassword, isPending } = useChangePassword({
    onSuccess: () => {
      reset();
      onSuccess?.();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-4 ${className}`}
      noValidate
      aria-label="Change password form"
    >
      <div>
        <label
          htmlFor="current-password"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
        >
          Current Password
        </label>
        <Input
          id="current-password"
          type={showCurrent ? 'text' : 'password'}
          placeholder="••••••••••••"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
          leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowCurrent((p) => !p)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
      </div>

      <div>
        <label
          htmlFor="new-password"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
        >
          New Password (min. 8 characters)
        </label>
        <Input
          id="new-password"
          type={showNew ? 'text' : 'password'}
          placeholder="••••••••••••"
          error={errors.newPassword?.message}
          {...register('newPassword')}
          leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowNew((p) => !p)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
        >
          Confirm New Password
        </label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
          leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isPending}
          className="w-full justify-center"
        >
          <span>Update Password</span>
        </Button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
