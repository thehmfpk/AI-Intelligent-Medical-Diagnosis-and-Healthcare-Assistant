import { useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

const KEY = 'dr_hmf_theme';
const listeners = new Set<() => void>();

const read = (): Theme =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('light') ? 'light' : 'dark';

/** Apply a theme to <html>, remember it, and tell every subscriber. */
export function setTheme(next: Theme) {
  const root = document.documentElement;
  // Brief class that enables the colour transition only while switching.
  root.classList.add('theme-anim');
  root.classList.toggle('light', next === 'light');
  window.setTimeout(() => root.classList.remove('theme-anim'), 350);
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode: the choice just will not persist */
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#f8fafc' : '#050505');
  listeners.forEach(l => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, read, () => 'dark' as Theme);
  return [theme, () => setTheme(theme === 'light' ? 'dark' : 'light')];
}
