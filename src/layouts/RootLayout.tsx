import { Outlet, ScrollRestoration } from 'react-router';

/**
 * Universal Root Layout Shell.
 * Integrates React Router's ScrollRestoration at the top-level boundary
 * to ensure that navigating or routing across any pages starts from the top,
 * while maintaining proper scroll restoration on back/forward history actions.
 */
export function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

export default RootLayout;
