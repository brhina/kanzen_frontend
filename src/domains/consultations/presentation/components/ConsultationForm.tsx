import { useState, type FormEvent } from 'react';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';
import type {
  CreateConsultationDto,
  UpdateConsultationDto,
} from '../../infrastructure/consultations.dto';
import { ConsultationType } from '../../domain/enums/consultation-type.enum';
import { ConsultationStatus } from '../../domain/enums/consultation-status.enum';
import { DeliveryFormat } from '../../domain/enums/delivery-format.enum';
import { MeetingType } from '../../domain/enums/meeting-type.enum';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import {
  Video,
  GraduationCap,
  Calendar,
  Clock,
  Users,
  Building2,
  Link as LinkIcon,
  DollarSign,
  Layers,
} from 'lucide-react';

export interface ConsultationFormProps {
  initialData?: ConsultationEntity | null;
  defaultType?: 'consultation' | 'training';
  onSubmit: (dto: CreateConsultationDto | UpdateConsultationDto) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PRESET_TRAINING_TOPICS = [
  'Enterprise Cloud & Kubernetes Engineering Masterclass',
  'Production GenAI & LLM Systems Workshop',
  'High-Throughput Distributed Systems Bootcamp',
  'DevSecOps & Zero-Trust Cloud Infrastructure',
  'Custom Corporate Curriculum & Architecture Review',
];

const AVAILABLE_PRACTICES = [
  { id: 'cloud-architecture-devops', label: 'Cloud Architecture & DevOps' },
  { id: 'full-stack-web-apps', label: 'Full-Stack Web Apps' },
  { id: 'ai-intelligent-automation', label: 'AI & Machine Learning' },
  { id: 'custom-enterprise-software', label: 'Custom Enterprise Software' },
  { id: 'enterprise-cloud-kubernetes-training', label: 'Kubernetes Masterclass' },
  { id: 'production-genai-llm-workshop', label: 'GenAI & LLM Workshop' },
  { id: 'distributed-systems-bootcamp', label: 'Distributed Systems Bootcamp' },
];

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET/CEST)' },
  { value: 'Africa/Nairobi', label: 'Africa/Nairobi (EAT)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)' },
];

