import { useState, useMemo } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { SettingGroupEnum } from '../../domain/enums/setting.enums';
import type { SettingEntity } from '../../domain/entities/setting.entity';
import type { CreateSettingDto } from '../../infrastructure/settings.dto';
import { useSettings } from '../../application/use-cases/useSettings';
import { useBulkUpdateSettings } from '../../application/use-cases/useBulkUpdateSettings';
import { useSettingsDefaults } from '../../application/use-cases/useSettingsDefaults';
import { useCreateSetting } from '../../application/use-cases/useCreateSetting';
import { useDeleteSetting } from '../../application/use-cases/useDeleteSetting';
import { SettingsForm } from '../components/SettingsForm';
import { CreateSettingForm } from '../components/CreateSettingForm';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner/Spinner';
import { Tabs, type TabItem } from '@/shared/ui/tabs';
import { HeaderBanner } from '@/layouts/components';
import { AlertTriangle } from 'lucide-react';

interface SettingTabMeta {
  key: string;
  label: string;
  title: string;
  description: string;
}

const SETTINGS_TABS: SettingTabMeta[] = [
  {
    key: 'all',
    label: 'All Settings',
    title: 'Complete System Configuration Registry',
    description: 'Unified operational parameters, environmental variables, and runtime credentials across all subsystems.',
  },
  {
    key: SettingGroupEnum.COMPANY,
    label: 'Company & Brand',
    title: 'Platform Brand & Corporate Identity',
    description: 'Core brand identity, business entity details, legal company designations, and official trademark metadata.',
  },
  {
    key: SettingGroupEnum.SEO,
    label: 'SEO & Metadata',
    title: 'Search Engine Optimization & Indexing',
    description: 'Default title templates, meta description summaries, canonical URLs, and crawler indexing rules.',
  },
  {
    key: SettingGroupEnum.SOCIAL,
    label: 'Social Profiles',
    title: 'Corporate Social Profiles & Communities',
    description: 'Public profile handles for LinkedIn, GitHub, X (Twitter), and developer community hubs.',
  },
  {
    key: SettingGroupEnum.CONTACT,
    label: 'Contact Coordinates',
    title: 'Physical & Digital Communications Channels',
    description: 'Inquiry routing addresses, corporate telephone lines, office locations, and operational hours.',
  },
  {
    key: SettingGroupEnum.PAGES,
    label: 'Pages & Content',
    title: 'Marketing Page Content & Copy',
    description: 'Hero, about, process, testimonials, newsletter, and footer copy rendered by public pages — every value here is served live to the website.',
  },
  {
    key: SettingGroupEnum.EMAIL,
    label: 'Email & SMTP',
    title: 'Transactional Mail & SMTP Transport',
    description: 'Dispatch servers, DKIM credentials, outbound sender addresses, port definitions, and relays.',
  },
  {
    key: SettingGroupEnum.INTEGRATIONS,
    label: 'Integrations & APIs',
    title: 'Third-Party Services & Webhook Endpoints',
    description: 'Telemetry trackers, payment gate keys, cloud storage endpoints, and CDN webhooks.',
  },
  {
    key: SettingGroupEnum.SYSTEM,
    label: 'System & Flags',
    title: 'Operational Governance & Runtime Flags',
    description: 'Maintenance mode toggles, rate limits, access guards, caching parameters, and debugging flags.',
  },
];

