import React, { useState } from 'react';
import { useApplyForJob } from '../../application/use-cases/useApplyForJob';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Sparkles,
  User,
  Briefcase,
  FileCheck,
  AlertCircle,
  X,
} from 'lucide-react';
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
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // File drop handler for PDF
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setErrorMsg('Please upload a PDF file for your resume.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Resume file size must not exceed 10MB.');
        return;
      }
      setErrorMsg(null);
      setResumeFile(file);

      // Create a local blob/data URL or cloud link
      try {
        const fileUrl = URL.createObjectURL(file);
        setResumeUrl(fileUrl);
      } catch {
        // Fallback
        setResumeUrl(`https://storage.kanzen.tech/resumes/${file.name}`);
      }
    }
  };

  const removeResumeFile = () => {
    setResumeFile(null);
    setResumeUrl('');
  };

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
    if (!resumeUrl.trim() && !resumeFile) {
      setErrorMsg('Please upload your resume PDF or provide a direct link.');
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

    const finalResumeUrl =
      resumeUrl ||
      (resumeFile
        ? `https://storage.kanzen.tech/resumes/${encodeURIComponent(resumeFile.name)}`
        : 'https://cdn.kanzen.tech/resumes/applicant-resume.pdf');

    const payload: CreateJobApplicationDto = {
      jobId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      resumeUrl: finalResumeUrl,
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
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Application Received!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Thank you for applying to {jobTitle || 'Kanzen Tech'}. Our engineering leadership reviews applications continuously and will reach out via email.
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
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : isDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400'
              }`}
            >
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : isDone
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
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
                className="w-full h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
                placeholder="Colleague or friend at Kanzen"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Resume PDF & Cover Letter */}
      {currentStep === 3 && (
        <div className="space-y-5">
          {/* Resume Upload Box */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Resume / Curriculum Vitae (PDF) *
            </label>

            {resumeFile ? (
              <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {resumeFile.name}
                    </p>
                    <p className="text-2xs text-slate-500">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeResumeFile}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group bg-slate-50/50 dark:bg-slate-900/40">
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Click to upload or drag & drop your PDF resume
                  </p>
                  <p className="text-2xs text-slate-500 dark:text-slate-400">
                    PDF files only, up to 10MB
                  </p>
                </div>
              </label>
            )}

            {/* Alternative Direct URL option */}
            <div className="pt-2">
              <label className="block text-2xs text-slate-500 dark:text-slate-400 mb-1">
                Or provide a direct link to your hosted resume (e.g. Google Drive, Dropbox, Notion):
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
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-2xs text-indigo-600 dark:text-indigo-400">
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
              <span className="font-mono text-2xs text-indigo-600 dark:text-indigo-400">
                {resumeFile ? resumeFile.name : resumeUrl}
              </span>
            </div>
          </div>

          <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
            By submitting this application, you confirm that the information provided is accurate and consent to Kanzen Tech evaluating your profile for open opportunities.
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
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <span>Next</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={applyMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-32 flex items-center justify-center gap-1.5"
            >
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Submit Application</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
