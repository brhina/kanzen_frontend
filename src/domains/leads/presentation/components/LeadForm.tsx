import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSubmitLead } from '../../application/use-cases/useSubmitLead';
import type { CreateLeadDto } from '../../infrastructure/leads.dto';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { CheckCircle2, Send, Sparkles } from 'lucide-react';

const SERVICE_OPTIONS = [
  { id: 'custom-software', label: 'Custom Software' },
  { id: 'saas-engineering', label: 'SaaS Platforms' },
  { id: 'cloud-devops', label: 'Cloud & DevOps' },
  { id: 'ai-automation', label: 'AI & Automation' },
  { id: 'architecture-review', label: 'Architecture Review' },
  { id: 'modernization', label: 'Legacy Modernization' },
];

const BUDGET_OPTIONS = [
  { value: 15000, label: '$10k – $25k' },
  { value: 35000, label: '$25k – $50k' },
  { value: 75000, label: '$50k – $100k' },
  { value: 150000, label: '$100k+' },
];

const TIMELINE_OPTIONS = [
  { value: 'immediately', label: 'Immediately' },
  { value: '1-3months', label: '1 – 3 Months' },
  { value: '3-6months', label: '3 – 6 Months' },
  { value: '6months+', label: '6+ Months' },
];

interface LeadFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function LeadForm({ onSuccess, className = '' }: LeadFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitLead = useSubmitLead();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateLeadDto>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      message: '',
      serviceInterest: ['custom-software'],
      budget: 35000,
      budgetCurrency: 'USD',
      timeline: '1-3months',
      source: 'website',
    },
  });

  const onSubmit = async (data: CreateLeadDto) => {
    try {
      await submitLead.mutateAsync(data);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Lead submission failed', err);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`p-8 text-center space-y-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl ${className}`}>
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Inquiry Received Successfully!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Thank you for reaching out. Our engineering solutions team will review your requirements and respond with an architectural proposal within 24 hours.
        </p>
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsSubmitted(false);
              reset();
            }}
          >
            Submit Another Project Brief
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
      {submitLead.isError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          {submitLead.error?.message || 'Failed to submit inquiry. Please try again.'}
        </div>
      )}

      {/* Service Interests Selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-brand-600" />
          Primary Technical Focus
        </label>
        <Controller
          control={control}
          name="serviceInterest"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2 pt-1">
              {SERVICE_OPTIONS.map((srv) => {
                const isSelected = (field.value || []).includes(srv.id);
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => {
                      const next = isSelected
                        ? field.value?.filter((id) => id !== srv.id) || []
                        : [...(field.value || []), srv.id];
                      field.onChange(next);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-brand-500'
                    }`}
                  >
                    {srv.label}
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      {/* Contact Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Your Name *"
            placeholder="Jane Doe"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
        </div>
        <div>
          <Input
            label="Work Email *"
            type="email"
            placeholder="jane@company.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Company Name"
            placeholder="Acme Global Inc."
            {...register('company')}
          />
        </div>
        <div>
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 555 019 2831"
            {...register('phone')}
          />
        </div>
      </div>

      {/* Budget & Timeline Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Estimated Budget (USD)
          </label>
          <Controller
            control={control}
            name="budget"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      field.value === opt.value
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Target Delivery Timeline
          </label>
          <Controller
            control={control}
            name="timeline"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      field.value === opt.value
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>
      </div>

      {/* Project Description */}
      <div>
        <Textarea
          label="Project Brief & Technical Scope"
          rows={4}
          placeholder="Describe your current challenge, target architecture, or desired business outcomes..."
          {...register('message')}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={submitLead.isPending}
          leftIcon={<Send className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Request Proposal & Scoping Review
        </Button>
      </div>
    </form>
  );
}
