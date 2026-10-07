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
  isSaving?: boolean;
  className?: string;
}

export function SettingsForm({
  categoryTitle,
  categoryDescription,
  settings,
  onSave,
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
    setDirtyKeys((prev) => new Set(prev).add(key));
    setSaveSuccess(false);
  };

  const handleReset = () => {
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

    await onSave(updates);
    setDirtyKeys(new Set());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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
      />

      {/* Floating or bottom Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-xs">
          {isDirty ? (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              ● {dirtyKeys.size} unsaved change{dirtyKeys.size === 1 ? '' : 's'}
            </span>
          ) : saveSuccess ? (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ All configurations saved successfully
            </span>
          ) : (
            <span className="text-slate-400">
              All settings synchronized with production
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
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
            className="text-xs"
          >
            {isSaving ? 'Saving Configurations...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}
