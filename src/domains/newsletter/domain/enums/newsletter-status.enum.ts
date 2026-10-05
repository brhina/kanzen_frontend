export const NewsletterSubscriberStatus = {
  ACTIVE: 'active',
  PENDING: 'pending',
  UNSUBSCRIBED: 'unsubscribed',
  BOUNCED: 'bounced',
} as const;

export type NewsletterSubscriberStatus =
  (typeof NewsletterSubscriberStatus)[keyof typeof NewsletterSubscriberStatus];
