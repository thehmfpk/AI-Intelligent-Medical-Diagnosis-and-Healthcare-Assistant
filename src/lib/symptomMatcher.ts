/**
 * Understands free text (typed or spoken) in Urdu script, Roman Urdu and
 * English and turns it into the exact symptom keys used by the prediction
 * matrix. Everything runs in the browser - no API key or server needed.
 */
import { symptomsList, diseaseSymptomMatrix } from '../data/medicalData';
import { symptomTranslations, englishLabel } from '../data/symptomTranslations';

export type Lang = 'en' | 'ur';

// ---------------------------------------------------------------------------
// Normalisation
// ---------------------------------------------------------------------------

const URDU_SCRIPT = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;

export function hasUrduScript(text: string): boolean {
  return URDU_SCRIPT.test(text);
}

/** Shared by user text and phrase index so both sides compare like with like. */
function foldLetters(input: string): string {
  return input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[‌‍‎‏ـ]/g, '') // joiners, direction marks, tatweel
    .replace(/\p{M}/gu, '') // Urdu/Arabic diacritics and Latin accents
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ةۃ]/g, 'ہ')
    .replace(/[هھ]/g, 'ہ') // keyboards disagree on he / do-chashmi he
    .replace(/ۓ/g, 'ے')
    .replace(/[أإ]/g, 'ا')
    .replace(/['’‘`´]/g, '');
}

/** Lower-cased, accent/diacritic-free text for simple "contains" searches. */
export function foldText(input: string): string {
  return foldLetters(input).replace(/\s+/g, ' ').trim();
}

/** Does a symptom match what the person typed in a search box (English, Urdu or Roman Urdu)? */
export function symptomMatchesQuery(symptom: string, query: string): boolean {
  const q = foldText(query);
  if (!q) return true;
  const t = symptomTranslations[symptom];
  return [englishLabel(symptom), t?.ur ?? '', ...(t?.aliases ?? [])].some(h => foldText(h).includes(q));
}

/** User text -> tokens. Clause breaks become a "|" token so negation stops there. */
export function tokenize(input: string): string[] {
  const s = foldLetters(input)
    .replace(/[.,;:!?؟،۔؛\n\r()[\]{}"“”/\\]+/g, ' | ')
    .replace(/[^\p{L}\p{N}|\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s ? s.split(' ') : [];
}

function phraseTokens(phrase: string): string[] {
  const s = foldLetters(phrase)
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s ? s.split(' ') : [];
}

// ---------------------------------------------------------------------------
// Phrase index (built once)
// ---------------------------------------------------------------------------

interface Phrase {
  tokens: string[];
  key: string;
}

// Urdu verbs change with the speaker ("raha" / "rahi" / "rahe"); accept all forms.
const VARIANT_GROUPS = [
  ['raha', 'rahi', 'rahe'], ['رہا', 'رہی', 'رہے'],
  ['lagta', 'lagti', 'lagte'], ['لگتا', 'لگتی', 'لگتے'],
  ['aata', 'aati', 'aate'], ['آتا', 'آتی', 'آتے'],
  ['hota', 'hoti', 'hote'], ['ہوتا', 'ہوتی', 'ہوتے'],
  ['gaya', 'gayi', 'gaye'], ['گیا', 'گئی', 'گئے'],
  ['jata', 'jati', 'jate'], ['جاتا', 'جاتی', 'جاتے'],
  ['sookha', 'sookhi', 'sookhe'], ['سوکھا', 'سوکھی', 'سوکھے'],
].map(g => g.map(foldLetters));

function withVariants(tokens: string[]): string[][] {
  let out: string[][] = [tokens];
  for (const group of VARIANT_GROUPS) {
    const idx = tokens.findIndex(t => group.includes(t));
    if (idx === -1) continue;
    out = out.flatMap(base => group.map(form => base.map((t, i) => (i === idx ? form : t))));
  }
  return out;
}

const phraseIndex: Phrase[] = [];
{
  const seen = new Set<string>();
  for (const key of symptomsList) {
    const t = symptomTranslations[key];
    const raw = [englishLabel(key), t?.ur ?? '', ...(t?.aliases ?? [])];
    for (const r of raw) {
      const base = phraseTokens(r);
      if (base.length === 0) continue;
      for (const tokens of withVariants(base)) {
        const id = tokens.join(' ');
        if (seen.has(id)) continue; // first symptom to claim a phrase keeps it
        seen.add(id);
        phraseIndex.push({ tokens, key });
      }
    }
  }
  // Longest phrase first, so "frontal headache" wins over "headache".
  phraseIndex.sort(
    (a, b) => b.tokens.length - a.tokens.length || b.tokens.join(' ').length - a.tokens.join(' ').length
  );
}

// Body part + pain word ("my knee really hurts", "mere sar mein bahut dard").
const PAIN_WORDS = new Set([
  'pain', 'ache', 'aches', 'aching', 'hurts', 'hurt', 'painful', 'sore',
  'dard', 'dukh', 'dukhta', 'dukhti', 'dukh', 'takleef', 'takleef',
  'درد', 'تکلیف', 'دکھتا', 'دکھتی', 'دکھ',
].map(w => foldLetters(w)));

const BODY_PARTS: Record<string, string> = {};
function addParts(key: string, words: string[]) {
  for (const w of words) BODY_PARTS[foldLetters(w)] = key;
}
addParts('headache', ['head', 'sar', 'sir', 'سر']);
addParts('sharp chest pain', ['chest', 'seena', 'seene', 'سینہ', 'سینے']);
addParts('back pain', ['back', 'kamar', 'peeth', 'کمر', 'پیٹھ']);
addParts('neck pain', ['neck', 'gardan', 'گردن']);
addParts('sore throat', ['throat', 'gala', 'gale', 'گلا', 'گلے']);
addParts('ear pain', ['ear', 'kaan', 'kan', 'کان']);
addParts('pain in eye', ['eye', 'aankh', 'aankhon', 'آنکھ', 'آنکھوں']);
addParts('toothache', ['tooth', 'teeth', 'daant', 'dant', 'daadh', 'دانت', 'داڑھ']);
addParts('knee pain', ['knee', 'ghutna', 'ghutne', 'گھٹنا', 'گھٹنے']);
addParts('shoulder pain', ['shoulder', 'kandha', 'kandhe', 'کندھا', 'کندھے']);
addParts('leg pain', ['leg', 'legs', 'taang', 'tang', 'tangon', 'ٹانگ', 'ٹانگوں']);
addParts('arm pain', ['arm', 'bazu', 'bazoo', 'بازو']);
addParts('ankle pain', ['ankle', 'takhna', 'takhne', 'ٹخنہ', 'ٹخنے']);
addParts('elbow pain', ['elbow', 'kohni', 'kuhni', 'کہنی']);
addParts('wrist pain', ['wrist', 'kalai', 'کلائی']);
addParts('hip pain', ['hip', 'kulha', 'kulhe', 'کولہا', 'کولہے']);
addParts('foot or toe pain', ['foot', 'feet', 'toe', 'paon', 'pair', 'پاؤں', 'پیر']);
addParts('hand or finger pain', ['hand', 'finger', 'fingers', 'haath', 'ungli', 'ہاتھ', 'انگلی']);
addParts('joint pain', ['joint', 'joints', 'jor', 'jodon', 'jorron', 'جوڑ', 'جوڑوں']);
addParts('sharp abdominal pain', ['stomach', 'belly', 'tummy', 'abdomen', 'pait', 'peit', 'pet', 'پیٹ']);
addParts('facial pain', ['face', 'chehra', 'chehre', 'چہرہ', 'چہرے']);
addParts('rib pain', ['rib', 'ribs', 'pasli', 'pasliyon', 'پسلی', 'پسلیوں']);
addParts('gum pain', ['gum', 'gums', 'masoorha', 'masoorhon', 'مسوڑھا', 'مسوڑھوں', 'مسوڑوں']);
addParts('mouth pain', ['mouth', 'muh', 'munh', 'منہ']);
addParts('pelvic pain', ['pelvis', 'pelvic', 'peru', 'پیڑو']);
addParts('side pain', ['side', 'pehlu', 'پہلو']);

// Negation ------------------------------------------------------------------

const NEG_BEFORE = new Set(
  ['no', 'not', 'without', 'never', 'dont', 'doesnt', 'didnt', 'havent', 'hasnt', 'nothing', 'neither', 'nor', 'none',
    'bagair', 'bina', 'بغیر', 'بنا'].map(foldLetters)
);
const NEG_AFTER = new Set(['nahi', 'nahin', 'nhi', 'nai', 'نہیں', 'نہی', 'نھیں'].map(foldLetters));
const STOPPERS = new Set(
  ['|', 'but', 'however', 'though', 'although', 'while', 'lekin', 'magar', 'albatta', 'jabke', 'لیکن', 'مگر', 'البتہ'].map(foldLetters)
);

// ---------------------------------------------------------------------------
// Fuzzy fallback for small typos in long single words
// ---------------------------------------------------------------------------

const fuzzyWords: { word: string; key: string }[] = phraseIndex
  .filter(p => p.tokens.length === 1 && /^[a-z]{6,}$/.test(p.tokens[0]))
  .map(p => ({ word: p.tokens[0], key: p.key }));

function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ExtractResult {
  /** Symptoms the user has (exact keys from `symptomsList`). */
  found: string[];
  /** Symptoms the user explicitly said they do NOT have. */
  negated: string[];
}

export function extractSymptoms(text: string): ExtractResult {
  const tokens = tokenize(text);
  const masked = new Array<boolean>(tokens.length).fill(false);
  const hits: { key: string; start: number; end: number }[] = [];

  // 1) Whole-phrase matches, longest first.
  for (const p of phraseIndex) {
    const m = p.tokens.length;
    for (let i = 0; i + m <= tokens.length; i++) {
      let ok = true;
      for (let k = 0; k < m; k++) {
        if (masked[i + k] || tokens[i + k] !== p.tokens[k]) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      for (let k = 0; k < m; k++) masked[i + k] = true;
      hits.push({ key: p.key, start: i, end: i + m });
    }
  }

  // 2) "<body part> ... <pain word>" within a few words of each other.
  for (let i = 0; i < tokens.length; i++) {
    if (masked[i] || !PAIN_WORDS.has(tokens[i])) continue;
    for (let d = 1; d <= 4; d++) {
      const cands = [i - d, i + d];
      let found = false;
      for (const j of cands) {
        if (j < 0 || j >= tokens.length || masked[j]) continue;
        const key = BODY_PARTS[tokens[j]];
        if (!key) continue;
        // Don't jump over a clause break.
        const lo = Math.min(i, j);
        const hi = Math.max(i, j);
        if (tokens.slice(lo, hi + 1).includes('|')) continue;
        masked[i] = masked[j] = true;
        hits.push({ key, start: lo, end: hi + 1 });
        found = true;
        break;
      }
      if (found) break;
    }
  }

  // 3) Small typos in long Latin words ("headach", "diarhea").
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (masked[i] || !/^[a-z]{6,}$/.test(t)) continue;
    const near = fuzzyWords.filter(f => f.word[0] === t[0] && withinOneEdit(t, f.word));
    const keys = new Set(near.map(n => n.key));
    if (keys.size === 1) {
      masked[i] = true;
      hits.push({ key: near[0].key, start: i, end: i + 1 });
    }
  }

  hits.sort((a, b) => a.start - b.start);

  const found: string[] = [];
  const negated: string[] = [];
  for (const h of hits) {
    let isNegated = false;
    for (let j = h.start - 1; j >= Math.max(0, h.start - 3); j--) {
      if (STOPPERS.has(tokens[j])) break;
      if (NEG_BEFORE.has(tokens[j])) {
        isNegated = true;
        break;
      }
    }
    if (!isNegated) {
      for (let j = h.end; j < Math.min(tokens.length, h.end + 2); j++) {
        if (STOPPERS.has(tokens[j])) break;
        if (NEG_AFTER.has(tokens[j])) {
          isNegated = true;
          break;
        }
      }
    }
    const bucket = isNegated ? negated : found;
    if (!bucket.includes(h.key)) bucket.push(h.key);
  }

  // A symptom that is both reported and denied in one message: trust the denial.
  return { found: found.filter(k => !negated.includes(k)), negated };
}

// Language ------------------------------------------------------------------

const ROMAN_URDU_CUES = new Set(
  [
    'mujhe', 'mera', 'meri', 'mere', 'hai', 'hain', 'hun', 'hoon', 'raha', 'rahi', 'rahe', 'nahi', 'nahin', 'nhi',
    'bohat', 'bahut', 'bohot', 'zyada', 'thoda', 'lagta', 'lagti', 'lag', 'aur', 'kya', 'mein', 'ko', 'ka', 'ki', 'ke',
    'bukhar', 'dard', 'khansi', 'ulti', 'dast', 'kamzori', 'chakkar', 'pait', 'sar', 'gala', 'jism', 'badan', 'aata',
    'aati', 'aate', 'ho', 'hua', 'hui', 'kal', 'aaj', 'din', 'se', 'haan', 'ji', 'jee', 'theek', 'bas', 'shukriya',
    'tajzia', 'tajziya', 'karo', 'kijiye', 'kijiyega', 'batao', 'bataein', 'bataiye', 'nateeja', 'shuru', 'kar', 'dein', 'dijiye',
  ].map(foldLetters)
);

/** Urdu script, or Roman Urdu with at least two typical words => "ur"; otherwise "en". */
export function detectLanguage(text: string): Lang {
  if (hasUrduScript(text)) return 'ur';
  const tokens = tokenize(text);
  let hits = 0;
  for (const t of tokens) if (ROMAN_URDU_CUES.has(t)) hits++;
  return hits >= 2 || (tokens.length === 1 && hits === 1 && /^(bukhar|bukhaar|khansi|dard|ulti|dast|haan|ji|jee|nahi|nahin|bas)$/.test(tokens[0]))
    ? 'ur'
    : 'en';
}

// Intents -------------------------------------------------------------------

function containsAny(tokens: string[], phrases: string[]): boolean {
  const joined = ' ' + tokens.join(' ') + ' ';
  return phrases.some(p => joined.includes(' ' + phraseTokens(p).join(' ') + ' '));
}

export function wantsAnalysis(text: string): boolean {
  return containsAny(tokenize(text), [
    'analyze', 'analyse', 'analysis', 'diagnose', 'diagnosis', 'predict', 'show result', 'show results', 'give result',
    'whats my result', 'run it', 'go ahead', 'submit', 'compile',
    'tajzia', 'tajziya', 'tajzia karo', 'tajziya karo', 'nateeja', 'result batao', 'result dikhao', 'bimari batao',
    'تجزیہ', 'تجزیہ کریں', 'تجزیہ کرو', 'نتیجہ', 'نتیجہ بتائیں', 'نتیجہ دکھائیں', 'بیماری بتائیں', 'بیماری بتاؤ',
  ]);
}

export function saysDone(text: string): boolean {
  return containsAny(tokenize(text), [
    'done', 'thats all', 'that is all', 'thats it', 'nothing else', 'no more', 'nothing more', 'finished', 'im done',
    'bas', 'bas itna', 'bas itna hi', 'itna hi', 'kafi hai', 'aur kuch nahi', 'aur nahi',
    'بس', 'بس اتنا', 'بس یہی', 'بس اتنا ہی', 'کافی ہے', 'اور کچھ نہیں', 'اور نہیں', 'مزید نہیں',
  ]);
}

export function isNo(text: string): boolean {
  const t = tokenize(text);
  return t.length <= 3 && containsAny(t, ['no', 'nope', 'nah', 'nahi', 'nahin', 'nhi', 'نہیں', 'نہی', 'جی نہیں', 'no thanks']);
}

export function isYes(text: string): boolean {
  const t = tokenize(text);
  return t.length <= 3 && containsAny(t, ['yes', 'yeah', 'yep', 'yup', 'ok', 'okay', 'sure', 'haan', 'han', 'ji', 'jee', 'ji haan', 'جی', 'ہاں', 'جی ہاں', 'ہاں جی', 'اوکے', 'ٹھیک ہے']);
}

export function isGreeting(text: string): boolean {
  const t = tokenize(text);
  return t.length <= 4 && containsAny(t, ['hi', 'hello', 'hey', 'salam', 'salaam', 'assalamualaikum', 'assalam o alaikum', 'assalam alaikum', 'السلام علیکم', 'سلام', 'ہیلو', 'ہائے']);
}

export function wantsReset(text: string): boolean {
  return containsAny(tokenize(text), [
    'start over', 'reset', 'clear all', 'new chat', 'begin again', 'dobara shuru', 'naye sire se', 'phir se shuru',
    'دوبارہ شروع', 'نئے سرے سے', 'پھر سے شروع', 'سب صاف',
  ]);
}

/** Self-harm language - the bot answers with care instead of just collecting symptoms. */
export function mentionsSelfHarm(text: string): boolean {
  return containsAny(tokenize(text), [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 'wanna die', 'hurt myself',
    'khudkushi', 'marna chahta', 'marna chahti', 'jaan de dun', 'jaan dena chahta', 'jaan dena chahti',
    'خودکشی', 'مرنا چاہتا', 'مرنا چاہتی', 'مر جانا چاہتا', 'مر جانا چاہتی', 'جان دے دوں', 'جان دینا چاہتا', 'جان دینا چاہتی',
  ]);
}

// Safety --------------------------------------------------------------------

const RED_FLAGS = new Set([
  'sharp chest pain', 'chest tightness', 'burning chest pain', 'hurts to breath', 'difficulty breathing',
  'shortness of breath', 'fainting', 'seizures', 'vomiting blood', 'hemoptysis', 'melena', 'blood in stool',
  'rectal bleeding', 'difficulty speaking', 'focal weakness', 'blindness', 'spotting or bleeding during pregnancy',
  'delusions or hallucinations',
]);

export function hasRedFlag(symptoms: string[]): boolean {
  return symptoms.some(s => RED_FLAGS.has(s));
}

// Follow-up suggestions -----------------------------------------------------

const STARTER_SYMPTOMS = ['fever', 'cough', 'headache', 'fatigue', 'nausea', 'sore throat'];

/**
 * Which other symptoms usually go with what the user has already told us?
 * Uses the same disease/symptom table as the predictor, so the questions the
 * bot asks are always relevant to a real candidate disease.
 */
export function suggestRelated(selected: string[], skip: string[] = [], limit = 4): string[] {
  const exclude = new Set([...selected, ...skip]);
  if (selected.length === 0) {
    return STARTER_SYMPTOMS.filter(s => symptomsList.includes(s) && !exclude.has(s)).slice(0, limit);
  }
  const score = new Map<string, number>();
  for (const d of diseaseSymptomMatrix) {
    const overlap = selected.filter(s => d.symptoms.includes(s)).length;
    if (overlap === 0) continue;
    for (const s of d.symptoms) {
      if (exclude.has(s)) continue;
      score.set(s, (score.get(s) ?? 0) + overlap * overlap);
    }
  }
  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([s]) => s);
}
