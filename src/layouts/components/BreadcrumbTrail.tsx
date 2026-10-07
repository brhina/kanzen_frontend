import { useLocation } from 'react-router';
import { Breadcrumb, type BreadcrumbItem } from '@/shared/ui/breadcrumb';

export interface BreadcrumbTrailProps {
  className?: string;
}

const SEGMENT_LABELS: Record<string, string> = {
  about: 'About Us',
  process: 'Our Process',
  dashboard: 'Dashboard',
  blog: 'Blog',
  category: 'Category',
  services: 'Services',
  solutions: 'Solutions',
  products: 'Products',
  portfolio: 'Portfolio',
  'case-studies': 'Case Studies',
  testimonials: 'Testimonials',
  leads: 'Leads',
  consultations: 'Consultations',
  contact: 'Contact Us',
  careers: 'Careers',
  applications: 'Applications',
  newsletter: 'Newsletter',
  media: 'Media Assets',
  notifications: 'Notifications',
  analytics: 'Analytics',
  audit: 'Audit Log',
  settings: 'Settings',
  health: 'System Health',
  users: 'Team & Permissions',
  login: 'Sign In',
  'reset-password': 'Reset Password',
};

function formatSegment(segment: string): string {
  if (SEGMENT_LABELS[segment]) {
    return SEGMENT_LABELS[segment];
  }
  // Decode and capitalize hyphenated/underscored words
  try {
    const decoded = decodeURIComponent(segment);
    return decoded
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  } catch {
    return segment;
  }
}

/**
 * Dynamic breadcrumb trail component that extracts route segments
 * from the active URL path and renders an accessible navigation trail.
 */
export function BreadcrumbTrail({ className = '' }: BreadcrumbTrailProps) {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  // Skip rendering on the root landing page
  if (segments.length === 0) {
    return null;
  }

  const items: BreadcrumbItem[] = [];
  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    items.push({
      label: formatSegment(segment),
      href: isLast ? undefined : currentPath,
    });
  });

  return (
    <div
      aria-label="Breadcrumb navigation wrapper"
      className={`w-full px-4 sm:px-6 lg:px-8 pt-4 pb-1 ${className}`}
    >
      <Breadcrumb items={items} />
    </div>
  );
}

export default BreadcrumbTrail;
