import type {
  AboutPageContent,
  AboutStatItem,
  CompanySettings,
  CompanyValueItem,
  CompetenciesContent,
  ContactPageContent,
  ContactSettings,
  FooterContent,
  HeroContent,
  HomeCtaContent,
  HomePageContent,
  NewsletterContent,
  ProcessSectionContent,
  ProcessStepItem,
  ProofPointItem,
  SeoSettings,
  SocialLinkItem,
  TestimonialsPageContent,
  TestimonialsSectionContent,
} from '../../domain/settings-content.types';

export type RawSettings = Record<string, unknown>;

/**
 * Structural fallbacks only — never marketing copy. All page content is
 * seeded and edited through the backend settings module.
 */
export const EMPTY_COMPANY: CompanySettings = {
  name: '',
  tagline: '',
  email: '',
  phone: '',
  address: '',
};

export const EMPTY_SEO: SeoSettings = {
  defaultTitle: '',
  defaultDescription: '',
};

export const EMPTY_CONTACT: ContactSettings = {
  supportEmail: '',
  businessHours: '',
  headquarters: '',
};

export function parseJsonSetting<T>(value: unknown, fallback: T): T {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'object' && value !== null) return value as T;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function readString(raw: RawSettings, key: string): string {
  const value = raw[key];
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return '';
  return String(value);
}

export function readList<T>(raw: RawSettings, key: string): T[] {
  const parsed = parseJsonSetting<T[]>(raw[key], []);
  return Array.isArray(parsed) ? parsed : [];
}

/**
 * Resolves `{{placeholder}}` tokens in settings-driven copy, e.g.
 * `"Get in Touch with {{companyName}}"`.
 */
export function interpolate(
  template: string,
  vars: Record<string, string | undefined>,
): string {
  if (!template) return '';
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => {
    const replacement = vars[name];
    return replacement !== undefined && replacement !== null ? replacement : match;
  });
}

export function detectSocialPlatform(key: string, url: string): {
  id: string;
  label: string;
  platform: SocialLinkItem['platform'];
} {
  const normalizedKey = key.toLowerCase().replace(/^social\./, '');
  const lowerUrl = url.toLowerCase();

  if (normalizedKey.includes('github') || lowerUrl.includes('github.com')) {
    return { id: 'github', label: 'GitHub', platform: 'github' };
  }
  if (normalizedKey.includes('linkedin') || lowerUrl.includes('linkedin.com')) {
    return { id: 'linkedin', label: 'LinkedIn', platform: 'linkedin' };
  }
  if (
    normalizedKey.includes('twitter') ||
    normalizedKey === 'x' ||
    lowerUrl.includes('twitter.com') ||
    lowerUrl.includes('x.com')
  ) {
    return { id: 'twitter', label: 'X (Twitter)', platform: 'twitter' };
  }
  if (
    normalizedKey.includes('youtube') ||
    lowerUrl.includes('youtube.com') ||
    lowerUrl.includes('youtu.be')
  ) {
    return { id: 'youtube', label: 'YouTube', platform: 'youtube' };
  }
  if (normalizedKey.includes('instagram') || lowerUrl.includes('instagram.com')) {
    return { id: 'instagram', label: 'Instagram', platform: 'instagram' };
  }
  if (normalizedKey.includes('facebook') || lowerUrl.includes('facebook.com')) {
    return { id: 'facebook', label: 'Facebook', platform: 'facebook' };
  }
  if (normalizedKey.includes('discord') || lowerUrl.includes('discord.gg') || lowerUrl.includes('discord.com')) {
    return { id: 'discord', label: 'Discord', platform: 'discord' };
  }
  if (normalizedKey.includes('slack') || lowerUrl.includes('slack.com')) {
    return { id: 'slack', label: 'Slack', platform: 'slack' };
  }

  const label =
    normalizedKey
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Social Profile';

  return { id: normalizedKey || 'social', label, platform: 'generic' };
}