function formatDateForInput(date?: Date | string): string {
  if (!date) {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  }
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

export function ConsultationForm({
  initialData,
  defaultType,
  onSubmit,
  onCancel,
  isLoading = false,
}: ConsultationFormProps) {
  const isEditing = Boolean(initialData?.id);

  // Offering Type
  const [type, setType] = useState<ConsultationType>(
    (initialData?.type as ConsultationType) ||
      (defaultType === 'training' ? ConsultationType.TRAINING : ConsultationType.CONSULTATION),
  );

  // Status
  const [status, setStatus] = useState<ConsultationStatus>(
    (initialData?.status as ConsultationStatus) || ConsultationStatus.SCHEDULED,
  );

  // Client Details
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [company, setCompany] = useState(initialData?.company || '');

  // Offering Specifics
  const [trainingTopic, setTrainingTopic] = useState(
    initialData?.trainingTopic ||
      (type === ConsultationType.TRAINING ? PRESET_TRAINING_TOPICS[0] : ''),
  );
  const [attendeesCount, setAttendeesCount] = useState<number>(
    initialData?.attendeesCount || (type === ConsultationType.TRAINING ? 12 : 1),
  );
  const [deliveryFormat, setDeliveryFormat] = useState<string>(
    initialData?.deliveryFormat ||
      (type === ConsultationType.TRAINING
        ? DeliveryFormat.VIRTUAL_INTERACTIVE
        : MeetingType.VIDEO),
  );
  const [meetingType, setMeetingType] = useState<MeetingType>(
    initialData?.meetingType || MeetingType.VIDEO,
  );

  // Scope & Budget
  const [projectDescription, setProjectDescription] = useState(
    initialData?.projectDescription || '',
  );
  const [budget, setBudget] = useState<string>(
    initialData?.budget !== undefined ? String(initialData.budget) : '',
  );
  const [serviceInterest, setServiceInterest] = useState<string[]>(
    initialData?.serviceInterest || [],
  );

  // Schedule & Logistics
  const [preferredDate, setPreferredDate] = useState<string>(
    formatDateForInput(initialData?.preferredDate),
  );
  const [preferredTime, setPreferredTime] = useState<string>(
    initialData?.preferredTime || '14:00 UTC',
  );
  const [timezone, setTimezone] = useState<string>(initialData?.timezone || 'UTC');
  const [meetingLink, setMeetingLink] = useState(
    initialData?.meetingLink || 'https://meet.veyroo.tech/session-' + Math.random().toString(36).substring(2, 7),
  );
  const [notes, setNotes] = useState(
    initialData?.notes || 'Scheduled by admin. Cloud sandbox clusters and lab access details provisioned.',
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTogglePractice = (id: string) => {
    setServiceInterest((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleTypeChange = (newType: ConsultationType) => {
    setType(newType);
    if (newType === ConsultationType.TRAINING) {
      if (!trainingTopic) setTrainingTopic(PRESET_TRAINING_TOPICS[0]);
      if (attendeesCount <= 1) setAttendeesCount(12);
      setDeliveryFormat(DeliveryFormat.VIRTUAL_INTERACTIVE);
    } else {
      if (attendeesCount > 5) setAttendeesCount(1);
      setDeliveryFormat(MeetingType.VIDEO);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Contact/Client name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (!projectDescription.trim()) newErrors.projectDescription = 'Scope / objectives description is required';
    if (type === ConsultationType.TRAINING && !trainingTopic.trim()) {
      newErrors.trainingTopic = 'Training topic curriculum track is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: CreateConsultationDto = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
      projectDescription: projectDescription.trim(),
      serviceInterest: serviceInterest.length > 0 ? serviceInterest : undefined,
      budget: budget ? Number(budget) : undefined,
      preferredDate: preferredDate || undefined,
      preferredTime: preferredTime.trim() || undefined,
      timezone: timezone || 'UTC',
      meetingType,
      meetingLink: meetingLink.trim() || undefined,
      status,
      type,
      attendeesCount: Number(attendeesCount) || 1,
      trainingTopic: type === ConsultationType.TRAINING ? trainingTopic.trim() : undefined,
      deliveryFormat,
      notes: notes.trim() || undefined,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Offering Type Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Offering Type *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange(ConsultationType.TRAINING)}
            className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              type === ConsultationType.TRAINING
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                type === ConsultationType.TRAINING
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Corporate Training</span>
                <Badge variant="brand" size="sm" className="text-[10px]">
                  Team Cohort
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hands-on masterclasses, dedicated cloud sandboxes, and customized curriculums.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange(ConsultationType.CONSULTATION)}
            className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              type === ConsultationType.CONSULTATION
                ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-2 ring-cyan-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                type === ConsultationType.CONSULTATION
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>1-on-1 Consultation</span>
                <Badge variant="info" size="sm" className="text-[10px]">
                  Advisory
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Architecture discovery, roadmap review, and senior technical advisory.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Session Lifecycle Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Select
            label="Lifecycle Status *"
            value={status}
            onChange={(e) => setStatus(e.target.value as ConsultationStatus)}
            options={[
              { value: ConsultationStatus.SCHEDULED, label: 'Scheduled & Confirmed (Active)' },
              { value: ConsultationStatus.PENDING, label: 'Pending Discovery' },
              { value: ConsultationStatus.COMPLETED, label: 'Completed' },
              { value: ConsultationStatus.CANCELLED, label: 'Cancelled' },
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            {type === ConsultationType.TRAINING ? 'Cohort Headcount *' : 'Attendees Headcount *'}
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              min="1"
              max="200"
              value={attendeesCount}
              onChange={(e) => setAttendeesCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder={type === ConsultationType.TRAINING ? '15 engineers' : '1'}
            />
          </div>
        </div>
      </div>

      {/* 3. Client & Attendee Contact Profile */}
      <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-brand-500" />
          <span>Client &amp; Organization Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Client / Contact Name *"
            placeholder="e.g. Sarah Jenkins"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={errors.name}
          />

          <Input
            label="Client Work Email *"
            type="email"
            placeholder="e.g. sarah.jenkins@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company / Enterprise"
            placeholder="e.g. DataMetric Labs"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <Input
            label="Direct Phone Number"
            placeholder="e.g. +1 415 555 9321"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* 4. Offering Specifics (Training Curriculum or Consultation Practice) */}
      <div className="space-y-4">
        {type === ConsultationType.TRAINING && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Curriculum Track / Training Topic *
            </label>
            <Select
              value={PRESET_TRAINING_TOPICS.includes(trainingTopic) ? trainingTopic : 'custom'}
              onChange={(e) => {
                if (e.target.value !== 'custom') {
                  setTrainingTopic(e.target.value);
                } else {
                  setTrainingTopic('');
                }
              }}
              options={[
                ...PRESET_TRAINING_TOPICS.map((topic) => ({ value: topic, label: topic })),
                { value: 'custom', label: 'Other / Bespoke Custom Curriculum...' },
              ]}
            />
            {(!PRESET_TRAINING_TOPICS.includes(trainingTopic) || trainingTopic === '') && (
              <Input
                label="Custom Curriculum Title *"
                placeholder="Enter custom curriculum or workshop topic name"
                value={trainingTopic}
                onChange={(e) => setTrainingTopic(e.target.value)}
                error={errors.trainingTopic}
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Select
              label="Delivery & Meeting Format *"
              value={deliveryFormat}
              onChange={(e) => {
                setDeliveryFormat(e.target.value);
                if (e.target.value === 'on_site_intensive') {
                  setMeetingType(MeetingType.IN_PERSON);
                } else if (e.target.value === 'phone') {
                  setMeetingType(MeetingType.PHONE);
                } else {
                  setMeetingType(MeetingType.VIDEO);
                }
              }}
              options={
                type === ConsultationType.TRAINING
                  ? [
                      {
                        value: DeliveryFormat.VIRTUAL_INTERACTIVE,
                        label: 'Virtual Interactive Lab (Zoom / Meet + Web Sandboxes)',
                      },
                      {
                        value: DeliveryFormat.ON_SITE_INTENSIVE,
                        label: 'On-Site Intensive (Instructor Dispatched)',
                      },
                      {
                        value: DeliveryFormat.HYBRID,
                        label: 'Hybrid Cohort (On-Site Kickoff + Virtual Labs)',
                      },
                      {
                        value: 'phone',
                        label: 'Phone / Audio Masterclass',
                      },
                    ]
                  : [
                      { value: MeetingType.VIDEO, label: 'Virtual Video Conference' },
                      { value: MeetingType.PHONE, label: 'Direct Phone Call' },
                      { value: MeetingType.IN_PERSON, label: 'In-Person Executive Advisory' },
                    ]
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Estimated Budget (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                min="0"
                step="500"
                placeholder={type === ConsultationType.TRAINING ? '25000' : '5000'}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Practice Areas / Service Interest Tags */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Associated Practice &amp; Technology Tags</span>
          </label>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {AVAILABLE_PRACTICES.map((p) => {
              const isSelected = serviceInterest.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleTogglePractice(p.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <Textarea
          label="Scope, Technical Background & Objectives *"
          rows={3}
          placeholder={
            type === ConsultationType.TRAINING
              ? 'Detail the cohort background, engineer skill levels, cloud provider requirements, and specific lab outcomes...'
              : 'Detail the current architecture stack, bottlenecks, scalability goals, or migration requirements...'
          }
          value={projectDescription}
          onChange={(e) => {
            setProjectDescription(e.target.value);
            if (errors.projectDescription) {
              setErrors((prev) => ({ ...prev, projectDescription: '' }));
            }
          }}
          error={errors.projectDescription}
        />
      </div>

      {/* 5. Schedule & Logistics Bridge */}
      <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-brand-500" />
          <span>Schedule &amp; Virtual Bridge Logistics</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Scheduled Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Time Slot *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="14:00 UTC"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <Select
              label="Operating Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={TIMEZONE_OPTIONS}
            />
          </div>
        </div>

        <Input
          label="Meeting Link / Sandbox Lab Portal URL"
          placeholder="https://meet.veyroo.tech/session-xyz or lab bridge URL"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          leftIcon={<LinkIcon className="w-4 h-4 text-slate-400" />}
        />

        <Textarea
          label="Internal Staff Briefing & Lab Provisioning Notes"
          rows={2}
          placeholder="Provisioning details, dedicated sandbox credentials, assigned instructor, or pre-call checklist..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          <span>
            {isEditing ? 'Save Changes' : type === ConsultationType.TRAINING ? 'Schedule Corporate Training' : 'Schedule Consultation'}
          </span>
        </Button>
      </div>
    </form>
  );
}
