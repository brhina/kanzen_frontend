import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../config/constants';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ViewMode = 'grid' | 'table';

let mediaQueryList: MediaQueryList | null = null;
let mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null;

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

export function applyTheme(theme: ThemeMode): 'light' | 'dark' {
  const resolved = resolveTheme(theme);

  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.colorScheme = resolved;
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-theme-mode', theme);
  }

  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // Ignore quota/private mode errors
    }
  }

  // Manage reactive media query listener when in 'system' mode
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    if (theme === 'system') {
      if (!mediaQueryListener) {
        mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQueryListener = (e: MediaQueryListEvent) => {
          const currentTheme = useUIStore.getState().theme;
          if (currentTheme === 'system') {
            const nextResolved = e.matches ? 'dark' : 'light';
            if (typeof document !== 'undefined') {
              const root = document.documentElement;
              if (nextResolved === 'dark') {
                root.classList.add('dark');
              } else {
                root.classList.remove('dark');
              }
              root.style.colorScheme = nextResolved;
              root.setAttribute('data-theme', nextResolved);
            }
            useUIStore.setState({ resolvedTheme: nextResolved });
          }
        };

        if (typeof mediaQueryList.addEventListener === 'function') {
          mediaQueryList.addEventListener('change', mediaQueryListener);
        } else if (typeof (mediaQueryList as unknown as { addListener?: (cb: unknown) => void }).addListener === 'function') {
          (mediaQueryList as unknown as { addListener: (cb: unknown) => void }).addListener(mediaQueryListener);
        }
      }
    } else {
      if (mediaQueryList && mediaQueryListener) {
        if (typeof mediaQueryList.removeEventListener === 'function') {
          mediaQueryList.removeEventListener('change', mediaQueryListener);
        } else if (typeof (mediaQueryList as unknown as { removeListener?: (cb: unknown) => void }).removeListener === 'function') {
          (mediaQueryList as unknown as { removeListener: (cb: unknown) => void }).removeListener(mediaQueryListener);
        }
        mediaQueryListener = null;
        mediaQueryList = null;
      }
    }
  }

  return resolved;
}

export interface UIState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  isEditMode: boolean;
  viewMode: ViewMode;
  sidebarOpen: boolean;
  activeDrawer: string | null;
  adminBarMinimized: boolean;

  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;
  setViewMode: (viewMode: ViewMode) => void;
  toggleViewMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openDrawer: (drawerId: string) => void;
  closeDrawer: () => void;
  setAdminBarMinimized: (minimized: boolean) => void;
  toggleAdminBarMinimized: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get, api) => {
      queueMicrotask(() => {
        api.getInitialState = api.getState;
      });
      return {
        theme: 'system',
        resolvedTheme: typeof window !== 'undefined' ? resolveTheme('system') : 'light',
        isEditMode: false,
        viewMode: 'grid',
        sidebarOpen: false,
        activeDrawer: null,
        adminBarMinimized: false,

        setTheme: (theme) => {
          const resolved = applyTheme(theme);
          set({ theme, resolvedTheme: resolved });
        },

        cycleTheme: () => {
          const current = get().theme;
          const next: ThemeMode =
            current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
          const resolved = applyTheme(next);
          set({ theme: next, resolvedTheme: resolved });
        },

      toggleEditMode: () => {
        set((state) => ({ isEditMode: !state.isEditMode }));
      },

      setEditMode: (isEditMode) => {
        set({ isEditMode });
      },

      setViewMode: (viewMode) => {
        set({ viewMode });
      },

      toggleViewMode: () => {
        set((state) => ({
          viewMode: state.viewMode === 'grid' ? 'table' : 'grid',
        }));
      },

      setSidebarOpen: (sidebarOpen) => {
        set({ sidebarOpen });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      openDrawer: (drawerId) => {
        set({ activeDrawer: drawerId });
      },

      closeDrawer: () => {
        set({ activeDrawer: null });
      },

      setAdminBarMinimized: (adminBarMinimized) => {
        set({ adminBarMinimized });
      },

      toggleAdminBarMinimized: () => {
        set((state) => ({ adminBarMinimized: !state.adminBarMinimized }));
      },
    };
  },
  {
      name: STORAGE_KEYS.ui,
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (state) => ({
        theme: state.theme,
        isEditMode: state.isEditMode,
        viewMode: state.viewMode,
        adminBarMinimized: state.adminBarMinimized,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          const resolved = applyTheme(state.theme);
          if (state.resolvedTheme !== resolved) {
            useUIStore.setState({ resolvedTheme: resolved });
          }
        }
      },
    },
  ),
);

export const uiStore = useUIStore;

// Ensure server snapshots in SSR/Node match the current state rather than stale initialization
useUIStore.getInitialState = useUIStore.getState;

// Auto-initialize theme on client load
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ui);
    let themeToApply: ThemeMode = 'system';
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.theme) {
        themeToApply = parsed.state.theme;
      }
    } else {
      const direct = localStorage.getItem(STORAGE_KEYS.theme);
      if (direct === 'light' || direct === 'dark' || direct === 'system') {
        themeToApply = direct;
      }
    }
    applyTheme(themeToApply);
  } catch {
    applyTheme('system');
  }
}
