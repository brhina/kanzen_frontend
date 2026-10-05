export const PERMISSION_MATRIX = [
  // Users
  'users:read',
  'users:write',
  'users:delete',
  // Leads
  'leads:read',
  'leads:write',
  'leads:delete',
  'leads:export',
  'leads:assign',
  'leads:convert',
  // Contact
  'contact:read',
  'contact:write',
  'contact:delete',
  // Consultations
  'consultations:read',
  'consultations:write',
  'consultations:delete',
  'consultations:confirm',
  // Services
  'services:read',
  'services:write',
  'services:delete',
  // Solutions
  'solutions:read',
  'solutions:write',
  'solutions:delete',
  // Products
  'products:read',
  'products:write',
  'products:delete',
  // Portfolio
  'portfolio:read',
  'portfolio:write',
  'portfolio:delete',
  // Case Studies
  'case-studies:read',
  'case-studies:write',
  'case-studies:delete',
  // Testimonials
  'testimonials:read',
  'testimonials:write',
  'testimonials:delete',
  'testimonials:approve',
  // Blog
  'blog:read',
  'blog:write',
  'blog:delete',
  'blog:publish',
  // Newsletter
  'newsletter:read',
  'newsletter:export',
  'newsletter:delete',
  // Careers
  'careers:read',
  'careers:write',
  'careers:delete',
  'applications:read',
  'applications:write',
  // Media
  'media:read',
  'media:write',
  'media:delete',
  // Analytics
  'analytics:read',
  // Audit
  'audit:read',
  // Settings
  'settings:read',
  'settings:write',
  // Notifications
  'notifications:read',
  'notifications:write',
] as const;

export type Permission = (typeof PERMISSION_MATRIX)[number];

export const PERMISSIONS = {
  // Users
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',
  // Leads
  LEADS_READ: 'leads:read',
  LEADS_WRITE: 'leads:write',
  LEADS_DELETE: 'leads:delete',
  LEADS_EXPORT: 'leads:export',
  LEADS_ASSIGN: 'leads:assign',
  LEADS_CONVERT: 'leads:convert',
  // Contact
  CONTACT_READ: 'contact:read',
  CONTACT_WRITE: 'contact:write',
  CONTACT_DELETE: 'contact:delete',
  // Consultations
  CONSULTATIONS_READ: 'consultations:read',
  CONSULTATIONS_WRITE: 'consultations:write',
  CONSULTATIONS_DELETE: 'consultations:delete',
  CONSULTATIONS_CONFIRM: 'consultations:confirm',
  // Services
  SERVICES_READ: 'services:read',
  SERVICES_WRITE: 'services:write',
  SERVICES_DELETE: 'services:delete',
  // Solutions
  SOLUTIONS_READ: 'solutions:read',
  SOLUTIONS_WRITE: 'solutions:write',
  SOLUTIONS_DELETE: 'solutions:delete',
  // Products
  PRODUCTS_READ: 'products:read',
  PRODUCTS_WRITE: 'products:write',
  PRODUCTS_DELETE: 'products:delete',
  // Portfolio
  PORTFOLIO_READ: 'portfolio:read',
  PORTFOLIO_WRITE: 'portfolio:write',
  PORTFOLIO_DELETE: 'portfolio:delete',
  // Case Studies
  CASE_STUDIES_READ: 'case-studies:read',
  CASE_STUDIES_WRITE: 'case-studies:write',
  CASE_STUDIES_DELETE: 'case-studies:delete',
  // Testimonials
  TESTIMONIALS_READ: 'testimonials:read',
  TESTIMONIALS_WRITE: 'testimonials:write',
  TESTIMONIALS_DELETE: 'testimonials:delete',
  TESTIMONIALS_APPROVE: 'testimonials:approve',
  // Blog
  BLOG_READ: 'blog:read',
  BLOG_WRITE: 'blog:write',
  BLOG_DELETE: 'blog:delete',
  BLOG_PUBLISH: 'blog:publish',
  // Newsletter
  NEWSLETTER_READ: 'newsletter:read',
  NEWSLETTER_EXPORT: 'newsletter:export',
  NEWSLETTER_DELETE: 'newsletter:delete',
  // Careers & Applications
  CAREERS_READ: 'careers:read',
  CAREERS_WRITE: 'careers:write',
  CAREERS_DELETE: 'careers:delete',
  APPLICATIONS_READ: 'applications:read',
  APPLICATIONS_WRITE: 'applications:write',
  // Media
  MEDIA_READ: 'media:read',
  MEDIA_WRITE: 'media:write',
  MEDIA_DELETE: 'media:delete',
  // Analytics
  ANALYTICS_READ: 'analytics:read',
  // Audit
  AUDIT_READ: 'audit:read',
  // Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',
  // Notifications
  NOTIFICATIONS_READ: 'notifications:read',
  NOTIFICATIONS_WRITE: 'notifications:write',
} as const satisfies Record<string, Permission>;

export function isValidPermission(permission: string): permission is Permission {
  return (PERMISSION_MATRIX as readonly string[]).includes(permission);
}
