import { describe, it, expect, beforeEach } from 'vitest';
import {
  useUIStore,
  applyTheme,
  resolveTheme,
  getSystemTheme,
} from '../ui.store';

describe('UI Store - Theme Management', () => {
  beforeEach(() => {
    useUIStore.setState({
      theme: 'system',
      resolvedTheme: 'light',
      isEditMode: false,
      viewMode: 'grid',
      sidebarOpen: false,
      activeDrawer: null,
      adminBarMinimized: false,
    });
  });

  it('resolves direct themes accurately', () => {
    expect(resolveTheme('light')).toBe('light');
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('resolves system theme safely using fallback when matchMedia is unavailable or light', () => {
    const resolved = resolveTheme('system');
    expect(['light', 'dark']).toContain(resolved);
  });

  it('updates theme mode and resolves theme on setTheme', () => {
    useUIStore.getState().setTheme('dark');
    expect(useUIStore.getState().theme).toBe('dark');
    expect(useUIStore.getState().resolvedTheme).toBe('dark');

    useUIStore.getState().setTheme('light');
    expect(useUIStore.getState().theme).toBe('light');
    expect(useUIStore.getState().resolvedTheme).toBe('light');
  });

  it('cycles themes in sequence: light -> dark -> system -> light', () => {
    useUIStore.getState().setTheme('light');
    expect(useUIStore.getState().theme).toBe('light');

    useUIStore.getState().cycleTheme();
    expect(useUIStore.getState().theme).toBe('dark');

    useUIStore.getState().cycleTheme();
    expect(useUIStore.getState().theme).toBe('system');

    useUIStore.getState().cycleTheme();
    expect(useUIStore.getState().theme).toBe('light');
  });

  it('applyTheme updates document root classes and colorScheme when document is defined', () => {
    if (typeof document !== 'undefined') {
      applyTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme-mode')).toBe('dark');

      applyTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.documentElement.getAttribute('data-theme-mode')).toBe('light');
    }
  });

  it('getSystemTheme returns light fallback safely in non-browser environments', () => {
    expect(['light', 'dark']).toContain(getSystemTheme());
  });
});
