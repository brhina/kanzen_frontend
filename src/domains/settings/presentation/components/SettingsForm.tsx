import { useState, useEffect } from 'react';
import type { SettingEntity } from '../../domain/entities/setting.entity';
import { SettingGroup } from './SettingGroup';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

export interface SettingsFormProps {
  activeCategory: string;
  categoryTitle: string;
  categoryDescription?: string;
  settings: SettingEntity[];
  onSave: (updates: Record<string, unknown>) => Promise<void>;
  onDelete?: (key: string) => void;
  canDelete?: boolean;
  onAddNew?: () => void;
  isSaving?: boolean;
  className?: string;
}

export function SettingsForm({
  categoryTitle,
  categoryDescription,
  settings,
  onSave,
  onDelete,
  canDelete = false,
  onAddNew,
  isSaving = false,
  className = '',
}: SettingsFormProps) {
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const initialMap: Record<string, unknown> = {};
    for (const s of settings) {
      initialMap[s.key] = s.value;
    }
    setFormValues(initialMap);
    setDirtyKeys(new Set());
    setSaveSuccess(false);
  }, [settings]);

  const handleFieldChange = (key: string, newValue: unknown) => {
    setFormValues((prev) => ({ ...prev, [key]: newValue }));

    const originalSetting = settings.find((s) => s.key === key);
    const isActuallyDifferent = (() => {
      if (!originalSetting) return true;
      if (typeof newValue === 'object') {
        try {
          return JSON.stringify(newValue) !== JSON.stringify(originalSetting.value);
        } catch {
          return newValue !== originalSetting.value;
        }
      }
      return newValue !== originalSetting.value;
    })();

    setDirtyKeys((prev) => {
      const next = new Set(prev);
      if (isActuallyDifferent) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });

    setSaveSuccess(false);
  };

  const handleSingleReset = (key: string) => {
    const originalSetting = settings.find((s) => s.key === key);
    if (!originalSetting) return;

    setFormValues((prev) => ({ ...prev, [key]: originalSetting.value }));
    setDirtyKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleResetAll = () => {
    const initialMap: Record<string, unknown> = {};
    for (const s of settings) {
      initialMap[s.key] = s.value;
    }
    setFormValues(initialMap);
    setDirtyKeys(new Set());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dirtyKeys.size === 0) return;

    const updates: Record<string, unknown> = {};
    dirtyKeys.forEach((k) => {
      updates[k] = formValues[k];
    });

    try {
      await onSave(updates);
      setDirtyKeys(new Set());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch {
      // Handled in parent / query mutation
    }
  };

  const isDirty = dirtyKeys.size > 0;

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <SettingGroup
        title={categoryTitle}
        description={categoryDescription}
        settings={settings}
        values={formValues}
        onChange={handleFieldChange}
        onReset={handleSingleReset}
        onDelete={onDelete}
        canDelete={canDelete}
        onAddNew={onAddNew}
      />

      {/* Floating Sticky Action Bar */}
      <div
        className={cn(
          'sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 backdrop-blur-md transition-all duration-300',
          isDirty
            ? 'border-brand-500/40 bg-white/95 dark:border-brand-500/30 dark:bg-slate-900/95 ring-2 ring-brand-500/20'
            : 'border-slate-200/90 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90',
        )}
      >
        <div className="flex items-center gap-2.5 text-xs">
          {isDirty ? (
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span>
                {dirtyKeys.size} modified setting{dirtyKeys.size === 1 ? '' : 's'} awaiting deployment
              </span>
            </div>
          ) : saveSuccess ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>All changes saved and synchronized across services</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span>All configurations active and in sync</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetAll}
              disabled={isSaving}
              className="text-xs"
            >
              Discard Changes
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!isDirty || isSaving}
            isLoading={isSaving}
            className="text-xs"
          >
            {isSaving ? 'Saving Configurations...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default SettingsForm;
