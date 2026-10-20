import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { RootLayout } from '../RootLayout';
import { routes } from '@/app/router';

describe('RootLayout', () => {
  it('renders children with ScrollRestoration in data router without throwing', () => {
    const testRouter = createMemoryRouter([
      {
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <div data-testid="child-content">Home Content</div>,
          },
        ],
      },
    ]);

    const html = renderToStaticMarkup(<RouterProvider router={testRouter} />);

    expect(html).toContain('Home Content');
  });

  it('correctly mounts application routes with RootLayout as the top-level shell', () => {
    expect(routes).toHaveLength(1);
    expect(routes[0].element).toBeDefined();

    // The root route wraps all layouts (AppLayout, AuthLayout, NotFoundPage)
    const rootChildren = routes[0].children;
    expect(rootChildren).toBeDefined();
    expect(rootChildren?.length).toBeGreaterThanOrEqual(3);

    // Verify root children contain AppLayout and AuthLayout routes
    const paths = rootChildren?.map((c) => c.path);
    expect(paths).toContain('/');
    expect(paths).toContain('*');
  });
});
