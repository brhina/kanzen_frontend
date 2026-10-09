import { useState, useMemo } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { SettingGroupEnum, SettingType } from '../../domain/enums/setting.enums';
import type { SettingEntity } from '../../domain/entities/setting.entity';
import type { CreateSettingDto } from '../../infrastructure/settings.dto';
import { useSettings } from '../../application/use-cases/useSettings';
import { useUpdateSetting } from '../../application/use-cases/useUpdateSetting';
import { useCreateSetting } from '../../application/use-cases/useCreateSetting';
import { useDeleteSetting } from '../../application/use-cases/useDeleteSetting';
import { SettingsForm } from '../components/SettingsForm';
import { CreateSettingForm } from '../components/CreateSettingForm';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner/Spinner';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';
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

// Fallback seed definitions matching backend DEFAULT_SETTINGS
const DEFAULT_PRESET_SETTINGS: SettingEntity[] = [
  {
    id: 's1',
    key: 'company.name',
    value: 'Kanzen Tech',
    type: SettingType.STRING,
    group: SettingGroupEnum.COMPANY,
    label: 'Company Name',
    description: 'Official corporate legal and brand name',
    isPublic: true,
  },
  {
    id: 's2',
    key: 'company.tagline',
    value: 'Engineering Digital Mastery',
    type: SettingType.STRING,
    group: SettingGroupEnum.COMPANY,
    label: 'Company Tagline',
    description: 'Primary corporate mission tagline displayed across visitor headers',
    isPublic: true,
  },
  {
    id: 's3',
    key: 'company.email',
    value: 'contact@kanzen.tech',
    type: SettingType.STRING,
    group: SettingGroupEnum.COMPANY,
    label: 'Primary Contact Email',
    description: 'General inquiry and communications email',
    isPublic: true,
  },
  {
    id: 's4',
    key: 'company.phone',
    value: '+254 700 000 000',
    type: SettingType.STRING,
    group: SettingGroupEnum.COMPANY,
    label: 'Primary Phone Number',
    description: 'Corporate telephone contact line',
    isPublic: true,
  },
  {
    id: 's5',
    key: 'company.address',
    value: 'Nairobi, Kenya',
    type: SettingType.STRING,
    group: SettingGroupEnum.COMPANY,
    label: 'Physical Address',
    description: 'Corporate headquarters location',
    isPublic: true,
  },
  {
    id: 's6',
    key: 'seo.defaultTitle',
    value: 'Kanzen Tech | Premium Product Engineering & SaaS Solutions',
    type: SettingType.STRING,
    group: SettingGroupEnum.SEO,
    label: 'Default SEO Title',
    description: 'Fallback browser title across web pages',
    isPublic: true,
  },
  {
    id: 's7',
    key: 'seo.defaultDescription',
    value:
      'Kanzen Tech engineers high-performance web systems, cloud architectures, and modern product experiences.',
    type: SettingType.STRING,
    group: SettingGroupEnum.SEO,
    label: 'Default SEO Meta Description',
    description: 'Fallback search engine summary snippet',
    isPublic: true,
  },
  {
    id: 's8',
    key: 'seo.robotsIndex',
    value: true,
    type: SettingType.BOOLEAN,
    group: SettingGroupEnum.SEO,
    label: 'Allow Search Engine Indexing',
    description: 'Directs search engines to index and follow links across published routes',
    isPublic: true,
  },
  {
    id: 's9',
    key: 'social.github',
    value: 'https://github.com/kanzen-tech',
    type: SettingType.STRING,
    group: SettingGroupEnum.SOCIAL,
    label: 'GitHub URL',
    description: 'Public open source profile',
    isPublic: true,
  },
  {
    id: 's10',
    key: 'social.linkedin',
    value: 'https://linkedin.com/company/kanzen-tech',
    type: SettingType.STRING,
    group: SettingGroupEnum.SOCIAL,
    label: 'LinkedIn Profile',
    description: 'Corporate LinkedIn presence',
    isPublic: true,
  },
  {
    id: 's11',
    key: 'social.twitter',
    value: 'https://twitter.com/kanzentech',
    type: SettingType.STRING,
    group: SettingGroupEnum.SOCIAL,
    label: 'X (Twitter) Profile',
    description: 'Corporate Twitter handle link',
    isPublic: true,
  },
  {
    id: 's12',
    key: 'contact.supportEmail',
    value: 'support@kanzen.tech',
    type: SettingType.STRING,
    group: SettingGroupEnum.CONTACT,
    label: 'Customer Support Email',
    description: 'Priority address for technical assistance and support tickets',
    isPublic: true,
  },
  {
    id: 's13',
    key: 'contact.businessHours',
    value: 'Mon - Fri, 08:00 - 18:00 EAT',
    type: SettingType.STRING,
    group: SettingGroupEnum.CONTACT,
    label: 'Standard Business Hours',
    description: 'Published operational schedule for client consultations',
    isPublic: true,
  },
  {
    id: 's14',
    key: 'mail.fromAddress',
    value: 'noreply@kanzen.tech',
    type: SettingType.STRING,
    group: SettingGroupEnum.EMAIL,
    label: 'Outbound Sender Address',
    description: 'Default sender header for transactional system emails',
    isPublic: false,
  },
  {
    id: 's15',
    key: 'mail.smtpHost',
    value: 'smtp.mailgun.org',
    type: SettingType.STRING,
    group: SettingGroupEnum.EMAIL,
    label: 'SMTP Relay Hostname',
    description: 'Host endpoint for outgoing SMTP transport',
    isPublic: false,
  },
  {
    id: 's16',
    key: 'mail.smtpPassword',
    value: 'smtp-secret-token-active',
    type: SettingType.SECRET,
    group: SettingGroupEnum.EMAIL,
    label: 'SMTP Password / API Key',
    description: 'Secured authentication credential for mail transport relay',
    isPublic: false,
  },
  {
    id: 's17',
    key: 'analytics.measurementId',
    value: 'G-KANZEN7890',
    type: SettingType.STRING,
    group: SettingGroupEnum.INTEGRATIONS,
    label: 'Google Analytics Measurement ID',
    description: 'Telemetry tracker key loaded on client-side views',
    isPublic: true,
  },
  {
    id: 's18',
    key: 'system.maintenanceMode',
    value: false,
    type: SettingType.BOOLEAN,
    group: SettingGroupEnum.SYSTEM,
    label: 'Global Maintenance Mode',
    description: 'When enabled, public visitors encounter a maintenance splash screen',
    isPublic: false,
  },
  {
    id: 's19',
    key: 'system.rateLimitPerMinute',
    value: 120,
    type: SettingType.NUMBER,
    group: SettingGroupEnum.SYSTEM,
    label: 'API Request Rate Limit',
    description: 'Maximum permitted HTTP requests per client IP per minute',
    isPublic: false,
  },
];

