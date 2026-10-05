import { JobPostingEntity } from '../domain/entities/job-posting.entity';
import type { JobPostingDto } from './careers.dto';

export class CareersMapper {
  static toEntity(dto: JobPostingDto): JobPostingEntity {
    return new JobPostingEntity({
      id: dto.id,
      title: dto.title,
      slug: dto.slug,
      department: dto.department,
      type: dto.type,
      mode: dto.mode,
      location: dto.location,
      description: dto.description,
      requirements: Array.isArray(dto.requirements) ? [...dto.requirements] : [],
      niceToHave: Array.isArray(dto.niceToHave) ? [...dto.niceToHave] : [],
      benefits: Array.isArray(dto.benefits) ? [...dto.benefits] : [],
      salaryMin: dto.salaryMin,
      salaryMax: dto.salaryMax,
      salaryCurrency: dto.salaryCurrency ?? 'USD',
      experienceLevel: dto.experienceLevel,
      technologies: Array.isArray(dto.technologies) ? [...dto.technologies] : [],
      isUrgent: dto.isUrgent ?? false,
      closingDate: dto.closingDate ? new Date(dto.closingDate) : null,
      status: dto.status,
      applicationCount: dto.applicationCount ?? 0,
      seo: dto.seo,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    });
  }

  static toDto(entity: JobPostingEntity): JobPostingDto {
    return {
      id: entity.id ?? '',
      title: entity.title,
      slug: entity.slug,
      department: entity.department,
      type: entity.type,
      mode: entity.mode,
      location: entity.location,
      description: entity.description,
      requirements: [...entity.requirements],
      niceToHave: [...entity.niceToHave],
      benefits: [...entity.benefits],
      salaryMin: entity.salaryMin,
      salaryMax: entity.salaryMax,
      salaryCurrency: entity.salaryCurrency,
      experienceLevel: entity.experienceLevel,
      technologies: [...entity.technologies],
      isUrgent: entity.isUrgent,
      closingDate: entity.closingDate?.toISOString() ?? null,
      status: entity.status,
      applicationCount: entity.applicationCount,
      seo: entity.seo,
      publishedAt: entity.publishedAt?.toISOString() ?? null,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }

  static toEntities(dtos: JobPostingDto[]): JobPostingEntity[] {
    return dtos.map((dto) => CareersMapper.toEntity(dto));
  }
}
