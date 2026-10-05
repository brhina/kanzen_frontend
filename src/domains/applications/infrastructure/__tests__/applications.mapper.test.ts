import { describe, it, expect } from 'vitest';
import { ApplicationsMapper } from '../applications.mapper';
import { JobApplicationEntity } from '../../domain/entities/job-application.entity';
import type { JobApplicationDto } from '../applications.dto';

describe('ApplicationsMapper', () => {
  const mockDto: JobApplicationDto = {
    id: 'app-999',
    jobId: 'career-123',
    firstName: 'Linus',
    lastName: 'Torvalds',
    email: 'linus@example.com',
    phone: '+1555123456',
    linkedinUrl: 'https://linkedin.com/in/linus',
    githubUrl: 'https://github.com/torvalds',
    portfolioUrl: 'https://kernel.org',
    coverLetter: 'I wrote Linux and Git.',
    resumeUrl: 'https://storage.kanzen.tech/resumes/linus.pdf',
    yearsOfExperience: 25,
    currentCompany: 'Linux Foundation',
    expectedSalary: 15000,
    noticePeriod: 'Immediate',
    source: 'careers_portal',
    referredBy: 'Alan Turing',
    status: 'interview',
    rating: 5,
    notes: 'Exceptional systems architect candidate.',
    interviewDate: '2026-10-15T10:00:00.000Z',
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-02T08:00:00.000Z',
  };

  it('maps JobApplicationDto to JobApplicationEntity correctly', () => {
    const entity = ApplicationsMapper.toEntity(mockDto);

    expect(entity).toBeInstanceOf(JobApplicationEntity);
    expect(entity.id).toBe('app-999');
    expect(entity.jobId).toBe('career-123');
    expect(entity.firstName).toBe('Linus');
    expect(entity.lastName).toBe('Torvalds');
    expect(entity.fullName).toBe('Linus Torvalds');
    expect(entity.email).toBe('linus@example.com');
    expect(entity.yearsOfExperience).toBe(25);
    expect(entity.resumeUrl).toBe('https://storage.kanzen.tech/resumes/linus.pdf');
    expect(entity.status).toBe('interview');
    expect(entity.rating).toBe(5);
    expect(entity.interviewDate).toEqual(new Date('2026-10-15T10:00:00.000Z'));
  });

  it('tests entity helper getters accurately', () => {
    const entity = ApplicationsMapper.toEntity(mockDto);

    expect(entity.isInterviewing).toBe(true);
    expect(entity.isPendingReview).toBe(false);
    expect(entity.isHired).toBe(false);
  });

  it('maps JobApplicationEntity to JobApplicationDto correctly', () => {
    const entity = ApplicationsMapper.toEntity(mockDto);
    const dto = ApplicationsMapper.toDto(entity);

    expect(dto.id).toBe('app-999');
    expect(dto.jobId).toBe('career-123');
    expect(dto.firstName).toBe('Linus');
    expect(dto.lastName).toBe('Torvalds');
    expect(dto.email).toBe('linus@example.com');
    expect(dto.status).toBe('interview');
    expect(dto.rating).toBe(5);
    expect(dto.resumeUrl).toBe('https://storage.kanzen.tech/resumes/linus.pdf');
  });
});
