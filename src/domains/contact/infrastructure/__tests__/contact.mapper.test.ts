import { describe, it, expect } from 'vitest';
import { ContactMapper } from '../contact.mapper';
import { ContactStatus } from '../../domain/enums/contact-status.enum';
import { ContactType } from '../../domain/enums/contact-type.enum';
import type { ContactResponseDto } from '../contact.dto';

describe('ContactMapper', () => {
  const mockDto: ContactResponseDto = {
    id: 'contact-001',
    name: 'Robert Hastings',
    email: 'robert.hastings@venturepulse.com',
    phone: '+1 212 555 9012',
    subject: 'Strategic Partnership Inquiry',
    message: 'Preferred engineering partner collaboration proposal.',
    type: ContactType.PARTNERSHIP,
    status: ContactStatus.READ,
    createdAt: '2026-10-01T12:00:00Z',
  };

  it('maps DTO to ContactEntity correctly', () => {
    const entity = ContactMapper.toEntity(mockDto);

    expect(entity.id).toBe('contact-001');
    expect(entity.name).toBe('Robert Hastings');
    expect(entity.email).toBe('robert.hastings@venturepulse.com');
    expect(entity.type).toBe(ContactType.PARTNERSHIP);
    expect(entity.status).toBe(ContactStatus.READ);
  });

  it('maps paginated list correctly', () => {
    const paginated = ContactMapper.toPaginated({
      data: [mockDto],
      meta: {
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    });

    expect(paginated.items.length).toBe(1);
    expect(paginated.total).toBe(1);
  });
});