export function SettingsPage() {
  const { user } = useAuthStore();

  const canWrite =
    user?.isAdmin ||
    (Array.isArray(user?.permissions) && user.permissions.includes('settings:write'));

  // Filtering & View State
  const [activeTabKey, setActiveTabKey] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Drawer & Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [settingToDelete, setSettingToDelete] = useState<SettingEntity | null>(null);

  // Queries & Mutations
  const { data: dbSettings, isLoading, isRefetching, refetch } = useSettings();
  const createMutation = useCreateSetting();
  const updateMutation = useUpdateSetting();
  const deleteMutation = useDeleteSetting();

  // Selected tab meta
  const activeTab = useMemo(
    () => SETTINGS_TABS.find((t) => t.key === activeTabKey) || SETTINGS_TABS[0],
    [activeTabKey],
  );

  // Merge database settings with presets
  const allSettings = useMemo(() => {
    return dbSettings && dbSettings.length > 0 ? dbSettings : DEFAULT_PRESET_SETTINGS;
  }, [dbSettings]);

  // Filtered settings
  const filteredSettings = useMemo(() => {
    return allSettings.filter((setting) => {
      // Group filter
      if (activeTabKey !== 'all' && (setting.group || '').toLowerCase() !== activeTabKey.toLowerCase()) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesKey = setting.key.toLowerCase().includes(query);
        const matchesLabel = (setting.label || '').toLowerCase().includes(query);
        const matchesDesc = (setting.description || '').toLowerCase().includes(query);
        if (!matchesKey && !matchesLabel && !matchesDesc) {
          return false;
        }
      }

      // Type filter
      if (typeFilter !== 'all' && (setting.type || '').toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      // Visibility filter
      if (visibilityFilter === 'public' && !setting.isPublic) return false;
      if (visibilityFilter === 'protected' && setting.isPublic) return false;

      return true;
    });
  }, [allSettings, activeTabKey, searchQuery, typeFilter, visibilityFilter]);

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeTabKey !== 'all') count++;
    if (typeFilter !== 'all') count++;
    if (visibilityFilter !== 'all') count++;
    return count;
  }, [activeTabKey, typeFilter, visibilityFilter]);

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (searchQuery) {
      chips.push({
        id: 'search',
        label: `Search: "${searchQuery}"`,
        onRemove: () => setSearchQuery(''),
      });
    }
    if (activeTabKey !== 'all') {
      const tab = SETTINGS_TABS.find((t) => t.key === activeTabKey);
      chips.push({
        id: 'group',
        label: `Group: ${tab?.label || activeTabKey}`,
        onRemove: () => setActiveTabKey('all'),
      });
    }
    if (typeFilter !== 'all') {
      chips.push({
        id: 'type',
        label: `Type: ${typeFilter.toUpperCase()}`,
        onRemove: () => setTypeFilter('all'),
      });
    }
    if (visibilityFilter !== 'all') {
      chips.push({
        id: 'visibility',
        label: `Visibility: ${visibilityFilter === 'public' ? 'Public' : 'Protected'}`,
        onRemove: () => setVisibilityFilter('all'),
      });
    }
    return chips;
  }, [searchQuery, activeTabKey, typeFilter, visibilityFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveTabKey('all');
    setTypeFilter('all');
    setVisibilityFilter('all');
  };

  const handleSave = async (updates: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(updates)) {
      await updateMutation.mutateAsync({
        key,
        dto: { value },
      });
    }
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
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <span>Operational Administration &amp; System Configuration</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            System Settings &amp; Configurations
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed max-w-2xl mx-auto">
            Manage global website constants, search engine optimization indexes, social media coordinates, transactional mail relays, and secure third-party credentials.
          </p>
        </div>
      </div>

      {/* Unified Search & Advanced Filter Bar */}
      <SearchFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search configurations by key, label, or description..."
        isExpanded={isFilterExpanded}
        onToggleExpanded={setIsFilterExpanded}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={activeFilterCount > 0 || Boolean(searchQuery)}
        onReset={handleResetFilters}
        totalCount={allSettings.length}
        filteredCount={filteredSettings.length}
        resultsLabel="configuration parameters"
        activeChips={activeChips}
        actions={
          <>
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
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Classification Group */}
          <FilterGroup label="Classification Group" count={SETTINGS_TABS.length}>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SETTINGS_TABS.map((tab) => (
                <FilterPill
                  key={tab.key}
                  label={tab.label}
                  isSelected={activeTabKey === tab.key}
                  onClick={() => setActiveTabKey(tab.key)}
                />
              ))}
            </div>
          </FilterGroup>

          {/* Data Type Filter */}
          <FilterGroup label="Data Type">
            <FilterSelect
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Data Types' },
                { value: SettingType.STRING, label: 'String' },
                { value: SettingType.NUMBER, label: 'Number' },
                { value: SettingType.BOOLEAN, label: 'Boolean Flag' },
                { value: SettingType.SECRET, label: 'Encrypted Secret' },
                { value: SettingType.JSON, label: 'JSON Document' },
              ]}
            />
          </FilterGroup>

          {/* Visibility Filter */}
          <FilterGroup label="Access Visibility">
            <FilterSelect
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Visibilities' },
                { value: 'public', label: 'Public API Exposed' },
                { value: 'protected', label: 'Admin Protected Only' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>

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
          onSave={handleSave}
          onDelete={canWrite ? (key) => {
            const found = allSettings.find((s) => s.key === key);
            if (found) setSettingToDelete(found);
          } : undefined}
          canDelete={canWrite}
          onAddNew={canWrite ? () => setIsDrawerOpen(true) : undefined}
          isSaving={updateMutation.isPending}
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
