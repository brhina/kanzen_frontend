import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useResetPassword } from '../../application/use-cases/useResetPassword';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  if (!token) {
    return (
      <Card className="w-full text-center p-6 shadow-xl border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl font-bold">Invalid Reset Token</CardTitle>
        <CardDescription className="text-xs mt-2">
          The password reset token is missing or malformed. Please request a new link from the login page.
        </CardDescription>
        <div className="pt-6">
          <Link to="/login">
            <Button variant="outline" size="md">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back to Login</span>
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword({
      token,
      password: data.password,
    });
  };

  return (
    <Card className="w-full shadow-2xl border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Reset Password
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
          Choose a secure, strong password for your Kanzen Tech account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {error && (
            <div
              role="alert"
              className="p-3 rounded-lg border border-red-200 bg-red-50 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
            >
              {error.message || 'Unable to reset password. Token may have expired.'}
            </div>
          )}

          <div>
            <label
              htmlFor="reset-password"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              New Password (min. 8 characters)
            </label>
            <Input
              id="reset-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              error={errors.password?.message}
              {...register('password')}
              leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          <div>
            <label
              htmlFor="reset-confirm"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Confirm New Password
            </label>
            <Input
              id="reset-confirm"
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
              size="lg"
              isLoading={isPending}
              className="w-full justify-center shadow-md shadow-brand-500/20"
            >
              <span>Set New Password</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ResetPasswordPage;
export { ResetPasswordPage as Component };
