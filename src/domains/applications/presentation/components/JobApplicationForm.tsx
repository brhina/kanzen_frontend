import React, { useState } from 'react';
import { useApplyForJob } from '../../application/use-cases/useApplyForJob';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  FileText,
  CheckCircle2,
  User,
  Briefcase,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { DocumentUpload } from '@/shared/ui/upload';
import { applicationsApi } from '../../infrastructure/applications.api';
import type { CreateJobApplicationDto } from '../../infrastructure/applications.dto';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  jobId,
  jobTitle,
  onSuccess,
  onCancel,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const applyMutation = useApplyForJob();

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const [yearsOfExperience, setYearsOfExperience] = useState<string>('3');
  const [currentCompany, setCurrentCompany] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('1 month');
  const [referredBy, setReferredBy] = useState('');

  // Resume & Cover Letter
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeFileSize, setResumeFileSize] = useState<number | undefined>(undefined);
  const [coverLetter, setCoverLetter] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step Validation
  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('First and last name are required.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('A valid email address is required.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const validateStep2 = () => {
    setErrorMsg(null);
    return true;
  };

  const validateStep3 = () => {
    if (!resumeUrl.trim()) {
      setErrorMsg('Please upload your resume before proceeding.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!resumeUrl.trim()) {
      setErrorMsg('Resume upload is required to submit application.');
      return;
    }

    const payload: CreateJobApplicationDto = {
      jobId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      resumeUrl,
      coverLetter: coverLetter.trim() || undefined,
      yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : 0,
      currentCompany: currentCompany.trim() || undefined,
      expectedSalary: expectedSalary ? Number(expectedSalary) : undefined,
      noticePeriod: noticePeriod.trim() || undefined,
      referredBy: referredBy.trim() || undefined,
      source: 'careers_portal',
    };

    try {
      await applyMutation.mutateAsync(payload);
      setIsSubmitted(true);
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to submit application';
      setErrorMsg(msg);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`p-8 text-center space-y-5 ${className}`}>
        <div className="mx-auto h-16 w-16 rounded-full bg-brand-500/10 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 dark:text-brand-400">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Application Received!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Thank you for applying to {jobTitle || 'Veyroo Tech'}. Our engineering leadership reviews applications continuously and will reach out via email.
          </p>
        </div>
        <div className="pt-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Close
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Steps Indicator */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        {[
          { step: 1, label: 'Basics', icon: User },
          { step: 2, label: 'Experience', icon: Briefcase },
          { step: 3, label: 'Resume', icon: FileText },
          { step: 4, label: 'Review', icon: FileCheck },
        ].map(({ step, label, icon: Icon }) => {
          const isActive = currentStep === step;
          const isDone = currentStep > step;

          return (
            <div
              key={step}
              className={`flex items-center gap-2 text-xs font-semibold ${
                isActive || isDone
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : isDone
                      ? 'bg-brand-500/10 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
              </div>
              <span className="hidden sm:inline">{label}</span>
            </div>
          );
        })}
      </div>

      {errorMsg && (
        <div className="p-3 text-xs rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: Candidate Basics */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                First Name *
              </label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ada"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Last Name *
              </label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Lovelace"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 712 345 678"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                LinkedIn Profile URL
              </label>
              <Input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/ada"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                GitHub URL
              </label>
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/ada"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Portfolio / Personal Website
              </label>
              <Input
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://ada.dev"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Experience & Expectations */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Years of Relevant Experience
              </label>
              <Input
                type="number"
                min="0"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Current / Most Recent Company
              </label>
              <Input
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="e.g. Distributed Labs Inc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Expected Monthly Salary (USD)
              </label>
              <Input
                type="number"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="6000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Notice Period / Availability
              </label>
              <select
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                className="w-full h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="Immediately">Immediately (No notice)</option>
                <option value="2 weeks">2 Weeks</option>
                <option value="1 month">1 Month</option>
                <option value="2 months">2 Months</option>
                <option value="3 months+">3 Months or more</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Referred By (Optional)
              </label>
              <Input
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value)}
                placeholder="Colleague or friend at Veyroo Tech"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Resume PDF & Cover Letter */}
      {currentStep === 3 && (
        <div className="space-y-5">
          {/* Resume Upload Component */}
          <div>
            <DocumentUpload
              value={resumeUrl}
              fileName={resumeFileName}
              fileSize={resumeFileSize}
              onChange={(url, meta) => {
                setResumeUrl(url);
                if (meta?.filename) setResumeFileName(meta.filename);
                if (meta?.size) setResumeFileSize(meta.size);
                setErrorMsg(null);
              }}
              onRemove={() => {
                setResumeUrl('');
                setResumeFileName('');
                setResumeFileSize(undefined);
              }}
              uploadFn={applicationsApi.uploadResume}
              label="Resume / Curriculum Vitae (PDF, DOC, DOCX) *"
              description="Upload your latest resume document up to 10MB"
            />

            {/* Alternative Direct URL option */}
            <div className="pt-3">
              <label className="block text-2xs text-slate-500 dark:text-slate-400 mb-1">
                Or paste a direct URL to your hosted resume (e.g. Google Drive, Dropbox, Portfolio):
              </label>
              <Input
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/.../view"
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Cover Letter / Personal Note (Optional)
            </label>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell us what excites you about this role, your recent architectural wins, or what you bring to the team..."
              rows={4}
            />
          </div>
        </div>
      )}

      {/* Step 4: Review & Confirmation */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-2xs text-brand-600 dark:text-brand-400">
              Application Summary
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500">Applicant:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {firstName} {lastName}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {email}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Experience:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {yearsOfExperience} years
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Notice Period:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {noticePeriod}
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Resume Attached:</span>{' '}
              <span className="font-mono text-2xs text-brand-600 dark:text-brand-400">
                {resumeFileName || resumeUrl}
              </span>
            </div>
          </div>

          <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
            By submitting this application, you confirm that the information provided is accurate and consent to Veyroo Tech evaluating your profile for open opportunities.
          </p>
        </div>
      )}

      {/* Navigation & Submission Controls */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
            >
              <span>Back</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}

          {currentStep < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleNext}
            >
              <span>Next</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={applyMutation.isPending}
              disabled={applyMutation.isPending}
              className="min-w-32 flex items-center justify-center gap-1.5"
            >
              <span>{applyMutation.isPending ? 'Submitting...' : 'Submit Application'}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
