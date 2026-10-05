import type { SeoMeta } from '../../domain/value-objects/seo-meta.vo';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

export interface SeoMetaFormProps {
  value?: SeoMeta;
  onChange: (seo: SeoMeta) => void;
}

export function SeoMetaForm({ value = {}, onChange }: SeoMetaFormProps) {
  const handleChange = (field: keyof SeoMeta, val: unknown) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Search Engine Optimization (SEO)
      </h4>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Meta Title
          </label>
          <Input
            value={value.metaTitle || ''}
            onChange={(e) => handleChange('metaTitle', e.target.value)}
            placeholder="Custom title tag for search engines..."
            className="text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Meta Description
          </label>
          <Textarea
            value={value.metaDescription || ''}
            onChange={(e) => handleChange('metaDescription', e.target.value)}
            placeholder="Brief summary shown in Google search results (150-160 chars recommended)..."
            rows={2}
            className="text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Keywords (comma separated)
          </label>
          <Input
            value={(value.keywords || []).join(', ')}
            onChange={(e) =>
              handleChange(
                'keywords',
                e.target.value
                  .split(',')
                  .map((k) => k.trim())
                  .filter(Boolean),
              )
            }
            placeholder="microservices, architecture, scaling"
            className="text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Canonical URL
            </label>
            <Input
              value={value.canonicalUrl || ''}
              onChange={(e) => handleChange('canonicalUrl', e.target.value)}
              placeholder="https://kanzen.tech/blog/..."
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Open Graph Image URL
            </label>
            <Input
              value={value.ogImage || ''}
              onChange={(e) => handleChange('ogImage', e.target.value)}
              placeholder="https://cdn.kanzen.tech/og/..."
              className="text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeoMetaForm;
