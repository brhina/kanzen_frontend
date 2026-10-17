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
  Calendar,
  Building2,
  Video,
  Users,
  GraduationCap,
  Sparkles,
  BookOpen,
  Laptop,
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

  const [currentStep, setCurrentStep] = useState<number>(1);
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

  const selectedType = watch('type');
  const selectedAttendees = watch('attendeesCount');
  const selectedTopic = watch('trainingTopic');
  const selectedDeliveryFormat = watch('deliveryFormat');
  const formValues = getValues();

  useEffect(() => {
    if (queryType && queryType !== selectedType) {
      setValue('type', queryType);
      if (queryType === 'training' && selectedAttendees === 1) {
        setValue('attendeesCount', 10);
      }
    }
    if (queryTopic && !selectedTopic) {
      setValue('trainingTopic', queryTopic);
    }
  }, [queryType, queryTopic, selectedType, selectedTopic, selectedAttendees, setValue]);

  const onSubmit = async (data: CreateConsultationDto) => {
    try {
      await bookConsultation.mutateAsync(data);
      setIsBooked(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to book consultation or training', err);
    }
  };

  const isTraining = selectedType === ConsultationType.TRAINING;

  if (isBooked) {
    return (
      <div className={`p-8 sm:p-12 text-center space-y-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl ${className}`}>
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <Badge variant="success" size="md">
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
              setCurrentStep(1);
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
    <div className={`space-y-8 ${className}`}>
      {/* Wizard Progress Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        {[
          { step: 1, label: isTraining ? 'Track & Team' : 'Contact & Mode' },
          { step: 2, label: isTraining ? 'Curriculum' : 'Scope' },
          { step: 3, label: 'Schedule & Format' },
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
            {bookConsultation.error?.message || 'Failed to complete booking. Please verify required fields.'}
          </div>
        )}

        {/* STEP 1: SESSION MODE & CONTACT DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Who will be joining the session?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select between 1-on-1 technical advisory or corporate team engineering training.
              </p>
            </div>

            {/* Session Type Mode Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => {
                  setValue('type', ConsultationType.CONSULTATION);
                  setValue('attendeesCount', 1);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedType === ConsultationType.CONSULTATION
                    ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`p-1.5 rounded-lg ${
                      selectedType === ConsultationType.CONSULTATION
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Architecture Consultation
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  1-on-1 advisory with a Principal Architect. Code review, cloud scalability teardown, or technical discovery.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setValue('type', ConsultationType.TRAINING);
                  if (!selectedAttendees || selectedAttendees <= 1) {
                    setValue('attendeesCount', 10);
                  }
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedType === ConsultationType.TRAINING
                    ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`p-1.5 rounded-lg ${
                      selectedType === ConsultationType.TRAINING
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Corporate &amp; Team Training
                  </span>
                  <Badge variant="brand" size="sm">
                    Workshops
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Hands-on engineering masterclasses, live sandbox labs, and syllabus tailored for engineering teams.
                </p>
              </button>
            </div>

            {/* Team Size Selector if Training */}
            {isTraining && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
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

            {/* Attendee Contact Information */}
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

            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  const vals = getValues();
                  if (!vals.name || !vals.email) {
                    alert('Please enter your name and email to continue.');
                    return;
                  }
                  if (isTraining && !vals.company) {
                    alert('Please enter your company / organization name for training workshops.');
                    return;
                  }
                  setCurrentStep(2);
                }}
              >
                {isTraining ? 'Next: Training Curriculum' : 'Next: Technical Scope'}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: PROJECT SCOPE OR TRAINING CURRICULUM */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            {isTraining ? (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Select Corporate Training Track
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose one of our production-grade training masterclasses, or propose a custom syllabus.
                  </p>
                </div>

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

                <div>
                  <Textarea
                    label="Team Skill Gaps & Specific Learning Goals *"
                    rows={4}
                    placeholder="Describe your engineers' current proficiency, specific technologies, architecture challenges, or specific scenarios you want covered in live sandbox labs..."
                    {...register('projectDescription', {
                      required: 'Please describe your team’s learning goals or technical scope.',
                    })}
                    error={errors.projectDescription?.message}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    What are you looking to engineer?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Help us select the right Principal Architect for your technical domain.
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
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  const vals = getValues();
                  if (vals.projectDescription) {
                    setCurrentStep(3);
                  } else {
                    alert('Please provide your project objectives or learning goals.');
                  }
                }}
              >
                Next: Schedule &amp; Format
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE, DELIVERY FORMAT & CALENDAR */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isTraining ? 'Choose Workshop Schedule & Delivery Format' : 'Choose Session Time & Format'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isTraining
                  ? 'Select your preferred start date, time window, and interactive delivery medium.'
                  : 'All consultation sessions are 45 minutes of direct technical collaboration.'}
              </p>
            </div>

            {/* Delivery Format for Training vs Consultation */}
            {isTraining ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Workshop Delivery Format
                </label>
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

            {/* Calendar & Time Slots */}
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

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setCurrentStep(4)}
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
                {isTraining ? 'Confirm Corporate Training Details' : 'Confirm Consultation Details'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Review your session dossier prior to dispatching reservation.
              </p>
            </div>

            {/* Summary Dossier Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <Badge variant={isTraining ? 'brand' : 'info'} size="md">
                  {isTraining ? 'Corporate Engineering Workshop' : 'Architecture Advisory Session'}
                </Badge>
                {isTraining && (
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-brand-600" />
                    {formValues.attendeesCount || 10} Engineers
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 text-sm">
                <div>
                  <span className="text-xs text-slate-500">Contact &amp; Organization</span>
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
                  <span className="text-xs text-slate-500">Scheduled Date &amp; Format</span>
                  <div className="font-bold text-brand-600 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-4 h-4" />
                    {formValues.preferredDate} at {formValues.preferredTime}
                  </div>
                  <div className="text-xs text-slate-500">{formValues.timezone}</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1 mt-1 font-medium capitalize">
                    {isTraining ? (
                      <>
                        <Laptop className="w-3.5 h-3.5 text-brand-600" />
                        {formValues.deliveryFormat?.replace('_', ' ') || 'Virtual Interactive Lab'}
                      </>
                    ) : (
                      <>
                        <Video className="w-3.5 h-3.5 text-brand-600" />
                        {formValues.meetingType} format
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500">
                  {isTraining ? 'Curriculum Track & Learning Scope' : 'Technical Scope'}
                </span>
                {formValues.trainingTopic && (
                  <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-brand-600" />
                    {formValues.trainingTopic}
                  </div>
                )}
                <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                  {formValues.projectDescription}
                </p>
                {formValues.serviceInterest && formValues.serviceInterest.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formValues.serviceInterest.map((item) => (
                      <Badge key={item} variant="neutral" size="sm">
                        {item}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(3)}
              >
                Back to Schedule
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={bookConsultation.isPending}
              >
                {isTraining ? 'Confirm & Reserve Training Workshop' : 'Confirm & Reserve Consultation'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
