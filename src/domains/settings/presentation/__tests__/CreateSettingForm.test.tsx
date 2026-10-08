import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { CreateSettingForm } from '../components/CreateSettingForm';
import { SettingGroupEnum } from '../../domain/enums/setting.enums';

describe('CreateSettingForm', () => {
  it('renders form with required inputs and group selection', () => {
    const html = renderToStaticMarkup(
      <CreateSettingForm
        initialGroup={SettingGroupEnum.COMPANY}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(html).toContain('Setting Group');
    expect(html).toContain('Data Type');
    expect(html).toContain('Setting Key (dot-notated)');
    expect(html).toContain('Display Label');
    expect(html).toContain('Initial Value');
    expect(html).toContain('Expose via Public API');
    expect(html).toContain('Create Configuration');
    expect(html).toContain('Cancel');
  });

  it('populates initialGroup as default value', () => {
    const html = renderToStaticMarkup(
      <CreateSettingForm
        initialGroup={SettingGroupEnum.SEO}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(html).toContain('seo.');
  });
});
