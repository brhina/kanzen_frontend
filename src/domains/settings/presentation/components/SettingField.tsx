import { useState } from 'react';
import type { SettingEntity } from '../../domain/entities/setting.entity';
import { SettingType } from '../../domain/enums/setting.enums';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

export interface SettingFieldProps {
  setting: SettingEntity;
  value: unknown;
  onChange: (key: string, newValue: unknown) => void;
  className?: string;
}

export function SettingField({
  setting,
  value,
  onChange,
  className = '',
}: SettingFieldProps) {
  const [showSecret, setShowSecret] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const type = setting.type || SettingType.STRING;

  const handleJsonChange = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      setJsonError(null);
      onChange(setting.key, parsed);
    } catch {
      setJsonError('Invalid JSON format');
    }
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-850/50',
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <label
              htmlFor={`setting-${setting.key}`}
              className="text-xs font-bold text-slate-800 dark:text-slate-100"
            >
              {setting.label || setting.key}
            </label>
            <Badge variant="neutral" styleVariant="outline" size="sm" className="font-mono text-[9px] uppercase">
              {type}
            </Badge>
            {setting.isPublic && (
              <Badge variant="neutral" size="sm" className="text-[9px]">
                Public
              </Badge>
            )}
          </div>
          {setting.description && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {setting.description}
            </p>
          )}
        </div>

        <span className="font-mono text-[10px] text-slate-400">
          {setting.key}
        </span>
      </div>

      <div className="mt-2">
        {/* Boolean toggle */}
        {type === SettingType.BOOLEAN && (
          <div className="flex items-center gap-3">
            <input
              id={`setting-${setting.key}`}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(setting.key, e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {value ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        )}

        {/* Number input */}
        {type === SettingType.NUMBER && (
          <input
            id={`setting-${setting.key}`}
            type="number"
            value={value !== undefined ? String(value) : ''}
            onChange={(e) => onChange(setting.key, parseFloat(e.target.value) || 0)}
            className="w-full sm:max-w-md rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
          />
        )}

        {/* Secret input */}
        {type === SettingType.SECRET && (
          <div className="flex items-center gap-2 sm:max-w-md">
            <input
              id={`setting-${setting.key}`}
              type={showSecret ? 'text' : 'password'}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => onChange(setting.key, e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSecret((p) => !p)}
              className="text-xs h-7 px-2"
            >
              {showSecret ? 'Hide' : 'Reveal'}
            </Button>
          </div>
        )}

        {/* JSON textarea */}
        {type === SettingType.JSON && (
          <div className="space-y-1">
            <textarea
              id={`setting-${setting.key}`}
              rows={4}
              defaultValue={
                typeof value === 'object'
                  ? JSON.stringify(value, null, 2)
                  : String(value || '{}')
              }
              onChange={(e) => handleJsonChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 leading-relaxed"
            />
            {jsonError && (
              <span className="text-[11px] text-rose-500 font-mono font-medium">
                {jsonError}
              </span>
            )}
          </div>
        )}

        {/* String (default) */}
        {type !== SettingType.BOOLEAN &&
          type !== SettingType.NUMBER &&
          type !== SettingType.SECRET &&
          type !== SettingType.JSON && (
            <input
              id={`setting-${setting.key}`}
              type="text"
              value={typeof value === 'string' ? value : String(value ?? '')}
              onChange={(e) => onChange(setting.key, e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          )}
      </div>
    </div>
  );
}
