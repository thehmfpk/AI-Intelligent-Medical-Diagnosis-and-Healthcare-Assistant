/**
 * Dialogue logic for the Dr.HMF chat assistant. Pure functions only (no React,
 * no network) so it is easy to test and to swap for an LLM later.
 */
import { englishLabel, urduLabel } from '../data/symptomTranslations';
import {
  Lang,
  detectLanguage,
  extractSymptoms,
  hasRedFlag,
  isGreeting,
  isNo,
  isYes,
  mentionsSelfHarm,
  saysDone,
  suggestRelated,
  wantsAnalysis,
  wantsReset,
} from './symptomMatcher';

export interface ChatState {
  selected: string[];
  /** Suggestions the user has already seen, so we do not nag about them. */
  asked: string[];
  lang: Lang;
}

export type ChatAction = 'none' | 'analyze' | 'reset';

export interface BotTurn {
  text: string;
  lang: Lang;
  /** Symptom keys offered as tappable quick replies. */
  suggestions: string[];
  /** Extra warning bubble (red-flag or crisis message). */
  warning?: string;
  action: ChatAction;
  /** Symptoms added by this turn. */
  added: string[];
  /** Symptoms the user said they do not have. */
  removed: string[];
  lang_changed_to?: Lang;
}

export const label = (key: string, lang: Lang): string => (lang === 'ur' ? urduLabel(key) : englishLabel(key));
const list = (keys: string[], lang: Lang) => keys.map(k => label(k, lang)).join(lang === 'ur' ? '، ' : ', ');

const T = {
  greeting: {
    en: "Assalam-o-alaikum! I'm Dr.HMF's assistant. Tell me what you're feeling — type it or tap the mic, in English or Urdu — and I'll note your symptoms. When you're ready, I'll run the analysis.",
    ur: 'السلام علیکم! میں ڈاکٹر ایچ ایم ایف کا اسسٹنٹ ہوں۔ آپ کو کیا تکلیف ہے؟ اردو یا انگریزی میں لکھ کر یا مائیک دبا کر بتائیں، میں آپ کی علامات نوٹ کر لوں گا۔ جب آپ تیار ہوں تو تجزیہ کر دوں گا۔',
  },
  hello: {
    en: 'Hello! What symptoms are you experiencing?',
    ur: 'السلام علیکم! آپ کو کیا علامات محسوس ہو رہی ہیں؟',
  },
  reset: {
    en: "Cleared. Let's start again — what are you feeling?",
    ur: 'سب صاف کر دیا۔ دوبارہ شروع کرتے ہیں — آپ کو کیا تکلیف ہے؟',
  },
  needOne: {
    en: 'Please tell me at least one symptom first, for example “fever” or “headache and cough”.',
    ur: 'پہلے کم از کم ایک علامت بتائیں، مثلاً «بخار» یا «سر درد اور کھانسی»۔',
  },
  noMatch: {
    en: "I couldn't match that to a symptom. Try describing it simply — for example “fever”, “headache and cough” — or tap one below.",
    ur: 'میں اسے کسی علامت سے نہیں جوڑ سکا۔ آسان لفظوں میں بتائیں، مثلاً «بخار»، «سر درد اور کھانسی» — یا نیچے سے منتخب کریں۔',
  },
  alreadyHave: {
    en: 'I already have that noted. Anything else you feel?',
    ur: 'یہ میں پہلے ہی نوٹ کر چکا ہوں۔ کیا کوئی اور تکلیف بھی ہے؟',
  },
  readyToAnalyze: {
    en: 'Okay. Tap “Analyze” whenever you are ready, or tell me anything else you feel.',
    ur: 'ٹھیک ہے۔ جب تیار ہوں تو «تجزیہ کریں» دبائیں، یا مزید کچھ ہو تو بتائیں۔',
  },
  yesWhat: {
    en: 'Please tell me which symptom — or tap one of the suggestions.',
    ur: 'براہِ کرم بتائیں کون سی علامت ہے — یا نیچے دی گئی تجاویز میں سے منتخب کریں۔',
  },
  urgent: {
    en: '⚠️ Some of what you described can be serious (for example chest pain, trouble breathing, fainting, seizures or bleeding). If this is happening now, please go to the nearest emergency room or call an ambulance (Rescue 1122 / Edhi 115 in Pakistan) — do not wait for this tool.',
    ur: '⚠️ آپ نے جو علامات بتائی ہیں ان میں سے کچھ سنگین ہو سکتی ہیں (جیسے سینے میں درد، سانس میں دشواری، بے ہوشی، دورے یا خون بہنا)۔ اگر یہ ابھی ہو رہا ہے تو فوراً قریبی ایمرجنسی جائیں یا ایمبولینس بلائیں (ریسکیو 1122 / ایدھی 115) — اس ٹول کا انتظار نہ کریں۔',
  },
  selfHarm: {
    en: "I'm really sorry you're feeling this way. You deserve support right now — please reach out to someone you trust or a mental-health professional, and if you might act on these thoughts, call emergency services (1122) or go to the nearest hospital. I'm here to keep talking if you'd like.",
    ur: 'مجھے افسوس ہے کہ آپ ایسا محسوس کر رہے ہیں۔ آپ کو اس وقت مدد ملنی چاہیے — کسی قابلِ اعتماد شخص یا ماہرِ نفسیات سے رابطہ کریں، اور اگر آپ ایسا کوئی قدم اٹھا سکتے ہیں تو فوراً ایمرجنسی (1122) پر کال کریں یا قریبی ہسپتال جائیں۔ آپ چاہیں تو میں آپ کے ساتھ بات جاری رکھوں گا۔',
  },
};

