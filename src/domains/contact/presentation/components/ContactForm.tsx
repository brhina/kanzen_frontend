import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSendContact } from '../../application/use-cases/useSendContact';
import type { CreateContactDto } from '../../infrastructure/contact.dto';
import { ContactType } from '../../domain/enums/contact-type.enum';
import { ContactTypePicker } from './ContactTypePicker';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { CheckCircle2 } from 'lucide-react';

interface ContactFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function ContactForm({ onSuccess, className = '' }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sendContact = useSendContact();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateContactDto>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      type: ContactType.GENERAL,
    },
  });

  const onSubmit = async (data: CreateContactDto) => {
    try {
      await sendContact.mutateAsync(data);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Contact submission failed', err);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`p-8 text-center space-y-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl ${className}`}>
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Message Sent Successfully!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Thank you for reaching out to Kanzen Tech. Our team has received your message and will get back to you promptly.
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
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
      {sendContact.isError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          {sendContact.error?.message || 'Failed to submit inquiry. Please try again.'}
        </div>
      )}

      {/* Category Topic Picker */}
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <ContactTypePicker
            value={field.value || ContactType.GENERAL}
            onChange={field.onChange}
          />
        )}
      />

      {/* Sender Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Your Full Name *"
          placeholder="David Vance"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
        />
        <Input
          label="Your Email Address *"
          type="email"
          placeholder="david@example.com"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone Number (Optional)"
          type="tel"
          placeholder="+1 555 234 5678"
          {...register('phone')}
        />
        <Input
          label="Subject / Topic *"
          placeholder="Partnership inquiry, product inquiry..."
          {...register('subject', { required: 'Subject is required' })}
          error={errors.subject?.message}
        />
      </div>

      <div>
        <Textarea
          label="How can we help? *"
          rows={4}
          placeholder="Provide details about your query or proposal..."
          {...register('message', { required: 'Message is required' })}
          error={errors.message?.message}
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={sendContact.isPending}
          className="w-full sm:w-auto"
        >
          Send Inquiry
        </Button>
      </div>
    </form>
  );
}
