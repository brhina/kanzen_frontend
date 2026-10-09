import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeToggle } from '../ThemeToggle';
import { useUIStore } from '@/core/stores/ui.store';

describe('ThemeToggle', () => {
  beforeEach(() => {
    useUIStore.setState({
      theme: 'system',
      resolvedTheme: 'light',
    });
  });

  it('renders dropdown trigger button with accessibility attributes', () => {
    const html = renderToStaticMarkup(<ThemeToggle variant="dropdown" />);

    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('Theme: SYSTEM');
    expect(html).toContain('Current theme: system');
  });

  it('renders segmented control with Light, Dark, and System options', () => {
    const html = renderToStaticMarkup(<ThemeToggle variant="segmented" />);

    expect(html).toContain('Theme mode selector');
    expect(html).toContain('Light');
    expect(html).toContain('Dark');
    expect(html).toContain('System');
  });

  it('indicates active theme in segmented mode', () => {
    useUIStore.setState({ theme: 'dark', resolvedTheme: 'dark' });
    const htmlDark = renderToStaticMarkup(<ThemeToggle variant="segmented" />);
    expect(htmlDark).toContain('aria-pressed="true"');

    useUIStore.setState({ theme: 'light', resolvedTheme: 'light' });
    const htmlLight = renderToStaticMarkup(<ThemeToggle variant="segmented" />);
    expect(htmlLight).toContain('aria-pressed="true"');
  });
});
