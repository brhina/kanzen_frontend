import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/cache/query-client';
import { LoginPage } from '../pages/LoginPage';

describe('LoginPage', () => {
  it('renders console authentication form and inputs', () => {
    const html = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(html).toContain('Console Authentication');
    expect(html).toContain('Work Email');
    expect(html).toContain('Password');
    expect(html).toContain('Sign In to Console');
    expect(html).toContain('Forgot password?');
  });
});
