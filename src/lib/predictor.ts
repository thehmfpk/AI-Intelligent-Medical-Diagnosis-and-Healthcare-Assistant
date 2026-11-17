/**
 * Ranks diseases for a set of symptoms.
 *
 * The score blends two things: how much of what the person reported a disease
 * explains (precision), and how much of the disease's usual symptom profile the
 * person reported (recall). Precision carries more weight because people
 * usually report only a few symptoms. The percentage shown to the user is a
 * "symptom match", not a probability or a clinical accuracy.
 */
import { diseaseSymptomMatrix } from '../data/medicalData';

export interface RankedDisease {
  disease: string;
  /** Reported symptoms this disease explains. */
  matched: string[];
  /** Reported symptoms this disease does not list. */
  unexplained: string[];
  /** Typical symptoms of the disease the person did not report. */
  missing: string[];
  /** 0-100 symptom match. */
  match: number;
}

export function rankDiseases(symptoms: string[], limit = 4): RankedDisease[] {
  const reported = Array.from(new Set(symptoms));
  if (reported.length === 0) return [];

  const ranked = diseaseSymptomMatrix.map(entry => {
    const profile = new Set(entry.symptoms);
    const matched = reported.filter(s => profile.has(s));
    const precision = matched.length / reported.length;
    const recall = profile.size ? matched.length / profile.size : 0;
    const score = precision * 0.75 + recall * 0.25;
    return {
      disease: entry.disease,
      matched,
      unexplained: reported.filter(s => !profile.has(s)),
      missing: entry.symptoms.filter(s => !reported.includes(s)),
      score,
    };
  });

  ranked.sort((a, b) => b.score - a.score || b.matched.length - a.matched.length || a.disease.localeCompare(b.disease));

  return ranked.slice(0, limit).map(({ score, ...rest }) => ({ ...rest, match: Math.round(score * 100) }));
}

/** Short label for how strong the best match is. */
export function matchStrength(match: number): 'strong' | 'moderate' | 'weak' {
  if (match >= 75) return 'strong';
  if (match >= 50) return 'moderate';
  return 'weak';
}
