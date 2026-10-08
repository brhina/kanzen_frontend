import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { settingsApi } from '../../infrastructure/settings.api';

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

const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: 'Kanzen Tech',
  tagline: 'Engineering Digital Mastery',
  email: 'contact@kanzen.tech',
  phone: '+254 700 000 000',
  address: 'Nairobi, Kenya',
};

const DEFAULT_SEO_SETTINGS: SeoSettings = {
  defaultTitle: 'Kanzen Tech | Premium Product Engineering & SaaS Solutions',
  defaultDescription:
    'Kanzen Tech engineers high-performance web systems, cloud architectures, and modern product experiences.',
};

const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  supportEmail: 'contact@kanzen.tech',
  businessHours: 'Monday – Friday: 08:00 – 18:00 EAT',
  headquarters: 'Nairobi, Kenya',
};

const DEFAULT_SOCIAL_PRESETS: Array<{ key: string; url: string }> = [
  { key: 'social.github', url: 'https://github.com/kanzen-tech' },
  { key: 'social.linkedin', url: 'https://linkedin.com/company/kanzen-tech' },
  { key: 'social.twitter', url: 'https://twitter.com/kanzentech' },
];

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

export function usePublicSettings() {
  const query = useQuery<Record<string, unknown>>({
    queryKey: queryKeys.settings.public(),
    queryFn: async () => {
      return settingsApi.getPublic();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const rawSettings = query.data || {};

  const company = useMemo<CompanySettings>(() => {
    return {
      name: String(rawSettings['company.name'] || DEFAULT_COMPANY_SETTINGS.name),
      tagline: String(rawSettings['company.tagline'] || DEFAULT_COMPANY_SETTINGS.tagline),
      email: String(rawSettings['company.email'] || DEFAULT_COMPANY_SETTINGS.email),
      phone: String(rawSettings['company.phone'] || DEFAULT_COMPANY_SETTINGS.phone),
      address: String(rawSettings['company.address'] || DEFAULT_COMPANY_SETTINGS.address),
    };
  }, [rawSettings]);

  const seo = useMemo<SeoSettings>(() => {
    return {
      defaultTitle: String(rawSettings['seo.defaultTitle'] || DEFAULT_SEO_SETTINGS.defaultTitle),
      defaultDescription: String(
        rawSettings['seo.defaultDescription'] || DEFAULT_SEO_SETTINGS.defaultDescription,
      ),
    };
  }, [rawSettings]);

  const contact = useMemo<ContactSettings>(() => {
    return {
      supportEmail: String(
        rawSettings['contact.supportEmail'] || rawSettings['company.email'] || DEFAULT_CONTACT_SETTINGS.supportEmail,
      ),
      businessHours: String(
        rawSettings['contact.businessHours'] || DEFAULT_CONTACT_SETTINGS.businessHours,
      ),
      headquarters: String(
        rawSettings['contact.headquarters'] || rawSettings['company.address'] || DEFAULT_CONTACT_SETTINGS.headquarters,
      ),
    };
  }, [rawSettings]);

  const socialLinks = useMemo<SocialLinkItem[]>(() => {
    const links: SocialLinkItem[] = [];
    const seenPlatforms = new Set<string>();

    // 1. Check dynamic keys from settings
    const socialKeys = Object.keys(rawSettings)
      .filter((k) => k.startsWith('social.') && typeof rawSettings[k] === 'string' && String(rawSettings[k]).trim().length > 0)
      .sort();

    if (socialKeys.length > 0) {
      for (const key of socialKeys) {
        const rawUrl = String(rawSettings[key]).trim();
        const { id, label, platform } = detectSocialPlatform(key, rawUrl);
        seenPlatforms.add(id);
        links.push({
          id,
          key,
          label,
          url: rawUrl,
          platform,
        });
      }
    } else {
      // 2. If no social keys returned from backend yet, use default presets
      for (const preset of DEFAULT_SOCIAL_PRESETS) {
        const rawUrl = preset.url;
        const { id, label, platform } = detectSocialPlatform(preset.key, rawUrl);
        links.push({
          id,
          key: preset.key,
          label,
          url: rawUrl,
          platform,
        });
      }
    }

    return links;
  }, [rawSettings]);

  const getSetting = <T = unknown>(key: string, defaultValue?: T): T => {
    if (rawSettings[key] !== undefined && rawSettings[key] !== null) {
      return rawSettings[key] as T;
    }
    return defaultValue as T;
  };

  return {
    ...query,
    settings: rawSettings,
    company,
    seo,
    contact,
    socialLinks,
    getSetting,
  };
}

export function useSocialLinks(): SocialLinkItem[] {
  const { socialLinks } = usePublicSettings();
  return socialLinks;
}

export function useCompanySettings(): CompanySettings & { company: CompanySettings } {
  const { company } = usePublicSettings();
  return {
    ...company,
    company,
  };
}

export function useContactSettings(): ContactSettings & { contact: ContactSettings } {
  const { contact } = usePublicSettings();
  return {
    ...contact,
    contact,
  };
}
