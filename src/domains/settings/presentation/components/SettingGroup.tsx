import type { SettingEntity } from '../../domain/entities/setting.entity';
import { SettingField } from './SettingField';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

export interface SettingGroupProps {
  title: string;
  description?: string;
  settings: SettingEntity[];
  values: Record<string, unknown>;
  onChange: (key: string, newValue: unknown) => void;
  onReset?: (key: string) => void;
  onDelete?: (key: string) => void;
  canDelete?: boolean;
  onAddNew?: () => void;
  className?: string;
}

export function SettingGroup({
  title,
  description,
  settings,
  values,
  onChange,
  onReset,
  onDelete,
  canDelete = false,
  onAddNew,
  className = '',
}: SettingGroupProps) {
  return (
    <Card className={cn('border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900', className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </CardTitle>
            <Badge variant="brand" styleVariant="outline" size="sm" className="text-xs">
              {settings.length} {settings.length === 1 ? 'parameter' : 'parameters'}
            </Badge>
          </div>
          {description && (
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </CardDescription>
          )}
        </div>

        {onAddNew && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddNew}
            className="text-xs shrink-0 self-start sm:self-auto"
          >
            Add Configuration
          </Button>
        )}
      </CardHeader>

      <CardContent className="pt-5">
        {settings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              No configurations found in this category
            </h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Create a custom configuration key or verify your search filters.
            </p>
            {onAddNew && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onAddNew}
                className="mt-4 text-xs"
              >
                Add Configuration
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            {settings.map((setting) => (
              <SettingField
                key={setting.key}
                setting={setting}
                value={values[setting.key] !== undefined ? values[setting.key] : setting.value}
                onChange={onChange}
                onReset={onReset}
                onDelete={onDelete}
                canDelete={canDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SettingGroup;
