import React, { useState } from 'react';
import { useCreateJobPosting } from '../../application/use-cases/useCreateJobPosting';
import { useUpdateJobPosting } from '../../application/use-cases/useUpdateJobPosting';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { slugify } from '@/shared/utils/string';
import { X } from 'lucide-react';
import type { JobPostingEntity } from '../../domain/entities/job-posting.entity';
import type {
  ExperienceLevel,
  JobPostingStatus,
  JobType,
  WorkMode,
} from '../../domain/enums/job-posting.enums';
import type { CreateJobPostingDto } from '../../infrastructure/careers.dto';

interface JobPostingFormProps {
  initialData?: JobPostingEntity | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const JobPostingForm: React.FC<JobPostingFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  className = '',
}) => {
  const isEditing = Boolean(initialData && initialData.id);
  const createMutation = useCreateJobPosting();
  const updateMutation = useUpdateJobPosting();

  // Controlled Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [department, setDepartment] = useState(
    initialData?.department || 'Engineering',
  );
  const [type, setType] = useState<JobType>(
    initialData?.type || 'full-time',
  );
  const [mode, setMode] = useState<WorkMode>(
    initialData?.mode || 'remote',
  );
  const [location, setLocation] = useState(initialData?.location || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialData?.experienceLevel || 'senior',
  );
  const [salaryMin, setSalaryMin] = useState<string>(
    initialData?.salaryMin ? String(initialData.salaryMin) : '',
  );
  const [salaryMax, setSalaryMax] = useState<string>(
    initialData?.salaryMax ? String(initialData.salaryMax) : '',
  );
  const [salaryCurrency, setSalaryCurrency] = useState(
    initialData?.salaryCurrency || 'USD',
  );
  const [isUrgent, setIsUrgent] = useState(initialData?.isUrgent || false);
  const [status, setStatus] = useState<JobPostingStatus>(
    initialData?.status || 'open',
  );
  const [closingDate, setClosingDate] = useState(
    initialData?.closingDate
      ? new Date(initialData.closingDate).toISOString().split('T')[0]
      : '',
  );

  // Arrays
  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements || [],
  );
  const [reqInput, setReqInput] = useState('');

  const [niceToHave, setNiceToHave] = useState<string[]>(
    initialData?.niceToHave || [],
  );
  const [niceInput, setNiceInput] = useState('');

  const [benefits, setBenefits] = useState<string[]>(
    initialData?.benefits || [
      'Competitive compensation & equity options',
      'Flexible remote work & tech equipment stipend',
      'Comprehensive health coverage',
      'Continuous learning budget',
    ],
  );
  const [benefitInput, setBenefitInput] = useState('');

  const [technologies, setTechnologies] = useState<string[]>(
    initialData?.technologies || [],
  );
  const [techInput, setTechInput] = useState('');

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      setSlug(slugify(val));
    }
  };

  // Add items
  const addRequirement = () => {
    const trimmed = reqInput.trim();
    if (trimmed && !requirements.includes(trimmed)) {
      setRequirements([...requirements, trimmed]);
      setReqInput('');
    }
  };

  const removeRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const addNiceToHave = () => {
    const trimmed = niceInput.trim();
    if (trimmed && !niceToHave.includes(trimmed)) {
      setNiceToHave([...niceToHave, trimmed]);
      setNiceInput('');
    }
  };

  const removeNiceToHave = (idx: number) => {
    setNiceToHave(niceToHave.filter((_, i) => i !== idx));
  };

  const addBenefit = () => {
    const trimmed = benefitInput.trim();
    if (trimmed && !benefits.includes(trimmed)) {
      setBenefits([...benefits, trimmed]);
      setBenefitInput('');
    }
  };

  const removeBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const addTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
      setTechInput('');
    }
  };

  const removeTech = (item: string) => {
    setTechnologies(technologies.filter((t) => t !== item));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Role title is required.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Role description is required.');
      return;
    }

    const payload: CreateJobPostingDto = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      department,
      type,
      mode,
      location: location.trim() || undefined,
      description: description.trim(),
      requirements,
      niceToHave,
      benefits,
      technologies,
      experienceLevel,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      salaryCurrency,
      isUrgent,
      closingDate: closingDate ? new Date(closingDate).toISOString() : null,
      status,
    };

    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to save job posting';
      setErrorMsg(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {errorMsg && (
        <div className="p-3 text-xs rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      {/* Row 1: Title & Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Role Title *
          </label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Senior Distributed Systems Engineer"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            URL Slug
          </label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="senior-distributed-systems-engineer"
          />
        </div>
      </div>

      {/* Row 2: Department, Experience Level, Work Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Department *
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="Engineering">Engineering</option>
            <option value="Design">Design & UX</option>
            <option value="DevOps">DevOps & Cloud</option>
            <option value="Product">Product Management</option>
            <option value="Operations">Operations</option>
            <option value="Security">Cybersecurity</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Experience Level *
          </label>
          <select
            value={experienceLevel}
            onChange={(e) =>
              setExperienceLevel(e.target.value as ExperienceLevel)
            }
            className="w-full h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="junior">Junior (1-3 yrs)</option>
            <option value="mid">Mid-Level (3-5 yrs)</option>
            <option value="senior">Senior (5-8 yrs)</option>
            <option value="lead">Lead / Principal (8+ yrs)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Work Mode *
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as WorkMode)}
            className="w-full h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-Site</option>
          </select>
        </div>
      </div>

      {/* Row 3: Employment Type, Location, Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Job Type *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as JobType)}
            className="w-full h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Location
          </label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Nairobi, Kenya or Worldwide"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Publication Status *
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as JobPostingStatus)
            }
            className="w-full h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="open">Open (Active)</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Row 4: Compensation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Minimum Salary
          </label>
          <Input
            type="number"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            placeholder="4500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Maximum Salary
          </label>
          <Input
            type="number"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            placeholder="7500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Currency
          </label>
          <Input
            value={salaryCurrency}
            onChange={(e) => setSalaryCurrency(e.target.value)}
            placeholder="USD"
          />
        </div>
      </div>

      {/* Urgent hiring & Closing date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Closing Date (Optional)
          </label>
          <Input
            type="date"
            value={closingDate}
            onChange={(e) => setClosingDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 pt-5">
          <input
            type="checkbox"
            id="isUrgent"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="isUrgent"
            className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Flag as Urgent Hiring Priority 🔥
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Role Overview & Mission *
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed description of the role, challenges, impact, and day-to-day responsibilities..."
          rows={5}
          required
        />
      </div>

      {/* Technologies Tag Adder */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Required Tech Stack & Tools
        </label>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTech();
              }
            }}
            placeholder="Type technology (e.g. NestJS, Docker, Go) and press Add"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTech}
            className="shrink-0"
          >
            Add
          </Button>
        </div>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="hover:text-rose-500 ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Requirements List Adder */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Requirements & Qualifications
        </label>
        <div className="flex gap-2">
          <Input
            value={reqInput}
            onChange={(e) => setReqInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addRequirement();
              }
            }}
            placeholder="Add key qualification bullet point..."
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRequirement}
            className="shrink-0"
          >
            Add
          </Button>
        </div>
        {requirements.length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {requirements.map((req, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
              >
                <span>{req}</span>
                <button
                  type="button"
                  onClick={() => removeRequirement(idx)}
                  className="text-slate-400 hover:text-rose-500 shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Nice To Have Adder */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Nice-to-Have Skills
        </label>
        <div className="flex gap-2">
          <Input
            value={niceInput}
            onChange={(e) => setNiceInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addNiceToHave();
              }
            }}
            placeholder="Add bonus / nice-to-have skill..."
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNiceToHave}
            className="shrink-0"
          >
            Add
          </Button>
        </div>
        {niceToHave.length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {niceToHave.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeNiceToHave(idx)}
                  className="text-slate-400 hover:text-rose-500 shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Benefits Adder */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Perks & Benefits
        </label>
        <div className="flex gap-2">
          <Input
            value={benefitInput}
            onChange={(e) => setBenefitInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addBenefit();
              }
            }}
            placeholder="Add perk / benefit bullet point..."
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBenefit}
            className="shrink-0"
          >
            Add
          </Button>
        </div>
        {benefits.length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {benefits.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeBenefit(idx)}
                  className="text-slate-400 hover:text-rose-500 shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Form Submission Buttons */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-700 min-w-32"
        >
          {isPending
            ? 'Saving...'
            : isEditing
              ? 'Update Role'
              : 'Publish Role'}
        </Button>
      </div>
    </form>
  );
};
