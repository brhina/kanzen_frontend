import { useState } from 'react';
import { useUIStore } from '@/core/stores/ui.store';
import { SettingGroupEnum, SettingType } from '../../domain/enums/setting.enums';
import type { SettingEntity } from '../../domain/entities/setting.entity';
import { useSettings } from '../../application/use-cases/useSettings';
import { useUpdateSetting } from '../../application/use-cases/useUpdateSetting';
import { SettingsForm } from '../components/SettingsForm';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

const SETTINGS_TABS = [
  {
    key: SettingGroupEnum.GENERAL,
    label: 'General',
    title: 'Platform Brand & Operational Settings',
    description: 'Core brand identity, business entity details, contact coordinates, and global maintenance toggles.',
  },
  {
    key: SettingGroupEnum.SEO,
    label: 'SEO Defaults',
    title: 'Search Engine Optimization & Metadata',
    description: 'Default title templates, description summaries, canonical URLs, and OpenGraph social preview assets.',
  },
  {
    key: SettingGroupEnum.SOCIAL,
    label: 'Social Links',
    title: 'Corporate Social Profiles',
    description: 'Public profile handles for LinkedIn, GitHub, X (Twitter), and developer community hubs.',
  },
  {
    key: SettingGroupEnum.EMAIL,
    label: 'Email & SMTP',
    title: 'Transactional Mail & SMTP Transport',
    description: 'Dispatch servers, DKIM credentials, outbound sender addresses, and notification relays.',
  },
  {
    key: SettingGroupEnum.INTEGRATIONS,
    label: 'Integrations',
    title: 'Third-Party Services & Webhooks',
    description: 'Telemetry trackers, payment gate keys, cloud storage endpoints, and CDN webhooks.',
  },
];

// Fallback seed definitions if database has not yet been populated
const DEFAULT_PRESET_SETTINGS: SettingEntity[] = [
  {
    id: 's1',
    key: 'company.name',
    value: 'Kanzen Tech',
    type: SettingType.STRING,
    group: SettingGroupEnum.GENERAL,
    label: 'Organization Name',
    description: 'Official corporate legal name',
    isPublic: true,
  },
  {
    id: 's2',
    key: 'company.tagline',
    value: 'Engineering Digital Mastery',
    type: SettingType.STRING,
    group: SettingGroupEnum.GENERAL,
    label: 'Brand Tagline',
    description: 'Public headline displayed across visitor headers',
    isPublic: true,
  },
  {
    id: 's3',
    key: 'system.maintenanceMode',
    value: false,
    type: SettingType.BOOLEAN,
    group: SettingGroupEnum.GENERAL,
    label: 'Maintenance Mode',
    description: 'When enabled, public visitors are served an upgrade maintenance splash screen',
    isPublic: false,
  },
  {
    id: 's4',
    key: 'seo.defaultTitle',
    value: 'Kanzen Tech | Premium Product Engineering',
    type: SettingType.STRING,
    group: SettingGroupEnum.SEO,
    label: 'Default Title Template',
    description: 'Fallback browser document title',
    isPublic: true,
  },
  {
    id: 's5',
    key: 'seo.metaDescription',
    value: 'High-performance digital products, scalable cloud backends, and bespoke enterprise applications.',
    type: SettingType.STRING,
    group: SettingGroupEnum.SEO,
    label: 'Default Meta Description',
    description: 'Default search engine crawler index snippet',
    isPublic: true,
  },
  {
    id: 's6',
    key: 'seo.robotsIndex',
    value: true,
    type: SettingType.BOOLEAN,
    group: SettingGroupEnum.SEO,
    label: 'Allow Search Engine Indexing',
    description: 'Sets robots.txt directive to index, follow',
    isPublic: true,
  },
  {
    id: 's7',
    key: 'social.github',
    value: 'https://github.com/kanzen-tech',
    type: SettingType.STRING,
    group: SettingGroupEnum.SOCIAL,
    label: 'GitHub Organization URL',
    description: 'Public open-source repository link',
    isPublic: true,
  },
  {
    id: 's8',
    key: 'social.linkedin',
    value: 'https://linkedin.com/company/kanzen-tech',
    type: SettingType.STRING,
    group: SettingGroupEnum.SOCIAL,
    label: 'LinkedIn Profile URL',
    description: 'Corporate talent and showcase page',
    isPublic: true,
  },
  {
    id: 's9',
    key: 'mail.fromAddress',
    value: 'noreply@kanzen.tech',
    type: SettingType.STRING,
    group: SettingGroupEnum.EMAIL,
    label: 'Outbound From Address',
    description: 'Default sender header for automated transactional dispatches',
    isPublic: false,
  },
  {
    id: 's10',
    key: 'mail.smtpHost',
    value: 'smtp.mailgun.org',
    type: SettingType.STRING,
    group: SettingGroupEnum.EMAIL,
    label: 'SMTP Relay Host',
    description: 'Outbound relay hostname',
    isPublic: false,
  },
  {
    id: 's11',
    key: 'mail.smtpPassword',
    value: 'smtp-secret-masked',
    type: SettingType.SECRET,
    group: SettingGroupEnum.EMAIL,
    label: 'SMTP Secret / API Key',
    description: 'Secured authentication credential',
    isPublic: false,
  },
  {
    id: 's12',
    key: 'analytics.measurementId',
    value: 'G-KANZEN7890',
    type: SettingType.STRING,
    group: SettingGroupEnum.INTEGRATIONS,
    label: 'Telemetry Measurement Key',
    description: 'Client-side telemetry ID for clickstream tracking',
    isPublic: true,
  },
];

export function SettingsPage() {
  const { isEditMode } = useUIStore();

  const [activeTabKey, setActiveTabKey] = useState<string>(SettingGroupEnum.GENERAL);

  const { data: dbSettings, isLoading, refetch } = useSettings();
  const updateMutation = useUpdateSetting();

  const activeTab = SETTINGS_TABS.find((t) => t.key === activeTabKey) || SETTINGS_TABS[0];

  // Merge database settings with presets
  const allSettings = dbSettings && dbSettings.length > 0 ? dbSettings : DEFAULT_PRESET_SETTINGS;
  const filteredSettings = allSettings.filter(
    (s) => (s.group || '').toLowerCase() === activeTabKey.toLowerCase(),
  );

  const handleSave = async (updates: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(updates)) {
      await updateMutation.mutateAsync({
        key,
        dto: { value },
      });
    }
    refetch();
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              System Settings & Configurations
            </h1>
            <Badge variant="brand" size="sm">
              Operational
            </Badge>
            {isEditMode && (
              <Badge variant="warning" size="sm">
                Edit Mode
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure global website constants, SEO indexes, social media coordinates, and transactional mail relays.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs"
          >
            Reload Settings
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3 dark:border-slate-800">
        {SETTINGS_TABS.map((tab) => {
          const isActive = activeTabKey === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTabKey(tab.key)}
              className={cn(
                'rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer',
                isActive
                  ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Form Body */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Loading system settings...
        </div>
      ) : (
        <SettingsForm
          activeCategory={activeTab.key}
          categoryTitle={activeTab.title}
          categoryDescription={activeTab.description}
          settings={filteredSettings}
          onSave={handleSave}
          isSaving={updateMutation.isPending}
        />
      )}
    </div>
  );
}

export default SettingsPage;
export { SettingsPage as Component };
