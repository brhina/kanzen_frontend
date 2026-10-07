import type { SettingEntity } from '../../domain/entities/setting.entity';
import { SettingField } from './SettingField';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/utils/cn';

export interface SettingGroupProps {
  title: string;
  description?: string;
  settings: SettingEntity[];
  values: Record<string, unknown>;
  onChange: (key: string, newValue: unknown) => void;
  className?: string;
}

export function SettingGroup({
  title,
  description,
  settings,
  values,
  onChange,
  className = '',
}: SettingGroupProps) {
  return (
    <Card className={cn('border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900', className)}>
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs text-slate-500">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {settings.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-6 italic">
            No configurations registered under this category.
          </p>
        ) : (
          <div className="space-y-3">
            {settings.map((setting) => (
              <SettingField
                key={setting.key}
                setting={setting}
                value={values[setting.key] !== undefined ? values[setting.key] : setting.value}
                onChange={onChange}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
