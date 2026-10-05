export const TestimonialStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type TestimonialStatus =
  (typeof TestimonialStatus)[keyof typeof TestimonialStatus];

export const TESTIMONIAL_STATUS_LABELS: Record<TestimonialStatus, string> = {
  [TestimonialStatus.PENDING]: 'Pending Moderation',
  [TestimonialStatus.APPROVED]: 'Approved & Verified',
  [TestimonialStatus.REJECTED]: 'Rejected',
};
