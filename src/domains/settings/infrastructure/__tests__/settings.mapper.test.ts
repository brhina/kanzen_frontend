import { describe, it, expect } from 'vitest';
import { SettingsMapper } from '../settings.mapper';
import { SettingType } from '../../domain/enums/setting.enums';

describe('SettingsMapper', () => {
  it('maps SettingResponseDto to domain SettingEntity', () => {
    const dto = {
      id: 'sett-1',
      key: 'site_name',
      value: 'Kanzen Tech',
      type: SettingType.STRING,
      group: 'general',
      label: 'Site Name',
      description: 'The visible name of the company website',
      isPublic: true,
      updatedBy: 'admin-1',
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-04T12:00:00Z',
    };

    const entity = SettingsMapper.toDomain(dto);

    expect(entity.id).toBe('sett-1');
    expect(entity.key).toBe('site_name');
    expect(entity.value).toBe('Kanzen Tech');
    expect(entity.type).toBe(SettingType.STRING);
    expect(entity.group).toBe('general');
    expect(entity.label).toBe('Site Name');
    expect(entity.isPublic).toBe(true);
  });

  it('maps list of settings correctly', () => {
    const list = SettingsMapper.toDomainList([
      {
        id: 'sett-2',
        key: 'maintenance_mode',
        value: false,
        type: SettingType.BOOLEAN,
        group: 'system',
        label: 'Maintenance Mode',
        isPublic: false,
      },
    ]);

    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('sett-2');
    expect(list[0].value).toBe(false);
  });
});
