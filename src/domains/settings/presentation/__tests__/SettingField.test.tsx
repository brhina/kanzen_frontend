import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SettingField } from '../components/SettingField';
import { SettingType, SettingGroupEnum } from '../../domain/enums/setting.enums';
import type { SettingEntity } from '../../domain/entities/setting.entity';

describe('SettingField', () => {
  const baseSetting: SettingEntity = {
    id: 's-1',
    key: 'company.name',
    value: 'Kanzen Tech',
    type: SettingType.STRING,
    group: SettingGroupEnum.COMPANY,
    label: 'Company Name',
    description: 'Official corporate legal name',
    isPublic: true,
  };

  it('renders string setting field correctly', () => {
    const html = renderToStaticMarkup(
      <SettingField
        setting={baseSetting}
        value="Kanzen Tech"
        onChange={vi.fn()}
      />,
    );

    expect(html).toContain('Company Name');
    expect(html).toContain('company.name');
    expect(html).toContain('string');
    expect(html).toContain('Public API');
    expect(html).toContain('Kanzen Tech');
  });

  it('renders boolean setting field with toggle label', () => {
    const boolSetting: SettingEntity = {
      id: 's-2',
      key: 'system.maintenanceMode',
      value: false,
      type: SettingType.BOOLEAN,
      group: SettingGroupEnum.SYSTEM,
      label: 'Maintenance Mode',
      isPublic: false,
    };

    const html = renderToStaticMarkup(
      <SettingField
        setting={boolSetting}
        value={false}
        onChange={vi.fn()}
      />,
    );

    expect(html).toContain('Maintenance Mode');
    expect(html).toContain('Protected');
    expect(html).toContain('boolean');
    expect(html).toContain('Status: Inactive / Disabled');
  });

  it('renders secret setting field with reveal and copy buttons', () => {
    const secretSetting: SettingEntity = {
      id: 's-3',
      key: 'mail.smtpPassword',
      value: 'secret123',
      type: SettingType.SECRET,
      group: SettingGroupEnum.EMAIL,
      label: 'SMTP Password',
      isPublic: false,
    };

    const html = renderToStaticMarkup(
      <SettingField
        setting={secretSetting}
        value="secret123"
        onChange={vi.fn()}
      />,
    );

    expect(html).toContain('SMTP Password');
    expect(html).toContain('secret');
    expect(html).toContain('Reveal');
    expect(html).toContain('Copy');
  });

  it('renders modified indicator when value differs from original', () => {
    const html = renderToStaticMarkup(
      <SettingField
        setting={baseSetting}
        value="Kanzen Digital Ltd"
        onChange={vi.fn()}
      />,
    );

    expect(html).toContain('Modified');
  });
});
