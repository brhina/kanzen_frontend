import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useForgotPassword } from '../../application/use-cases/useForgotPassword';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  className?: string;
}

export function ForgotPasswordForm({
  onBackToLogin,
  className = '',
}: ForgotPasswordFormProps) {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const { mutate: forgotPassword, isPending } = useForgotPassword({
    onSuccess: () => {
      // Trigger success state view
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setSubmittedEmail(data.email);
    forgotPassword(data.email);
  };

  if (submittedEmail) {
    return (
      <div className={`space-y-6 text-center ${className}`}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Instructions Sent
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            If an account matching <strong className="text-slate-900 dark:text-white">{submittedEmail}</strong> exists,
            a secure password reset link has been dispatched to your inbox.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onBackToLogin}
          className="w-full justify-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          <span>Return to Sign In</span>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-5 ${className}`}
      noValidate
      aria-label="Forgot password request form"
    >
      <div className="space-y-1">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Enter your registered work email. If verified, we will generate a cryptographically signed recovery token.
        </p>
      </div>

      <div>
        <label
          htmlFor="forgot-email"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Work Email
        </label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="engineer@kanzen.tech"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
          leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
        />
      </div>

      <div className="space-y-3 pt-1">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isPending}
          className="w-full justify-center shadow-md shadow-brand-500/20"
        >
          <span>Send Recovery Instructions</span>
        </Button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white py-1 transition-colors focus:outline-none"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
