export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  blog: {
    all: ['blog'] as const,
    lists: () => [...queryKeys.blog.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.blog.lists(), filters] as const,
    details: () => [...queryKeys.blog.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.blog.details(), slug] as const,
    categories: () => [...queryKeys.blog.all, 'categories'] as const,
  },
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.services.details(), slug] as const,
    categories: () => [...queryKeys.services.all, 'categories'] as const,
  },
  solutions: {
    all: ['solutions'] as const,
    lists: () => [...queryKeys.solutions.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.solutions.lists(), filters] as const,
    details: () => [...queryKeys.solutions.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.solutions.details(), slug] as const,
  },
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.products.details(), slug] as const,
  },
  portfolio: {
    all: ['portfolio'] as const,
    lists: () => [...queryKeys.portfolio.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.portfolio.lists(), filters] as const,
    details: () => [...queryKeys.portfolio.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.portfolio.details(), slug] as const,
    featured: () => [...queryKeys.portfolio.all, 'featured'] as const,
  },
  caseStudies: {
    all: ['case-studies'] as const,
    lists: () => [...queryKeys.caseStudies.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.caseStudies.lists(), filters] as const,
    details: () => [...queryKeys.caseStudies.all, 'detail'] as const,
    detail: (slug: string) =>
      [...queryKeys.caseStudies.details(), slug] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
    lists: () => [...queryKeys.testimonials.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.testimonials.lists(), filters] as const,
  },
  leads: {
    all: ['leads'] as const,
    lists: () => [...queryKeys.leads.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.leads.lists(), filters] as const,
    details: () => [...queryKeys.leads.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.leads.details(), id] as const,
  },
  consultations: {
    all: ['consultations'] as const,
    lists: () => [...queryKeys.consultations.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.consultations.lists(), filters] as const,
    details: () => [...queryKeys.consultations.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.consultations.details(), id] as const,
  },
  contact: {
    all: ['contact'] as const,
    lists: () => [...queryKeys.contact.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.contact.lists(), filters] as const,
    details: () => [...queryKeys.contact.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.contact.details(), id] as const,
  },
  careers: {
    all: ['careers'] as const,
    lists: () => [...queryKeys.careers.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.careers.lists(), filters] as const,
    details: () => [...queryKeys.careers.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.careers.details(), slug] as const,
  },
  applications: {
    all: ['applications'] as const,
    lists: () => [...queryKeys.applications.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.applications.lists(), filters] as const,
    details: () => [...queryKeys.applications.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.applications.details(), id] as const,
  },
  newsletter: {
    all: ['newsletter'] as const,
    subscribers: (filters?: Record<string, unknown>) =>
      [...queryKeys.newsletter.all, 'subscribers', filters] as const,
  },
  media: {
    all: ['media'] as const,
    lists: () => [...queryKeys.media.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.media.lists(), filters] as const,
    details: () => [...queryKeys.media.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.media.details(), id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.notifications.lists(), filters] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    dashboard: (range?: string) =>
      [...queryKeys.analytics.all, 'dashboard', range] as const,
    pageViews: (range?: string) =>
      [...queryKeys.analytics.all, 'page-views', range] as const,
    trafficSources: (range?: string) =>
      [...queryKeys.analytics.all, 'traffic-sources', range] as const,
  },
  audit: {
    all: ['audit'] as const,
    lists: () => [...queryKeys.audit.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.audit.lists(), filters] as const,
    details: () => [...queryKeys.audit.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.audit.details(), id] as const,
  },
  settings: {
    all: ['settings'] as const,
    public: () => [...queryKeys.settings.all, 'public'] as const,
    group: (group: string) =>
      [...queryKeys.settings.all, 'group', group] as const,
  },
  health: {
    all: ['health'] as const,
    system: () => [...queryKeys.health.all, 'system'] as const,
    detailed: () => [...queryKeys.health.all, 'detailed'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    metrics: () => [...queryKeys.dashboard.all, 'metrics'] as const,
    recentActivity: () =>
      [...queryKeys.dashboard.all, 'recent-activity'] as const,
  },
} as const;
