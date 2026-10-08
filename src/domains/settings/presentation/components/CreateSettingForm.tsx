import { useState, type FormEvent } from 'react';
import { SettingGroupEnum, SettingType } from '../../domain/enums/setting.enums';
import type { CreateSettingDto } from '../../infrastructure/settings.dto';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import { Button } from '@/shared/ui/button';

export interface CreateSettingFormProps {
  initialGroup?: string;
  onSubmit: (dto: CreateSettingDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const GROUP_OPTIONS = [
  { value: SettingGroupEnum.COMPANY, label: 'Company & Brand' },
  { value: SettingGroupEnum.SEO, label: 'SEO Defaults & Metadata' },
  { value: SettingGroupEnum.SOCIAL, label: 'Corporate Social Links' },
  { value: SettingGroupEnum.CONTACT, label: 'Contact Coordinates' },
  { value: SettingGroupEnum.EMAIL, label: 'Email & SMTP Transport' },
  { value: SettingGroupEnum.INTEGRATIONS, label: 'Integrations & External APIs' },
  { value: SettingGroupEnum.SYSTEM, label: 'System & Platform Flags' },
];

const TYPE_OPTIONS = [
  { value: SettingType.STRING, label: 'String (Text / URL / Identifier)' },
  { value: SettingType.NUMBER, label: 'Number (Integer / Float / Counter)' },
  { value: SettingType.BOOLEAN, label: 'Boolean (Toggle / Flag)' },
  { value: SettingType.SECRET, label: 'Secret (Credential / Encrypted Token)' },
  { value: SettingType.JSON, label: 'JSON (Structured Object / Array)' },
];

export function CreateSettingForm({
  initialGroup,
  onSubmit,
  onCancel,
  isLoading = false,
}: CreateSettingFormProps) {
  const [key, setKey] = useState(initialGroup ? `${initialGroup}.` : '');
  const [label, setLabel] = useState('');
  const [group, setGroup] = useState(initialGroup || SettingGroupEnum.COMPANY);
  const [type, setType] = useState<SettingType>(SettingType.STRING);
  const [valueStr, setValueStr] = useState('');
  const [boolVal, setBoolVal] = useState(false);
  const [numVal, setNumVal] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGroupChange = (newGroup: string) => {
    setGroup(newGroup);
    // Auto-prefix key if empty or matches previous group prefix
    if (!key || key.includes('.')) {
      const suffix = key.includes('.') ? key.split('.').slice(1).join('.') : '';
      setKey(`${newGroup}.${suffix}`);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const cleanKey = key.trim();
    const cleanLabel = label.trim();

    if (!cleanKey) {
      newErrors.key = 'Setting key is required (e.g. company.vatNumber)';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(cleanKey)) {
      newErrors.key = 'Key can only contain alphanumeric characters, dots, dashes, and underscores';
    }

    if (!cleanLabel) {
      newErrors.label = 'Display label is required';
    }

    let parsedValue: unknown = valueStr;
    if (type === SettingType.BOOLEAN) {
      parsedValue = boolVal;
    } else if (type === SettingType.NUMBER) {
      parsedValue = numVal;
    } else if (type === SettingType.JSON) {
      try {
        parsedValue = JSON.parse(valueStr || '{}');
      } catch {
        newErrors.value = 'Invalid JSON syntax. Please verify commas and quotes.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      key: cleanKey,
      label: cleanLabel,
      group,
      type,
      value: parsedValue,
      description: description.trim() || undefined,
      isPublic,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Classification Group & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Setting Group <span className="text-red-500">*</span>
          </label>
          <Select
            value={group}
            onChange={(e) => handleGroupChange(e.target.value)}
            options={GROUP_OPTIONS}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Data Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as SettingType)}
            options={TYPE_OPTIONS}
          />
        </div>
      </div>

      {/* Key & Label */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Setting Key (dot-notated) <span className="text-red-500">*</span>
          </label>
          <Input
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              if (errors.key) setErrors((prev) => ({ ...prev, key: '' }));
            }}
            placeholder="e.g. company.registrationNumber"
            className="font-mono text-xs"
            error={errors.key}
            helperText="Unique machine identifier used by APIs and application code."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Display Label <span className="text-red-500">*</span>
          </label>
          <Input
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              if (errors.label) setErrors((prev) => ({ ...prev, label: '' }));
            }}
            placeholder="e.g. VAT Registration Number"
            error={errors.label}
            required
          />
        </div>
      </div>

      {/* Dynamic Initial Value Input */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Initial Value
        </label>

        {type === SettingType.BOOLEAN && (
          <div className="pt-1">
            <Checkbox
              id="create-bool-val"
              checked={boolVal}
              onChange={(e) => setBoolVal(e.target.checked)}
              label={boolVal ? 'Enabled (true)' : 'Disabled (false)'}
              description="Default boolean state for this configuration flag."
            />
          </div>
        )}

        {type === SettingType.NUMBER && (
          <Input
            type="number"
            value={numVal}
            onChange={(e) => setNumVal(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="font-mono text-sm max-w-xs"
            helperText="Initial numeric quantity or limit."
          />
        )}

        {type === SettingType.SECRET && (
          <Input
            type="password"
            value={valueStr}
            onChange={(e) => setValueStr(e.target.value)}
            placeholder="Enter private token or API secret key..."
            className="font-mono text-sm"
            helperText="Masked credential encrypted in backend persistence."
          />
        )}

        {type === SettingType.JSON && (
          <Textarea
            value={valueStr}
            onChange={(e) => {
              setValueStr(e.target.value);
              if (errors.value) setErrors((prev) => ({ ...prev, value: '' }));
            }}
            placeholder="{\n  &quot;endpoint&quot;: &quot;https://api.domain.com&quot;,\n  &quot;timeout&quot;: 5000\n}"
            rows={5}
            className="font-mono text-xs"
            error={errors.value}
            helperText="Valid JSON object or array notation."
          />
        )}

        {type === SettingType.STRING && (
          <Input
            value={valueStr}
            onChange={(e) => setValueStr(e.target.value)}
            placeholder="Enter configuration text value..."
          />
        )}
      </div>

      {/* Description & Public Exposure Toggle */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description &amp; Operational Notes (optional)
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain where this setting is utilized and what behavior it alters..."
            rows={2}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <Checkbox
            id="create-is-public"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            label="Expose via Public API (/settings/public)"
            description="When checked, client applications can retrieve this key-value pair without administrative authorization."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Create Configuration
        </Button>
      </div>
    </form>
  );
}

export default CreateSettingForm;
