import { useMemo } from 'react';
import {
  selectAboutPageContent,
  selectContactPageContent,
  selectFooterContent,
  selectHomePageContent,
  selectNewsletterContent,
  selectProcessSection,
  selectTestimonialsPageContent,
} from './settings.selectors';
import { usePublicSettings, useSettingsLoading } from './usePublicSettings';
import type {
  AboutPageContent,
  ContactPageContent,
  FooterContent,
  HomePageContent,
  NewsletterContent,
  ProcessSectionContent,
  TestimonialsPageContent,
} from '../../domain/settings-content.types';

export interface PageContentResult<T> {
  content: T;
  isLoading: boolean;
}

/**
 * Settings-backed content hooks for marketing pages. Content comes
 * exclusively from the backend settings registry; while the first fetch is
 * in flight `isLoading` is true and strings are empty.
 */
export function useHomePageContent(): PageContentResult<HomePageContent> {
  const { settings } = usePublicSettings();
  const isLoading = useSettingsLoading();
  const content = useMemo(() => selectHomePageContent(settings), [settings]);
  return { content, isLoading };
}

export function useAboutPageContent(): PageContentResult<AboutPageContent> {
  const { settings } = usePublicSettings();
  const isLoading = useSettingsLoading();
  const content = useMemo(() => selectAboutPageContent(settings), [settings]);
  return { content, isLoading };
}

export function useProcessPageContent(): PageContentResult<ProcessSectionContent> {
  const { settings } = usePublicSettings();
  const isLoading = useSettingsLoading();
  const content = useMemo(() => selectProcessSection(settings), [settings]);
  return { content, isLoading };
}

export function useContactPageContent(): PageContentResult<ContactPageContent> {
  const { settings } = usePublicSettings();
  const isLoading = useSettingsLoading();
  const content = useMemo(
    () => selectContactPageContent(settings),
    [settings],
  );
  return { content, isLoading };
}

export function useTestimonialsPageContent(): PageContentResult<TestimonialsPageContent> {
  const { settings } = usePublicSettings();
  const isLoading = useSettingsLoading();
  const content = useMemo(
    () => selectTestimonialsPageContent(settings),
    [settings],
  );
  return { content, isLoading };
}

export function useNewsletterContent(): PageContentResult<NewsletterContent> {
  const { settings } = usePublicSettings();
  const isLoading = useSettingsLoading();
  const content = useMemo(
    () => selectNewsletterContent(settings),
    [settings],
  );
  return { content, isLoading };
}

export function useFooterContent(): PageContentResult<FooterContent> {
  const { settings } = usePublicSettings();
  const isLoading = useSettingsLoading();
  const content = useMemo(() => selectFooterContent(settings), [settings]);
  return { content, isLoading };
}
