import { useEffect, useSyncExternalStore } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';

// Must match the inline script in index.html that applies the theme before first paint.
const STORAGE_KEY = 'ayah-words-theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

const read = (): ThemePreference => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
};

let preference: ThemePreference = read();
const listeners = new Set<() => void>();

const apply = () => {
  const dark = preference === 'dark' || (preference === 'system' && media().matches);
  document.documentElement.classList.toggle('dark', dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0f0e0c' : '#064e3b');
};

export const setThemePreference = (next: ThemePreference) => {
  preference = next;
  try {
    if (next === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* per-viewer convenience only */
  }
  apply();
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useTheme = () => {
  const current = useSyncExternalStore(subscribe, () => preference);

  // Follow the OS setting live while on "system"
  useEffect(() => {
    apply();
    if (current !== 'system') return;
    const mq = media();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [current]);

  return [current, setThemePreference] as const;
};
