import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { useBookConsultation } from '../../application/use-cases/useBookConsultation';
import type { CreateConsultationDto } from '../../infrastructure/consultations.dto';
import { MeetingType } from '../../domain/enums/meeting-type.enum';
import { ConsultationType } from '../../domain/enums/consultation-type.enum';
import { DeliveryFormat } from '../../domain/enums/delivery-format.enum';
import { MeetingTypePicker } from './MeetingTypePicker';
import { ServiceInterestSelect } from './ServiceInterestSelect';
import { ConsultationCalendar } from './ConsultationCalendar';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';
import {
  CheckCircle2,
  Building2,
  Users,
  GraduationCap,
  Sparkles,
  Laptop,
  UserRound,
} from 'lucide-react';

export interface ConsultationBookingFormProps {
  initialType?: 'consultation' | 'training';
  initialTopic?: string;
  initialService?: string;
  onSuccess?: () => void;
  className?: string;
}

function getDefaultPreferredDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

const TRAINING_TRACKS = [
  {
    id: 'k8s-cloud',
    name: 'Enterprise Cloud & Kubernetes Engineering Masterclass',
    serviceSlug: 'enterprise-cloud-kubernetes-training',
    description: 'Multi-tenant Kubernetes, Helm, ArgoCD GitOps, and zero-downtime blue-green deployments.',
  },
  {
    id: 'genai-llm',
    name: 'Production GenAI & LLM Architecture Workshop',
    serviceSlug: 'production-genai-llm-workshop',
    description: 'Enterprise RAG pipelines, pgvector search, semantic Redis caching, and guardrail evaluation.',
  },
  {
    id: 'dist-sys',
    name: 'Distributed Systems & Event-Driven Architecture Bootcamp',
    serviceSlug: 'distributed-systems-bootcamp',
    description: 'Microservices decomposition, transactional outbox pattern, BullMQ streams, and idempotency.',
  },
  {
    id: 'devsecops',
    name: 'DevSecOps & Zero-Trust Cloud Infrastructure',
    serviceSlug: 'cloud-architecture-devops',
    description: 'CI/CD pipeline hardening, automated vulnerability scans, IAM policy drift, and secret management.',
  },
  {
    id: 'custom',
    name: 'Custom Corporate Curriculum & Architectural Review',
    serviceSlug: 'technical-consulting-architecture',
    description: 'Bespoke syllabus tailored directly to your team’s stack, legacy code, and tech goals.',
  },
];

const SECTION_LABEL_CLASS = 'text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider';