export function selectCompany(raw: RawSettings): CompanySettings {
  return {
    name: readString(raw, 'company.name'),
    tagline: readString(raw, 'company.tagline'),
    email: readString(raw, 'company.email'),
    phone: readString(raw, 'company.phone'),
    address: readString(raw, 'company.address'),
  };
}

export function selectSeo(raw: RawSettings): SeoSettings {
  return {
    defaultTitle: readString(raw, 'seo.defaultTitle'),
    defaultDescription: readString(raw, 'seo.defaultDescription'),
  };
}

export function selectContact(raw: RawSettings): ContactSettings {
  const company = selectCompany(raw);
  return {
    supportEmail: readString(raw, 'contact.supportEmail') || company.email,
    businessHours: readString(raw, 'contact.businessHours'),
    headquarters: readString(raw, 'contact.headquarters') || company.address,
  };
}

export function selectSocialLinks(raw: RawSettings): SocialLinkItem[] {
  const links: SocialLinkItem[] = [];
  const socialKeys = Object.keys(raw)
    .filter(
      (k) =>
        k.startsWith('social.') &&
        typeof raw[k] === 'string' &&
        String(raw[k]).trim().length > 0,
    )
    .sort();

  for (const key of socialKeys) {
    const rawUrl = String(raw[key]).trim();
    const { id, label, platform } = detectSocialPlatform(key, rawUrl);
    links.push({ id, key, label, url: rawUrl, platform });
  }

  return links;
}

export function selectProofPoints(raw: RawSettings): ProofPointItem[] {
  return readList<ProofPointItem>(raw, 'company.proof_points');
}

export function selectCompanyValues(raw: RawSettings): CompanyValueItem[] {
  return readList<CompanyValueItem>(raw, 'company.values');
}

export function selectProcessSteps(raw: RawSettings): ProcessStepItem[] {
  return readList<ProcessStepItem>(raw, 'company.process_steps');
}

export function selectHeroContent(raw: RawSettings): HeroContent {
  return {
    badge: readString(raw, 'home.hero.badge'),
    kicker: readString(raw, 'home.hero.kicker'),
    title: readString(raw, 'home.hero.title'),
    titleHighlight: readString(raw, 'home.hero.titleHighlight'),
    subtitle: readString(raw, 'home.hero.subtitle'),
    loadingText: readString(raw, 'home.hero.loadingText'),
    primaryCtaLabel: readString(raw, 'home.hero.primaryCtaLabel'),
    primaryCtaHref: readString(raw, 'home.hero.primaryCtaHref') || '/contact',
    secondaryCtaLabel: readString(raw, 'home.hero.secondaryCtaLabel'),
    secondaryCtaHref: readString(raw, 'home.hero.secondaryCtaHref') || '/solutions',
    actionLabels: parseJsonSetting(raw['home.hero.actionLabels'], {}),
  };
}

export function selectCompetenciesContent(raw: RawSettings): CompetenciesContent {
  return {
    badge: readString(raw, 'home.competencies.badge'),
    title: readString(raw, 'home.competencies.title'),
    description: readString(raw, 'home.competencies.description'),
    cardCtaLabel: readString(raw, 'home.competencies.cardCtaLabel'),
    fallbackItems: readList(raw, 'home.competencies.fallbackItems'),
  };
}

export function selectTestimonialsSection(
  raw: RawSettings,
): TestimonialsSectionContent {
  const company = selectCompany(raw);
  return {
    badge: readString(raw, 'home.testimonials.badge'),
    title: readString(raw, 'home.testimonials.title'),
    description: interpolate(readString(raw, 'home.testimonials.description'), {
      companyName: company.name,
      tagline: company.tagline,
    }),
    ctaLabel: readString(raw, 'home.testimonials.ctaLabel'),
    loadingText: readString(raw, 'home.testimonials.loadingText'),
    emptyText: readString(raw, 'home.testimonials.emptyText'),
  };
}

