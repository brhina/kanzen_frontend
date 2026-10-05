import { describe, expect, it } from 'vitest';
import { queryKeys } from '../query-keys.factory';

describe('queryKeys Factory', () => {
  it('defines hierarchical query keys for all core domains', () => {
    // Auth
    expect(queryKeys.auth.all).toEqual(['auth']);
    expect(queryKeys.auth.me()).toEqual(['auth', 'me']);

    // Users
    expect(queryKeys.users.all).toEqual(['users']);
    expect(queryKeys.users.lists()).toEqual(['users', 'list']);
    expect(queryKeys.users.list({ role: 'admin' })).toEqual(['users', 'list', { role: 'admin' }]);
    expect(queryKeys.users.detail('u-123')).toEqual(['users', 'detail', 'u-123']);

    // Blog
    expect(queryKeys.blog.all).toEqual(['blog']);
    expect(queryKeys.blog.detail('microservices-guide')).toEqual(['blog', 'detail', 'microservices-guide']);
    expect(queryKeys.blog.categories()).toEqual(['blog', 'categories']);

    // Services
    expect(queryKeys.services.all).toEqual(['services']);
    expect(queryKeys.services.detail('cloud-consulting')).toEqual(['services', 'detail', 'cloud-consulting']);

    // Solutions
    expect(queryKeys.solutions.all).toEqual(['solutions']);

    // Products
    expect(queryKeys.products.all).toEqual(['products']);

    // Portfolio
    expect(queryKeys.portfolio.featured()).toEqual(['portfolio', 'featured']);

    // Case Studies
    expect(queryKeys.caseStudies.detail('fintech-scale')).toEqual(['case-studies', 'detail', 'fintech-scale']);

    // Testimonials
    expect(queryKeys.testimonials.lists()).toEqual(['testimonials', 'list']);

    // Leads & Consultations
    expect(queryKeys.leads.detail('lead-1')).toEqual(['leads', 'detail', 'lead-1']);
    expect(queryKeys.consultations.detail('c-1')).toEqual(['consultations', 'detail', 'c-1']);

    // Contact
    expect(queryKeys.contact.detail('cnt-1')).toEqual(['contact', 'detail', 'cnt-1']);

    // Careers & Applications
    expect(queryKeys.careers.detail('sr-fullstack')).toEqual(['careers', 'detail', 'sr-fullstack']);
    expect(queryKeys.applications.detail('app-1')).toEqual(['applications', 'detail', 'app-1']);

    // Newsletter & Media
    expect(queryKeys.newsletter.subscribers({ active: true })).toEqual(['newsletter', 'subscribers', { active: true }]);
    expect(queryKeys.media.lists()).toEqual(['media', 'list']);

    // Notifications & Analytics
    expect(queryKeys.notifications.unreadCount()).toEqual(['notifications', 'unread-count']);
    expect(queryKeys.analytics.dashboard('30d')).toEqual(['analytics', 'dashboard', '30d']);

    // Audit, Settings, Health, Dashboard
    expect(queryKeys.audit.detail('aud-1')).toEqual(['audit', 'detail', 'aud-1']);
    expect(queryKeys.settings.group('smtp')).toEqual(['settings', 'group', 'smtp']);
    expect(queryKeys.health.detailed()).toEqual(['health', 'detailed']);
    expect(queryKeys.dashboard.metrics()).toEqual(['dashboard', 'metrics']);
  });
});
