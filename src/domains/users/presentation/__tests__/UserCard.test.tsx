import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { UserCard } from '../components/UserCard';
import type { UserEntity } from '../../domain/entities/user.entity';

describe('UserCard', () => {
  const mockUser: UserEntity = {
    id: 'u-1',
    firstName: 'Marcus',
    lastName: 'Aurelius',
    fullName: 'Marcus Aurelius',
    email: 'marcus@kanzen.tech',
    isAdmin: true,
    permissions: [],
    status: 'active',
  };

  it('renders user full name, email, and Admin badge', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <UserCard user={mockUser} />
      </MemoryRouter>
    );

    expect(html).toContain('Marcus Aurelius');
    expect(html).toContain('marcus@kanzen.tech');
    expect(html).toContain('Admin');
    expect(html).toContain('Full System Authority');
  });

  it('renders capability count for non-admin users', () => {
    const regularUser: UserEntity = {
      ...mockUser,
      isAdmin: false,
      permissions: ['leads:read', 'leads:write'],
    };

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <UserCard user={regularUser} />
      </MemoryRouter>
    );

    expect(html).toContain('2 Assigned Capabilities');
  });
});
