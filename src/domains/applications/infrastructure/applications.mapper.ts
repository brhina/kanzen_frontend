import { JobApplicationEntity } from '../domain/entities/job-application.entity';
import type { JobApplicationDto } from './applications.dto';

export class ApplicationsMapper {
  static toEntity(dto: JobApplicationDto): JobApplicationEntity {
    return new JobApplicationEntity({
      id: dto.id,
      jobId: dto.jobId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      linkedinUrl: dto.linkedinUrl,
      portfolioUrl: dto.portfolioUrl,
      githubUrl: dto.githubUrl,
      coverLetter: dto.coverLetter,
      resumeUrl: dto.resumeUrl,
      yearsOfExperience: dto.yearsOfExperience,
      currentCompany: dto.currentCompany,
      expectedSalary: dto.expectedSalary,
      noticePeriod: dto.noticePeriod,
      source: dto.source,
      referredBy: dto.referredBy,
      status: dto.status,
      rating: dto.rating,
      notes: dto.notes,
      interviewDate: dto.interviewDate ? new Date(dto.interviewDate) : null,
      rejectedAt: dto.rejectedAt ? new Date(dto.rejectedAt) : null,
      hiredAt: dto.hiredAt ? new Date(dto.hiredAt) : null,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    });
  }

  static toDto(entity: JobApplicationEntity): JobApplicationDto {
    return {
      id: entity.id ?? '',
      jobId: entity.jobId,
      firstName: entity.firstName,
      lastName: entity.lastName,
      fullName: entity.fullName,
      email: entity.email,
      phone: entity.phone,
      linkedinUrl: entity.linkedinUrl,
      portfolioUrl: entity.portfolioUrl,
      githubUrl: entity.githubUrl,
      coverLetter: entity.coverLetter,
      resumeUrl: entity.resumeUrl,
      yearsOfExperience: entity.yearsOfExperience,
      currentCompany: entity.currentCompany,
      expectedSalary: entity.expectedSalary,
      noticePeriod: entity.noticePeriod,
      source: entity.source,
      referredBy: entity.referredBy,
      status: entity.status,
      rating: entity.rating,
      notes: entity.notes,
      interviewDate: entity.interviewDate?.toISOString() ?? null,
      rejectedAt: entity.rejectedAt?.toISOString() ?? null,
      hiredAt: entity.hiredAt?.toISOString() ?? null,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }

  static toEntities(dtos: JobApplicationDto[]): JobApplicationEntity[] {
    return dtos.map((dto) => ApplicationsMapper.toEntity(dto));
  }
}
