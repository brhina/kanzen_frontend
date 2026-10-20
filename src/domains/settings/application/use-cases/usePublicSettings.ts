import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { settingsApi } from '../../infrastructure/settings.api';
import type {
  CompanySettings,
  ContactSettings,
  CompanyValueItem,
  ProcessStepItem,
  ProofPointItem,
  SeoSettings,
  SocialLinkItem,
} from '../../domain/settings-content.types';
import {
  detectSocialPlatform,
  interpolate,
  parseJsonSetting,
  selectCompany,
  selectCompanyValues,
  selectContact,
  selectProcessSteps,
  selectProofPoints,
  selectSeo,
  selectSocialLinks,
  type RawSettings,
} from './settings.selectors';

export type {
  CompanySettings,
  ContactSettings,
  CompanyValueItem,
  ProcessStepItem,
  ProofPointItem,
  SeoSettings,
  SocialLinkItem,
};
export { detectSocialPlatform, interpolate, parseJsonSetting };

/**
 * Core public settings query. Every public page reads from this single
 * cached request — the backend seeds and owns all rendered content.
 */
export function usePublicSettings() {
  const query = useQuery<Record<string, unknown>>({
    queryKey: queryKeys.settings.public(),
    queryFn: async () => {
      return settingsApi.getPublic();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const rawSettings = useMemo<RawSettings>(
    () => query.data || {},
    [query.data],
  );

  const company = useMemo(() => selectCompany(rawSettings), [rawSettings]);
  const seo = useMemo(() => selectSeo(rawSettings), [rawSettings]);
  const contact = useMemo(() => selectContact(rawSettings), [rawSettings]);
  const socialLinks = useMemo(
    () => selectSocialLinks(rawSettings),
    [rawSettings],
  );
  const proofPoints = useMemo(
    () => selectProofPoints(rawSettings),
    [rawSettings],
  );
  const values = useMemo(
    () => selectCompanyValues(rawSettings),
    [rawSettings],
  );
  const processSteps = useMemo(
    () => selectProcessSteps(rawSettings),
    [rawSettings],
  );

  const getSetting = useCallback(
    <T = unknown>(key: string, defaultValue?: T): T => {
      if (rawSettings[key] !== undefined && rawSettings[key] !== null) {
        return rawSettings[key] as T;
      }
      return defaultValue as T;
    },
    [rawSettings],
  );

  return {
    ...query,
    settings: rawSettings,
    company,
    seo,
    contact,
    socialLinks,
    proofPoints,
    values,
    processSteps,
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

export function useProofPoints(): ProofPointItem[] {
  const { proofPoints } = usePublicSettings();
  return proofPoints;
}

export function useCompanyValues(): CompanyValueItem[] {
  const { values } = usePublicSettings();
  return values;
}

export function useProcessSteps(): ProcessStepItem[] {
  const { processSteps } = usePublicSettings();
  return processSteps;
}

/** True while the public settings payload is being fetched for the first time. */
export function useSettingsLoading(): boolean {
  const { isPending, isFetching } = usePublicSettings();
  return isPending && isFetching;
}
