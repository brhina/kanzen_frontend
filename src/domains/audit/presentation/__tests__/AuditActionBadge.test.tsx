import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AuditActionBadge } from '../components/AuditActionBadge';

describe('AuditActionBadge', () => {
  it('renders creation actions with brand badge styling', () => {
    const html = renderToStaticMarkup(<AuditActionBadge action="article.create" />);

    expect(html).toContain('article.create');
    expect(html).toContain('brand');
  });

  it('renders delete actions with brand badge styling', () => {
    const html = renderToStaticMarkup(<AuditActionBadge action="user.delete" />);

    expect(html).toContain('user.delete');
    expect(html).toContain('brand');
  });

  it('renders update actions with brand badge styling', () => {
    const html = renderToStaticMarkup(<AuditActionBadge action="setting.update" />);

    expect(html).toContain('setting.update');
    expect(html).toContain('brand');
  });

  it('renders auth actions with brand styling', () => {
    const html = renderToStaticMarkup(<AuditActionBadge action="auth.login" />);

    expect(html).toContain('auth.login');
    expect(html).toContain('brand');
  });
});