export function ConsultationBookingForm({
  initialType,
  initialTopic,
  initialService,
  onSuccess,
  className = '',
}: ConsultationBookingFormProps) {
  const [searchParams] = useSearchParams();
  const queryType = searchParams.get('type') as 'consultation' | 'training' | null;
  const queryTopic = searchParams.get('topic') || undefined;
  const queryService = searchParams.get('service') || undefined;

  const defaultType = initialType || queryType || ConsultationType.CONSULTATION;
  const defaultTopic = initialTopic || queryTopic || '';
  const defaultService = initialService || queryService;

  const [isBooked, setIsBooked] = useState<boolean>(false);
  const bookConsultation = useBookConsultation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<CreateConsultationDto>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      type: defaultType,
      attendeesCount: defaultType === ConsultationType.TRAINING ? 10 : 1,
      trainingTopic: defaultTopic,
      deliveryFormat: DeliveryFormat.VIRTUAL_INTERACTIVE,
      projectDescription: '',
      serviceInterest: defaultService ? [defaultService] : ['cloud-architecture-devops'],
      budget: defaultType === ConsultationType.TRAINING ? 15000 : 50000,
      preferredDate: getDefaultPreferredDate(),
      preferredTime: '14:00',
      timezone: 'America/New_York',
      meetingType: MeetingType.VIDEO,
      notes: '',
    },
  });

  const selectedAttendees = watch('attendeesCount');
  const selectedTopic = watch('trainingTopic');
  const selectedDeliveryFormat = watch('deliveryFormat');
  const formValues = getValues();

  useEffect(() => {
    if (queryTopic && !selectedTopic) {
      setValue('trainingTopic', queryTopic);
    }
  }, [queryTopic, selectedTopic, setValue]);

  const onSubmit = async (data: CreateConsultationDto) => {
    try {
      await bookConsultation.mutateAsync(data);
      setIsBooked(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to book consultation or training', err);
    }
  };

  const isTraining = defaultType === ConsultationType.TRAINING;

  if (isBooked) {
    return (
      <div className={`p-8 sm:p-12 text-center space-y-5 bg-brand-500/10 dark:bg-brand-950/20 border border-brand-500/20 dark:border-brand-800 rounded-3xl ${className}`}>
        <div className="w-16 h-16 mx-auto rounded-full bg-brand-500/20 dark:bg-brand-900/60 flex items-center justify-center text-brand-500 dark:text-brand-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <Badge variant="brand" size="md">
            {isTraining ? 'Training Workshop Reserved' : 'Consultation Confirmed'}
          </Badge>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isTraining ? 'Corporate Training Reserved!' : 'Discovery Session Scheduled!'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            {isTraining ? (
              <>
                We have registered your corporate training request for{' '}
                <strong className="text-slate-900 dark:text-white">
                  {formValues.trainingTopic || 'Custom Curriculum'}
                </strong>{' '}
                ({formValues.attendeesCount || 10} Engineers) on{' '}
                <strong className="text-slate-900 dark:text-white">
                  {formValues.preferredDate} at {formValues.preferredTime} ({formValues.timezone})
                </strong>
                . Our principal training instructor has dispatched confirmation materials to {formValues.email}.
              </>
            ) : (
              <>
                We have reserved your engineering consultation for{' '}
                <strong className="text-slate-900 dark:text-white">
                  {formValues.preferredDate} at {formValues.preferredTime} ({formValues.timezone})
                </strong>
                . A calendar invite with secure video call coordinates has been dispatched to {formValues.email}.
              </>
            )}
          </p>
        </div>

        <div className="pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsBooked(false);
              reset();
            }}
          >
            {isTraining ? 'Book Another Session' : 'Book Another Consultation'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {bookConsultation.isError && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
            {bookConsultation.error?.message || 'Failed to complete booking. Please verify required fields.'}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-brand-600 text-white shrink-0">
              {isTraining ? (
                <GraduationCap className="w-5 h-5" />
              ) : (
                <UserRound className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isTraining
                  ? 'Reserve Corporate Team Training'
                  : 'Book Your 1-on-1 Architecture Consultation'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isTraining
                  ? 'Hands-on engineering masterclasses and live sandbox labs, tailored for your team.'
                  : '45 minutes of direct technical collaboration with a Principal Architect.'}
              </p>
            </div>
          </div>
          <Badge variant="brand" size="sm" className="shrink-0">
            {isTraining ? 'Team Training' : '1-on-1 Advisory'}
          </Badge>
        </div>

        {/* Team Size (Training only) */}
        {isTraining && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <label className={`${SECTION_LABEL_CLASS} flex items-center gap-1.5`}>
              <Users className="w-3.5 h-3.5 text-brand-600" />
              Target Engineering Team Size
            </label>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { value: 5, label: 'Small Team (1-5)' },
                { value: 12, label: 'Core Team (6-15)' },
                { value: 25, label: 'Department (16-30)' },
                { value: 50, label: 'Enterprise (30+)' },
              ].map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => setValue('attendeesCount', tier.value)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    selectedAttendees === tier.value
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-500'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact Details */}
        <div className="space-y-4">
          <h4 className={SECTION_LABEL_CLASS}>Contact Details</h4>
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
              label={isTraining ? 'Company / Organization *' : 'Company / Organization'}
              placeholder="TechCorp Inc."
              {...register('company', {
                required: isTraining ? 'Company name is required for training sessions' : false,
              })}
              error={errors.company?.message}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 415 555 2671"
              {...register('phone')}
            />
          </div>
        </div>

        {/* Technical Scope or Training Curriculum */}
        <div className="space-y-4">
          <div>
            <h4 className={SECTION_LABEL_CLASS}>
              {isTraining ? 'Training Curriculum' : 'Technical Scope'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {isTraining
                ? 'Choose one of our production-grade training masterclasses, or propose a custom syllabus.'
                : 'Help us select the right Principal Architect for your technical domain.'}
            </p>
          </div>

          {isTraining ? (
            <>
              <div className="space-y-2.5">
                {TRAINING_TRACKS.map((track) => {
                  const isSelected = selectedTopic === track.name;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => {
                        setValue('trainingTopic', track.name);
                        if (track.serviceSlug) {
                          setValue('serviceInterest', [track.serviceSlug]);
                        }
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {track.name}
                        </span>
                        {isSelected && (
                          <Badge variant="brand" size="sm">
                            Selected Track
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {track.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <Textarea
                label="Team Skill Gaps & Specific Learning Goals *"
                rows={4}
                placeholder="Describe your engineers' current proficiency, specific technologies, architecture challenges, or specific scenarios you want covered in live sandbox labs..."
                {...register('projectDescription', {
                  required: 'Please describe your team’s learning goals or technical scope.',
                })}
                error={errors.projectDescription?.message}
              />
            </>
          ) : (
            <>
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

              <Textarea
                label="Project Objectives & Technical Scope *"
                rows={4}
                placeholder="Describe your current software platform, target cloud infrastructure, scaling challenges, or tech stack requirements..."
                {...register('projectDescription', {
                  required: 'Project description is required',
                })}
                error={errors.projectDescription?.message}
              />
            </>
          )}
        </div>

        {/* Schedule & Format */}
        <div className="space-y-4">
          <div>
            <h4 className={SECTION_LABEL_CLASS}>
              {isTraining ? 'Delivery Format & Schedule' : 'Session Time & Format'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {isTraining
                ? 'Select your preferred start date, time window, and interactive delivery medium.'
                : 'All consultation sessions are 45 minutes of direct technical collaboration.'}
            </p>
          </div>

          {isTraining ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  format: DeliveryFormat.VIRTUAL_INTERACTIVE,
                  icon: Laptop,
                  label: 'Virtual Interactive Lab',
                  desc: 'Live instructor-led sandbox exercises with split rooms',
                },
                {
                  format: DeliveryFormat.ON_SITE_INTENSIVE,
                  icon: Building2,
                  label: 'On-Site Intensive',
                  desc: 'In-person hands-on bootcamp at your corporate offices',
                },
                {
                  format: DeliveryFormat.HYBRID,
                  icon: Sparkles,
                  label: 'Hybrid Cohort',
                  desc: 'Self-paced sandboxes + weekly live architecture debriefs',
                },
              ].map((item) => {
                const isSelected = selectedDeliveryFormat === item.format;
                const Icon = item.icon;
                return (
                  <button
                    key={item.format}
                    type="button"
                    onClick={() => {
                      setValue('deliveryFormat', item.format);
                      setValue(
                        'meetingType',
                        item.format === DeliveryFormat.ON_SITE_INTENSIVE
                          ? MeetingType.IN_PERSON
                          : MeetingType.VIDEO,
                      );
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
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
          )}

          <ConsultationCalendar
            selectedDate={formValues.preferredDate}
            onSelectDate={(date) => {
              setValue('preferredDate', date);
            }}
            selectedTime={formValues.preferredTime}
            onSelectTime={(time) => {
              setValue('preferredTime', time);
            }}
            timezone={formValues.timezone || 'America/New_York'}
            onTimezoneChange={(tz) => {
              setValue('timezone', tz);
            }}
          />
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end border-t border-slate-200 dark:border-slate-800">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={bookConsultation.isPending}
          >
            {isTraining ? 'Confirm & Reserve Training Workshop' : 'Confirm & Reserve Consultation'}
          </Button>
        </div>
      </form>
    </div>
  );
}
