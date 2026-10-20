/**
 * Typed shapes for settings-backed page content.
 *
 * Every string/array rendered by marketing pages is sourced from the backend
 * settings registry (`GET /api/v1/settings/public`) — pages never hardcode
 * copy, and hooks fall back to empty structural values only.
 */

export interface SocialLinkItem {
  id: string;
  key: string;
  label: string;
  url: string;
  platform:
    | 'github'
    | 'linkedin'
    | 'twitter'
    | 'x'
    | 'youtube'
    | 'instagram'
    | 'facebook'
    | 'discord'
    | 'slack'
    | 'generic';
}

export interface CompanySettings {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
}

export interface SeoSettings {
  defaultTitle: string;
  defaultDescription: string;
}

export interface ContactSettings {
  supportEmail: string;
  businessHours: string;
  headquarters: string;
}

export interface ProofPointItem {
  label: string;
  icon?: string;
}

export interface CompanyValueItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ProcessStepItem {
  step: string;
  title: string;
  description: string;
  icon?: string;
}

export interface CompetencyItem {
  title: string;
  description: string;
  icon?: string;
  href: string;
}

export interface AboutStatItem {
  value: string;
  label: string;
  icon?: string;
}

export interface HeroActionLabels {
  [type: string]: string;
}

export interface HeroContent {
  badge: string;
  kicker: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  loadingText: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  actionLabels: HeroActionLabels;
}

export interface CompetenciesContent {
  badge: string;
  title: string;
  description: string;
  cardCtaLabel: string;
  fallbackItems: CompetencyItem[];
}

export interface TestimonialsSectionContent {
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  loadingText: string;
  emptyText: string;
}

export interface HomeCtaContent {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export interface ProcessSectionContent {
  badge: string;
  title: string;
  description: string;
  sectionCtaLabel: string;
  cta: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
}

export interface AboutBannerContent {
  badge: string;
  title: string;
  description: string;
}

export interface AboutCtaContent {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface AboutPageContent {
  banner: AboutBannerContent;
  story: { badge: string; title: string; description: string };
  mission: { title: string; text: string };
  vision: { title: string; text: string };
  stats: AboutStatItem[];
  values: CompanyValueItem[];
  cta: AboutCtaContent;
}

export interface HomePageContent {
  hero: HeroContent;
  competencies: CompetenciesContent;
  testimonials: TestimonialsSectionContent;
  cta: HomeCtaContent;
  proofPoints: ProofPointItem[];
  processSteps: ProcessStepItem[];
}

export interface ContactPageContent {
  badge: string;
  title: string;
  description: string;
  supportEmail: string;
  businessHours: string;
  headquarters: string;
}

export interface TestimonialsPageContent {
  banner: AboutBannerContent;
}

export interface NewsletterContent {
  badge: string;
  title: string;
  description: string;
}

export interface FooterContent {
  name: string;
  tagline: string;
  description: string;
  aboutLinkLabel: string;
}
