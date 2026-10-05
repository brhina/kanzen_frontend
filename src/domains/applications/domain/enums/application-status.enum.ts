export const ApplicationStatus = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  REJECTED: 'rejected',
  HIRED: 'hired',
  WITHDRAWN: 'withdrawn',
} as const;

export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const JobApplicationStatus = ApplicationStatus;
export type JobApplicationStatus = ApplicationStatus;
