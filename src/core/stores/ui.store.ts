import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../config/constants';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ViewMode = 'grid' | 'table';

export interface UIState {
  theme: ThemeMode;
  isEditMode: boolean;
  viewMode: ViewMode;
  sidebarOpen: boolean;
  activeDrawer: string | null;

  setTheme: (theme: ThemeMode) => void;
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;
  setViewMode: (viewMode: ViewMode) => void;
  toggleViewMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openDrawer: (drawerId: string) => void;
  closeDrawer: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      isEditMode: false,
      viewMode: 'grid',
      sidebarOpen: false,
      activeDrawer: null,

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          if (
            theme === 'dark' ||
            (theme === 'system' &&
              window.matchMedia('(prefers-color-scheme: dark)').matches)
          ) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
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
    }),
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
      }),
    },
  ),
);

export const uiStore = useUIStore;