export function selectHomeCta(raw: RawSettings): HomeCtaContent {
  return {
    title: readString(raw, 'home.cta.title'),
    description: readString(raw, 'home.cta.description'),
    primaryLabel: readString(raw, 'home.cta.primaryLabel'),
    primaryHref: readString(raw, 'home.cta.primaryHref') || '/consultations',
    secondaryLabel: readString(raw, 'home.cta.secondaryLabel'),
    secondaryHref: readString(raw, 'home.cta.secondaryHref') || '/case-studies',
  };
}

export function selectHomePageContent(raw: RawSettings): HomePageContent {
  return {
    hero: selectHeroContent(raw),
    competencies: selectCompetenciesContent(raw),
    testimonials: selectTestimonialsSection(raw),
    cta: selectHomeCta(raw),
    proofPoints: selectProofPoints(raw),
    processSteps: selectProcessSteps(raw),
  };
}

export function selectAboutPageContent(raw: RawSettings): AboutPageContent {
  const company = selectCompany(raw);
  const vars = { companyName: company.name, tagline: company.tagline };

  return {
    banner: {
      badge: readString(raw, 'about.banner.badge'),
      title: readString(raw, 'about.banner.title'),
      description: interpolate(readString(raw, 'about.banner.description'), vars),
    },
    story: {
      badge: readString(raw, 'about.story.badge'),
      title: readString(raw, 'about.story.title'),
      description: interpolate(readString(raw, 'about.story.description'), vars),
    },
    mission: {
      title: readString(raw, 'about.mission.title'),
      text: interpolate(readString(raw, 'about.mission.text'), vars),
    },
    vision: {
      title: readString(raw, 'about.vision.title'),
      text: interpolate(readString(raw, 'about.vision.text'), vars),
    },
    stats: readList<AboutStatItem>(raw, 'about.stats'),
    values: selectCompanyValues(raw),
    cta: {
      title: readString(raw, 'about.cta.title'),
      description: readString(raw, 'about.cta.description'),
      buttonLabel: readString(raw, 'about.cta.buttonLabel'),
      buttonHref: readString(raw, 'about.cta.buttonHref') || '/contact',
    },
  };
}

export function selectProcessSection(raw: RawSettings): ProcessSectionContent {
  return {
    badge: readString(raw, 'process.badge'),
    title: readString(raw, 'process.title'),
    description: readString(raw, 'process.description'),
    sectionCtaLabel: readString(raw, 'process.sectionCtaLabel'),
    cta: {
      title: readString(raw, 'process.cta.title'),
      description: readString(raw, 'process.cta.description'),
      buttonLabel: readString(raw, 'process.cta.buttonLabel'),
      buttonHref: readString(raw, 'process.cta.buttonHref') || '/contact',
    },
  };
}

export function selectContactPageContent(raw: RawSettings): ContactPageContent {
  const company = selectCompany(raw);
  const contact = selectContact(raw);
  return {
    badge: readString(raw, 'contact.badge'),
    title: interpolate(readString(raw, 'contact.title'), {
      companyName: company.name,
      tagline: company.tagline,
    }),
    description: readString(raw, 'contact.description'),
    supportEmail: contact.supportEmail,
    businessHours: contact.businessHours,
    headquarters: contact.headquarters,
  };
}

export function selectTestimonialsPageContent(
  raw: RawSettings,
): TestimonialsPageContent {
  return {
    banner: {
      badge: readString(raw, 'testimonials.banner.badge'),
      title: readString(raw, 'testimonials.banner.title'),
      description: readString(raw, 'testimonials.banner.description'),
    },
  };
}

export function selectNewsletterContent(raw: RawSettings): NewsletterContent {
  return {
    badge: readString(raw, 'newsletter.badge'),
    title: readString(raw, 'newsletter.title'),
    description: readString(raw, 'newsletter.description'),
  };
}

export function selectFooterContent(raw: RawSettings): FooterContent {
  const company = selectCompany(raw);
  return {
    name: company.name,
    tagline: company.tagline,
    description: readString(raw, 'footer.description'),
    aboutLinkLabel: interpolate(readString(raw, 'footer.aboutLinkLabel'), {
      companyName: company.name,
      tagline: company.tagline,
    }),
  };
}