export function SettingsPage() {
  const { user } = useAuthStore();

  const canWrite =
    user?.isAdmin ||
    (Array.isArray(user?.permissions) && user.permissions.includes('settings:write'));

  // Grouping & View State
  const [activeTabKey, setActiveTabKey] = useState<string>('all');

  // Drawer & Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [settingToDelete, setSettingToDelete] = useState<SettingEntity | null>(null);

  // Queries & Mutations
  const { data: dbSettings, isLoading, isRefetching, refetch } = useSettings();
  const { data: settingDefaults } = useSettingsDefaults();
  const createMutation = useCreateSetting();
  const bulkMutation = useBulkUpdateSettings();
  const deleteMutation = useDeleteSetting();

  // Seeded default values keyed by setting key (for per-field restore)
  const defaultValues = useMemo(() => {
    const map: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(settingDefaults || {})) {
      map[key] = item.value;
    }
    return map;
  }, [settingDefaults]);

  // Selected tab meta
  const activeTab = useMemo(
    () => SETTINGS_TABS.find((t) => t.key === activeTabKey) || SETTINGS_TABS[0],
    [activeTabKey],
  );

  // Live database settings from backend API
  const allSettings = useMemo(() => {
    return dbSettings || [];
  }, [dbSettings]);

  // Horizontal classification tabs with per-group counts
  const classificationTabs = useMemo<TabItem[]>(
    () =>
      SETTINGS_TABS.map((tab) => ({
        id: tab.key,
        label: tab.label,
        count:
          tab.key === 'all'
            ? allSettings.length
            : allSettings.filter(
                (s) => (s.group || '').toLowerCase() === tab.key.toLowerCase(),
              ).length,
      })),
    [allSettings],
  );

  // Grouped settings for the active tab
  const filteredSettings = useMemo(() => {
    if (activeTabKey === 'all') return allSettings;
    return allSettings.filter(
      (setting) => (setting.group || '').toLowerCase() === activeTabKey.toLowerCase(),
    );
  }, [allSettings, activeTabKey]);

  const handleSave = async (updates: Record<string, unknown>) => {
    const items = Object.entries(updates).map(([key, value]) => ({
      key,
      value,
    }));
    await bulkMutation.mutateAsync({ items });
    refetch();
  };

  const handleCreateSetting = async (dto: CreateSettingDto) => {
    await createMutation.mutateAsync(dto);
    setIsDrawerOpen(false);
    refetch();
  };

  const handleConfirmDelete = async () => {
    if (!settingToDelete) return;
    await deleteMutation.mutateAsync(settingToDelete.key);
    setSettingToDelete(null);
    refetch();
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <HeaderBanner
        badge="Operational Administration & System Configuration"
        title="System Settings & Configurations"
        description="Manage global website constants, search engine optimization indexes, social media coordinates, transactional mail relays, and secure third-party credentials."
      />

      {/* Classification Tabs & Actions */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar">
          <Tabs
            tabs={classificationTabs}
            activeTab={activeTabKey}
            onChange={setActiveTabKey}
            variant="pills"
            className="inline-flex"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="text-xs"
          >
            {isLoading || isRefetching ? 'Reloading...' : 'Reload Settings'}
          </Button>
          {canWrite ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsDrawerOpen(true)}
              className="shrink-0"
            >
              Add Configuration
            </Button>
          ) : undefined}
        </div>
      </div>

      {/* Main Form Body */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-400 space-y-3">
          <Spinner size="lg" className="mx-auto" />
          <p>Loading application configurations...</p>
        </div>
      ) : (
        <SettingsForm
          activeCategory={activeTab.key}
          categoryTitle={activeTab.title}
          categoryDescription={activeTab.description}
          settings={filteredSettings}
          defaults={defaultValues}
          onSave={handleSave}
          onDelete={canWrite ? (key) => {
            const found = allSettings.find((s) => s.key === key);
            if (found) setSettingToDelete(found);
          } : undefined}
          canDelete={canWrite}
          onAddNew={canWrite ? () => setIsDrawerOpen(true) : undefined}
          isSaving={bulkMutation.isPending}
        />
      )}

      {/* Add Configuration Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Add Configuration Parameter"
        description="Register a new system setting, environment secret, or metadata key."
        size="lg"
      >
        <CreateSettingForm
          initialGroup={activeTabKey !== 'all' ? activeTabKey : SettingGroupEnum.COMPANY}
          onSubmit={handleCreateSetting}
          onCancel={() => setIsDrawerOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(settingToDelete)}
        onClose={() => setSettingToDelete(null)}
        title="Delete Configuration Parameter"
        description="Are you sure you want to delete this setting?"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSettingToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete Parameter
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/30 text-xs text-red-800 dark:text-red-300">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <div className="space-y-1">
              <p className="font-semibold">Permanent Deletion Warning</p>
              <p className="leading-relaxed">
                Deleting configuration key{' '}
                <code className="font-mono font-bold">{settingToDelete?.key}</code>{' '}
                will remove it from production and purge it from cache. Services relying on this key will revert to code-level defaults.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 text-xs space-y-1 bg-slate-50 dark:bg-slate-850">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Label:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{settingToDelete?.label}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Group:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{settingToDelete?.group}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Type:</span>
              <span className="font-mono uppercase text-slate-800 dark:text-slate-200">{settingToDelete?.type}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SettingsPage;
export { SettingsPage as Component };
