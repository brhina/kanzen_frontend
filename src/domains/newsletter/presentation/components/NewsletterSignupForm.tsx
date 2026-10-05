import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSubscribeNewsletter } from '../../application/use-cases/useSubscribeNewsletter';
import type { SubscribeNewsletterDto } from '../../infrastructure/newsletter.dto';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { CheckCircle2, Mail, Sparkles } from 'lucide-react';

const TOPIC_TAGS = [
  { id: 'architecture', label: 'Distributed Systems' },
  { id: 'cloud-devops', label: 'Cloud & Kubernetes' },
  { id: 'fintech', label: 'FinTech & Banking' },
  { id: 'ai-automation', label: 'AI Engineering' },
];

interface NewsletterSignupFormProps {
  source?: string;
  compact?: boolean;
  onSuccess?: () => void;
  className?: string;
}

export function NewsletterSignupForm({
  source = 'newsletter_page',
  compact = false,
  onSuccess,
  className = '',
}: NewsletterSignupFormProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(['architecture']);
  const subscribe = useSubscribeNewsletter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeNewsletterDto>({
    defaultValues: {
      email: '',
      firstName: '',
      source,
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const onSubmit = async (data: SubscribeNewsletterDto) => {
    try {
      await subscribe.mutateAsync({
        ...data,
        source,
        tags: selectedTags,
      });
      setIsSubscribed(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Subscription failed', err);
    }
  };

  if (isSubscribed) {
    return (
      <div className="p-6 text-center space-y-3 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Check Your Inbox!
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
          We have sent a confirmation link to your email. Click it to confirm your subscription to the Kanzen Architecture Dispatch.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsSubscribed(false);
            reset();
          }}
        >
          Subscribe Another Email
        </Button>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={`space-y-3 ${className}`}>
        {subscribe.isError && (
          <div className="text-xs text-red-600 dark:text-red-400">
            {subscribe.error?.message || 'Subscription failed. Please retry.'}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="engineering-lead@company.com"
            type="email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
            className="flex-1"
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={subscribe.isPending}
            className="shrink-0"
          >
            Subscribe
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-5 ${className}`}>
      {subscribe.isError && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
          {subscribe.error?.message || 'Subscription failed. Please verify email and try again.'}
        </div>
      )}

      {/* Topic Tag Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          Technical Focus Areas
        </label>
        <div className="flex flex-wrap gap-2 pt-1">
          {TOPIC_TAGS.map((t) => {
            const isSelected = selectedTags.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleTag(t.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-brand-500'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name (Optional)"
          placeholder="David"
          {...register('firstName')}
        />
        <Input
          label="Work Email *"
          type="email"
          placeholder="david@company.com"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
      </div>

      <div className="pt-1">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={subscribe.isPending}
          leftIcon={<Mail className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Subscribe to Architecture Dispatch
        </Button>
      </div>
    </form>
  );
}