export function greetingText(lang: Lang): string {
  return T.greeting[lang];
}

export function respond(userText: string, state: ChatState): BotTurn {
  const text = userText.trim();

  // Reply in the language the person just used; otherwise keep the current one.
  const detected = detectLanguage(text);
  const looksLatinOnly = !/[^\x00-\x7F]/.test(text);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  // Only flip back to English for 2+ plain English words; a single "ok" or "fever" keeps the current language.
  const lang: Lang = detected === 'ur' ? 'ur' : looksLatinOnly && wordCount >= 2 ? 'en' : state.lang;

  const base: BotTurn = {
    text: '',
    lang,
    suggestions: [],
    action: 'none',
    added: [],
    removed: [],
    lang_changed_to: lang !== state.lang ? lang : undefined,
  };

  if (wantsReset(text)) {
    return { ...base, text: T.reset[lang], action: 'reset', suggestions: suggestRelated([], [], 4) };
  }

  const selfHarm = mentionsSelfHarm(text);
  const { found, negated } = extractSymptoms(text);
  const added = found.filter(s => !state.selected.includes(s));
  const removed = negated.filter(s => state.selected.includes(s));
  const nextSelected = [...state.selected.filter(s => !negated.includes(s)), ...added];

  const warning = selfHarm
    ? T.selfHarm[lang]
    : hasRedFlag(added)
      ? T.urgent[lang]
      : undefined;

  // Explicit "analyze" request.
  if (wantsAnalysis(text) || (saysDone(text) && added.length === 0)) {
    if (nextSelected.length === 0) {
      return { ...base, text: T.needOne[lang], suggestions: suggestRelated([], state.asked, 4), warning };
    }
    const n = nextSelected.length;
    return {
      ...base,
      action: 'analyze',
      added,
      removed,
      warning,
      text:
        lang === 'ur'
          ? `${n} علامات پر تجزیہ شروع کر رہا ہوں: ${list(nextSelected, lang)}…`
          : `Running the analysis on ${n} symptom${n === 1 ? '' : 's'}: ${list(nextSelected, lang)}…`,
    };
  }

  const parts: string[] = [];
  if (added.length > 0) {
    parts.push(lang === 'ur' ? `نوٹ کر لیا: ${list(added, lang)}۔` : `Noted: ${list(added, lang)}.`);
  }
  if (negated.length > 0) {
    parts.push(
      lang === 'ur'
        ? `ٹھیک ہے، ${list(negated, lang)} کو شامل نہیں کروں گا۔`
        : `Okay, I won't include ${list(negated, lang)}.`
    );
  }

  // Short answers like "no" / "haan" when no new symptom was given.
  if (added.length === 0 && negated.length === 0) {
    if (isGreeting(text)) {
      return { ...base, text: T.hello[lang], suggestions: suggestRelated(nextSelected, state.asked, 4), warning };
    }
    if (isNo(text) || saysDone(text)) {
      return {
        ...base,
        text: nextSelected.length > 0 ? T.readyToAnalyze[lang] : T.needOne[lang],
        suggestions: nextSelected.length > 0 ? [] : suggestRelated([], state.asked, 4),
        warning,
      };
    }
    if (isYes(text)) {
      return { ...base, text: T.yesWhat[lang], suggestions: suggestRelated(nextSelected, state.asked, 4), warning };
    }
    if (found.length > 0) {
      // Everything mentioned was already on the list.
      return { ...base, text: T.alreadyHave[lang], suggestions: suggestRelated(nextSelected, state.asked, 4), warning };
    }
    if (selfHarm) {
      return { ...base, text: T.selfHarm[lang], warning: undefined, suggestions: [] };
    }
    return { ...base, text: T.noMatch[lang], suggestions: suggestRelated(nextSelected, state.asked, 4) };
  }

  // New information: ask a relevant follow-up.
  const suggestions = suggestRelated(nextSelected, [...state.asked, ...negated], 4);
  if (suggestions.length > 0 && added.length > 0) {
    parts.push(
      lang === 'ur'
        ? 'کیا ان میں سے کوئی اور علامت بھی ہے؟ ٹیپ کر کے شامل کریں، یا مزید بتائیں۔'
        : 'Do you also have any of these? Tap to add, or tell me more.'
    );
  } else if (added.length > 0) {
    parts.push(lang === 'ur' ? 'کیا کوئی اور تکلیف ہے؟' : 'Anything else?');
  }

  return {
    ...base,
    text: parts.join(' '),
    suggestions: added.length > 0 ? suggestions : [],
    added,
    removed,
    warning: selfHarm ? T.selfHarm[lang] : warning,
  };
}

/** Reply used when a person taps a suggestion chip or the symptom list instead of typing. */
export function respondToTap(symptom: string, state: ChatState): BotTurn {
  const lang = state.lang;
  const nextSelected = [...state.selected, symptom];
  const suggestions = suggestRelated(nextSelected, state.asked, 4);
  const text =
    lang === 'ur'
      ? `نوٹ کر لیا: ${label(symptom, lang)}۔ ${suggestions.length > 0 ? 'کیا کوئی اور علامت بھی ہے؟' : 'کیا کوئی اور تکلیف ہے؟'}`
      : `Noted: ${label(symptom, lang)}. ${suggestions.length > 0 ? 'Anything else you feel?' : 'Anything else?'}`;
  return {
    text,
    lang,
    suggestions,
    action: 'none',
    added: [symptom],
    removed: [],
    warning: hasRedFlag([symptom]) ? T.urgent[lang] : undefined,
  };
}
