import { useState, useId } from 'react';
import type { SettingEntity } from '../../domain/entities/setting.entity';
import { SettingType } from '../../domain/enums/setting.enums';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Checkbox } from '@/shared/ui/checkbox';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/utils/cn';

export interface SettingFieldProps {
  setting: SettingEntity;
  value: unknown;
  onChange: (key: string, newValue: unknown) => void;
  onReset?: (key: string) => void;
  onDelete?: (key: string) => void;
  isDeleting?: boolean;
  canDelete?: boolean;
  className?: string;
}

export function SettingField({
  setting,
  value,
  onChange,
  onReset,
  onDelete,
  isDeleting = false,
  canDelete = false,
  className = '',
}: SettingFieldProps) {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const fieldId = useId();
  const type = (setting.type || SettingType.STRING).toLowerCase();

  // Compare current value with original setting value to detect dirty state
  const isDirty = (() => {
    if (type === SettingType.JSON) {
      try {
        return JSON.stringify(value) !== JSON.stringify(setting.value);
      } catch {
        return value !== setting.value;
      }
    }
    return value !== setting.value;
  })();

  const handleCopy = async () => {
    try {
      const textToCopy = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? '');
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write failed silently
    }
  };

  const handleJsonChange = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      setJsonError(null);
      onChange(setting.key, parsed);
    } catch {
      setJsonError('Malformed JSON syntax. Please verify commas and quotes.');
    }
  };

  const formatJson = () => {
    try {
      const currentObj = typeof value === 'object' && value !== null ? value : JSON.parse(String(value || '{}'));
      const prettified = JSON.stringify(currentObj, null, 2);
      onChange(setting.key, JSON.parse(prettified));
      setJsonError(null);
    } catch {
      setJsonError('Cannot format invalid JSON');
    }
  };

  const isLongText =
    type === SettingType.STRING &&
    typeof value === 'string' &&
    (value.length > 80 || value.includes('\n'));

  return (
    <div
      className={cn(
        'group relative rounded-2xl border transition-all duration-200 p-4 sm:p-5',
        isDirty
          ? 'border-brand-500/50 bg-brand-50/20 dark:border-brand-500/40 dark:bg-brand-950/10'
          : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700',
        className,
      )}
    >
      {/* Field Meta Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={fieldId}
              className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight cursor-pointer"
            >
              {setting.label || setting.key}
            </label>

            <Badge
              variant="neutral"
              styleVariant="outline"
              size="sm"
              className="font-mono text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50"
            >
              {type}
            </Badge>

            {setting.isPublic ? (
              <Badge
                variant="brand"
                size="sm"
                className="text-[10px]"
              >
                Public API
              </Badge>
            ) : (
              <Badge
                variant="neutral"
                size="sm"
                className="text-[10px] text-slate-500 dark:text-slate-400"
              >
                Protected
              </Badge>
            )}

            {isDirty && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                Modified
              </span>
            )}
          </div>

          {setting.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              {setting.description}
            </p>
          )}
        </div>

        {/* Action Controls & Key Pill */}
        <div className="flex items-center gap-2 self-start shrink-0">
          <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {setting.key}
          </code>

          {isDirty && onReset && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onReset(setting.key)}
              title="Reset to saved value"
              className="h-7 px-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Reset
            </Button>
          )}

          {canDelete && onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              onClick={() => onDelete(setting.key)}
              title="Delete custom setting"
              className="h-7 px-2 text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Field Input Control Area */}
      <div className="mt-3.5">
        {/* Boolean Type */}
        {type === SettingType.BOOLEAN && (
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {value ? 'Status: Active / Enabled' : 'Status: Inactive / Disabled'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Toggle this flag to turn the operational feature on or off in production.
              </p>
            </div>
            <Checkbox
              id={fieldId}
              checked={Boolean(value)}
              onChange={(e) => onChange(setting.key, e.target.checked)}
              label={value ? 'Enabled' : 'Disabled'}
            />
          </div>
        )}

        {/* Number Type */}
        {type === SettingType.NUMBER && (
          <div className="max-w-md">
            <Input
              id={fieldId}
              type="number"
              value={value !== undefined && value !== null ? String(value) : ''}
              onChange={(e) => {
                const parsed = e.target.value === '' ? '' : parseFloat(e.target.value);
                onChange(setting.key, isNaN(parsed as number) ? 0 : parsed);
              }}
              placeholder="0"
              className="font-mono text-sm"
              helperText={`Numeric constant registered under "${setting.group}" group.`}
            />
          </div>
        )}

        {/* Secret Type */}
        {type === SettingType.SECRET && (
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id={fieldId}
                  type={showSecret ? 'text' : 'password'}
                  value={typeof value === 'string' ? value : ''}
                  onChange={(e) => onChange(setting.key, e.target.value)}
                  placeholder="••••••••••••••••"
                  className="font-mono text-sm pr-10"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSecret((prev) => !prev)}
                className="shrink-0 h-10 px-3 text-xs"
                title={showSecret ? 'Hide secret value' : 'Reveal secret value'}
              >
                {showSecret ? 'Hide' : 'Reveal'}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="shrink-0 h-10 px-3 text-xs"
                title="Copy to clipboard"
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Encrypted at rest and masked in public responses.
            </p>
          </div>
        )}

        {/* JSON Type */}
        {type === SettingType.JSON && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                Structured JSON Document
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={formatJson}
                className="h-6 px-2 text-[11px]"
              >
                Prettify JSON
              </Button>
            </div>

            <Textarea
              id={fieldId}
              rows={5}
              value={
                typeof value === 'object' && value !== null
                  ? JSON.stringify(value, null, 2)
                  : String(value ?? '{}')
              }
              onChange={(e) => handleJsonChange(e.target.value)}
              className="font-mono text-xs leading-relaxed"
              error={jsonError || undefined}
              placeholder="{\n  &quot;key&quot;: &quot;value&quot;\n}"
            />
          </div>
        )}

        {/* String Type (multi-line or single-line) */}
        {type !== SettingType.BOOLEAN &&
          type !== SettingType.NUMBER &&
          type !== SettingType.SECRET &&
          type !== SettingType.JSON && (
            <div>
              {isLongText ? (
                <Textarea
                  id={fieldId}
                  rows={3}
                  value={typeof value === 'string' ? value : String(value ?? '')}
                  onChange={(e) => onChange(setting.key, e.target.value)}
                  placeholder={`Enter ${setting.label || setting.key}...`}
                  className="text-sm"
                />
              ) : (
                <Input
                  id={fieldId}
                  type="text"
                  value={typeof value === 'string' ? value : String(value ?? '')}
                  onChange={(e) => onChange(setting.key, e.target.value)}
                  placeholder={`Enter ${setting.label || setting.key}...`}
                  className="text-sm"
                />
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default SettingField;
