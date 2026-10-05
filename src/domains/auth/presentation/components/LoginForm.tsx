import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useLogin } from '../../application/use-cases/useLogin';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  onForgotPasswordClick?: () => void;
  className?: string;
}

export function LoginForm({ onForgotPasswordClick, className = '' }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-5 ${className}`}
      noValidate
      aria-label="Sign in form"
    >
      {/* Server Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to sign in</p>
            <p className="mt-0.5">{error.message || 'Invalid email or password.'}</p>
          </div>
        </div>
      )}

      {/* Email Field */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Work Email
        </label>
        <div className="relative">
          <Input
            id="login-email"
            type="email"
            placeholder="engineer@kanzen.tech"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
            leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="login-password"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Password
          </label>
          {onForgotPasswordClick && (
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors focus:outline-none"
            >
              Forgot password?
            </button>
          )}
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
            leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isPending}
        className="w-full justify-center shadow-md shadow-brand-500/20"
      >
        <span>Sign In to Console</span>
      </Button>
    </form>
  );
}

export default LoginForm;
