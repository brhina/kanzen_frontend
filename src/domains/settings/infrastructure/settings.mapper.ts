import type { SettingEntity } from '../domain/entities/setting.entity';
import type { SettingResponseDto } from './settings.dto';

export class SettingsMapper {
  static toDomain(dto: SettingResponseDto): SettingEntity {
    return {
      id: dto.id,
      key: dto.key,
      value: dto.value,
      type: dto.type as any,
      group: dto.group,
      label: dto.label,
      description: dto.description,
      isPublic: dto.isPublic,
      updatedBy: dto.updatedBy,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  static toDomainList(dtos: SettingResponseDto[]): SettingEntity[] {
    return (dtos || []).map((d) => SettingsMapper.toDomain(d));
  }
}
