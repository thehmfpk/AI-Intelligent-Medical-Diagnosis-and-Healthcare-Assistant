import { useMemo } from 'react';
import { DisplayMode } from '../data/symptomTranslations';

/** True when the browser or device is set to Urdu. */
export function browserPrefersUrdu(): boolean {
  if (typeof navigator === 'undefined') return false;
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return langs.some(l => l?.toLowerCase().startsWith('ur'));
}

/**
 * Symptoms are always shown in English with the Urdu name underneath, so no
 * switch is needed and nobody has to choose a language.
 */
export function autoDisplayMode(_search: string = '', _sample: string[] = []): DisplayMode {
  return 'both';
}

export function useAutoDisplayMode(search: string, sample: string[]): DisplayMode {
  return useMemo(() => autoDisplayMode(search, sample), [search, sample]);
}
