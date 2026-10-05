import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useBookConsultation } from '../../application/use-cases/useBookConsultation';
import type { CreateConsultationDto } from '../../infrastructure/consultations.dto';
import { MeetingType } from '../../domain/enums/meeting-type.enum';
import { MeetingTypePicker } from './MeetingTypePicker';
import { ServiceInterestSelect } from './ServiceInterestSelect';
import { ConsultationCalendar } from './ConsultationCalendar';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';
import {
  CheckCircle2,
  Calendar,
  Building2,
  ArrowRight,
  ArrowLeft,
  Send,
  Video,
} from 'lucide-react';

interface ConsultationBookingFormProps {
  onSuccess?: () => void;
  className?: string;
}

function getDefaultPreferredDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

export function ConsultationBookingForm({
  onSuccess,
  className = '',
}: ConsultationBookingFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const bookConsultation = useBookConsultation();

  const {
    register,
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm<CreateConsultationDto>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      projectDescription: '',
      serviceInterest: ['cloud-architecture-devops'],
      budget: 50000,
      preferredDate: getDefaultPreferredDate(),
      preferredTime: '14:00',
      timezone: 'America/New_York',
      meetingType: MeetingType.VIDEO,
      notes: '',
    },
  });

  const formValues = getValues();

  const onSubmit = async (data: CreateConsultationDto) => {
    try {
      await bookConsultation.mutateAsync(data);
      setIsBooked(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to book consultation', err);
    }
  };

  if (isBooked) {
    return (
      <div className={`p-8 sm:p-12 text-center space-y-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl ${className}`}>
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <Badge variant="success" size="md">
            Consultation Confirmed
          </Badge>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Discovery Session Scheduled!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            We have reserved your engineering consultation for{' '}
            <strong className="text-slate-900 dark:text-white">
              {formValues.preferredDate} at {formValues.preferredTime} ({formValues.timezone})
            </strong>
            . A calendar invite with secure video call coordinates has been dispatched to {formValues.email}.
          </p>
        </div>

        <div className="pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsBooked(false);
              setCurrentStep(1);
              reset();
            }}
          >
            Book Another Consultation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Wizard Progress Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        {[
          { step: 1, label: 'Contact' },
          { step: 2, label: 'Scope' },
          { step: 3, label: 'Schedule' },
          { step: 4, label: 'Confirm' },
        ].map((item) => {
          const isActive = currentStep === item.step;
          const isPassed = currentStep > item.step;
          return (
            <div key={item.step} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isPassed
                    ? 'bg-emerald-600 text-white'
                    : isActive
                      ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {isPassed ? '✓' : item.step}
              </div>
              <span
                className={`text-xs font-bold hidden sm:inline ${
                  isActive
                    ? 'text-slate-900 dark:text-white'
                    : isPassed
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {bookConsultation.isError && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
            {bookConsultation.error?.message || 'Failed to book consultation. Please check required fields.'}
          </div>
        )}

        {/* STEP 1: CONTACT DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Who will be joining the session?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                We prepare customized architecture notes prior to the call.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Full Name *"
                placeholder="Sarah Johnson"
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
              />
              <Input
                label="Work Email *"
                type="email"
                placeholder="sarah@techcorp.com"
                {...register('email', { required: 'Email is required' })}
                error={errors.email?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company / Organization"
                placeholder="TechCorp Inc."
                {...register('company')}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 415 555 2671"
                {...register('phone')}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  if (formValues.name && formValues.email) {
                    setCurrentStep(2);
                  } else {
                    alert('Please enter your name and email to continue.');
                  }
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Project Needs
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: PROJECT SCOPE & CAPABILITIES */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                What are you looking to engineer?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Help us select the right Principal Architect for your domain.
              </p>
            </div>

            <Controller
              control={control}
              name="serviceInterest"
              render={({ field }) => (
                <ServiceInterestSelect
                  value={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />

            <div>
              <Textarea
                label="Project Objectives & Technical Scope *"
                rows={4}
                placeholder="Describe your current software platform, target cloud infrastructure, scaling challenges, or tech stack requirements..."
                {...register('projectDescription', {
                  required: 'Project description is required',
                })}
                error={errors.projectDescription?.message}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  if (formValues.projectDescription) {
                    setCurrentStep(3);
                  } else {
                    alert('Please provide a brief project description.');
                  }
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Time & Format
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: TIMEZONE, DATE & MEETING FORMAT */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose Session Time & Format
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                All sessions are 45 minutes of direct technical collaboration.
              </p>
            </div>

            {/* Meeting Format Picker */}
            <Controller
              control={control}
              name="meetingType"
              render={({ field }) => (
                <MeetingTypePicker
                  value={field.value || MeetingType.VIDEO}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Calendar & Time Slots */}
            <ConsultationCalendar
              selectedDate={formValues.preferredDate}
              onSelectDate={(date) => {
                // updates through react-hook-form
                reset({ ...formValues, preferredDate: date });
              }}
              selectedTime={formValues.preferredTime}
              onSelectTime={(time) => {
                reset({ ...formValues, preferredTime: time });
              }}
              timezone={formValues.timezone || 'America/New_York'}
              onTimezoneChange={(tz) => {
                reset({ ...formValues, timezone: tz });
              }}
            />

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setCurrentStep(4)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Review Summary
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRMATION */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Confirm Consultation Details
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Review your session details prior to reserving.
              </p>
            </div>

            {/* Summary Dossier Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 text-sm">
                <div>
                  <span className="text-xs text-slate-500">Attendee</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {formValues.name}
                  </div>
                  <div className="text-xs text-slate-500">{formValues.email}</div>
                  {formValues.company && (
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" /> {formValues.company}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs text-slate-500">Appointment</span>
                  <div className="font-bold text-brand-600 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-4 h-4" />
                    {formValues.preferredDate} at {formValues.preferredTime}
                  </div>
                  <div className="text-xs text-slate-500">{formValues.timezone}</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1 mt-1 font-medium capitalize">
                    <Video className="w-3.5 h-3.5 text-brand-600" />
                    {formValues.meetingType} format
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500">Technical Scope</span>
                <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                  {formValues.projectDescription}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formValues.serviceInterest?.map((item) => (
                    <Badge key={item} variant="neutral" size="sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(3)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Schedule
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={bookConsultation.isPending}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Confirm & Reserve Consultation
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
