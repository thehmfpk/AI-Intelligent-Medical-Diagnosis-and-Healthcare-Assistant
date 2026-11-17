import { useMemo } from 'react';
import { DisplayMode } from '../data/symptomTranslations';
import { hasUrduScript, symptomMatchesQuery } from './symptomMatcher';
import { englishLabel } from '../data/symptomTranslations';

/** True when the browser or device is set to Urdu. */
export function browserPrefersUrdu(): boolean {
  if (typeof navigator === 'undefined') return false;
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return langs.some(l => l?.toLowerCase().startsWith('ur'));
}

/**
 * Chooses how symptoms are displayed, without any switch for the user:
 * - Urdu script typed in the search box shows Urdu names;
 * - a Roman Urdu search (matches a symptom but not its English name) shows both;
 * - otherwise it follows the browser language: both for Urdu devices, English for the rest.
 */
export function autoDisplayMode(search: string, sample: string[] = []): DisplayMode {
  const q = search.trim();
  if (q) {
    if (hasUrduScript(q)) return 'ur';
    const hits = sample.filter(s => symptomMatchesQuery(s, q));
    if (hits.length && hits.every(s => !englishLabel(s).toLowerCase().includes(q.toLowerCase()))) return 'both';
  }
  return browserPrefersUrdu() ? 'both' : 'en';
}

export function useAutoDisplayMode(search: string, sample: string[]): DisplayMode {
  return useMemo(() => autoDisplayMode(search, sample), [search, sample]);
}
