import { useEffect } from 'react';
import { APP_CONFIG } from '../../core/config/constants';
import { usePublicSettings } from '@/domains/settings/application/use-cases/usePublicSettings';

export interface SeoMetaOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
}

/**
 * Dynamically updates document metadata, OpenGraph tags, and canonical link,
 * falling back to live administrative SEO & Company settings when available.
 */
export function useSeoMeta({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  type = 'website',
}: SeoMetaOptions = {}): void {
  const { seo, company } = usePublicSettings();

  const companyName = company.name || APP_CONFIG.name;
  const defaultFullTitle =
    seo.defaultTitle || `${companyName} — ${company.tagline || APP_CONFIG.tagline}`;
  const effectiveDescription =
    description || seo.defaultDescription || company.tagline || APP_CONFIG.tagline;

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Update Title
    const baseTitle = companyName;
    document.title = title ? `${title} | ${baseTitle}` : defaultFullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content?: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Metadata
    setMetaTag('name', 'description', effectiveDescription);
    if (keywords && keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '));
    }

    // 3. Open Graph Tags
    setMetaTag('property', 'og:title', title || baseTitle);
    setMetaTag('property', 'og:description', effectiveDescription);
    setMetaTag('property', 'og:type', type);
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage);
    }

    // 4. Canonical URL Link
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }
  }, [
    title,
    effectiveDescription,
    companyName,
    defaultFullTitle,
    keywords,
    ogImage,
    canonicalUrl,
    type,
  ]);
}
