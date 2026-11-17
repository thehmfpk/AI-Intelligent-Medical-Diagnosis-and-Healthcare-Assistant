import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, VolumeX, RotateCcw, Sparkles, X, User, Info, ListChecks, Activity, ShieldCheck } from 'lucide-react';
import { DisplayMode } from '../data/symptomTranslations';
import { Lang } from '../lib/symptomMatcher';
import { BotTurn, ChatState, greetingText, respond, respondToTap, label } from '../lib/chatEngine';
import { usePersistentState } from '../lib/usePersistentState';
import SymptomName from './SymptomName';
import DoctorAvatar from './DoctorAvatar';
import { rankDiseases, matchStrength } from '../lib/predictor';
import { browserPrefersUrdu } from '../lib/autoLanguage';

// --- Web Speech API (not in lib.dom.d.ts for every TS version) ---------------

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const SPEECH_LANG: Record<Lang, string> = { en: 'en-US', ur: 'ur-PK' };

// --- Chat model ---------------------------------------------------------------

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
  lang: Lang;
  warning?: boolean;
  /** Quick-reply symptom chips shown under this bot message. */
  chips?: string[];
}

interface Saved {
  messages: Message[];
  selected: string[];
  asked: string[];
  lang: Lang;
}

const UI = {
  title: { en: 'Dr.HMF Assistant', ur: 'ڈاکٹر ایچ ایم ایف اسسٹنٹ' },
  subtitle: { en: 'Describe how you feel — type or speak, in English or Urdu', ur: 'اپنی تکلیف بتائیں — لکھ کر یا بول کر، اردو یا انگریزی میں' },
  placeholder: { en: 'Type your symptoms… e.g. fever and headache', ur: 'اپنی علامات لکھیں… مثلاً بخار اور سر درد' },
  listening: { en: 'Listening… speak now', ur: 'سن رہا ہوں… بولیں' },
  selected: { en: 'Symptoms noted', ur: 'نوٹ کی گئی علامات' },
  none: { en: 'Nothing yet — tell me how you feel.', ur: 'ابھی کچھ نہیں — اپنی تکلیف بتائیں۔' },
  analyze: { en: 'Analyze', ur: 'تجزیہ کریں' },
  reset: { en: 'Start over', ur: 'دوبارہ شروع کریں' },
  micOff: { en: 'Voice input is not supported in this browser. Please use Chrome or Edge, or type instead.', ur: 'اس براؤزر میں آواز سے ان پٹ دستیاب نہیں۔ براہِ کرم Chrome یا Edge استعمال کریں، یا لکھ کر بتائیں۔' },
  micDenied: { en: 'Microphone access was blocked. Allow it in your browser settings to speak.', ur: 'مائیک کی اجازت بلاک ہے۔ بولنے کے لیے براؤزر کی سیٹنگز میں اجازت دیں۔' },
  micNoSpeech: { en: "I didn't hear anything. Tap the mic and try again.", ur: 'مجھے کچھ سنائی نہیں دیا۔ مائیک دبا کر دوبارہ کوشش کریں۔' },
  micFail: { en: "Voice input didn't work. Please try again or type instead.", ur: 'آواز سے ان پٹ کام نہیں کر سکا۔ دوبارہ کوشش کریں یا لکھ کر بتائیں۔' },
  disclaimer: {
    en: 'This assistant only collects symptoms for a pattern-matching estimate. It is not a medical diagnosis — see a doctor for any health concern.',
    ur: 'یہ اسسٹنٹ صرف علامات جمع کر کے اندازہ لگاتا ہے۔ یہ طبی تشخیص نہیں ہے — کسی بھی صحت کے مسئلے میں ڈاکٹر سے رجوع کریں۔',
  },
};

interface ChatAssistantProps {
  onAnalyze: (symptoms: string[]) => void;
}

/** Small round doctor face used as the bot's avatar. */
const BotFace: React.FC<{ talking?: boolean }> = ({ talking }) => (
  <div className="w-9 h-9 rounded-full shrink-0 overflow-hidden bg-gradient-to-b from-cyan-400/30 to-cyan-900/30 border border-cyan-400/40 relative">
    <div className="absolute left-1/2 -translate-x-1/2 top-[2px]"><DoctorAvatar size={52} speaking={talking} /></div>
  </div>
);

const ChatAssistant: React.FC<ChatAssistantProps> = ({ onAnalyze }) => {
  // The language is detected from what the person types (or the device), never chosen by hand.
  const initialLang: Lang = browserPrefersUrdu() ? 'ur' : 'en';

  const [saved, setSaved] = usePersistentState<Saved>(
    'dr_hmf_chat_v1',
    {
      messages: [{ id: 1, role: 'bot', text: greetingText(initialLang), lang: initialLang, chips: ['fever', 'cough', 'headache', 'fatigue'] }],
      selected: [],
      asked: [],
      lang: initialLang,
    },
    'session'
  );
  const { messages, selected, asked, lang } = saved;
  const displayMode: DisplayMode = lang === 'ur' ? 'ur' : browserPrefersUrdu() ? 'both' : 'en';
  const likely = useMemo(() => rankDiseases(selected, 3), [selected]);

  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [speak, setSpeak] = usePersistentState<boolean>('dr_hmf_chat_speak', false);
  const [thinking, setThinking] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef('');
  const nextId = useRef(messages.reduce((m, x) => Math.max(m, x.id), 0) + 1);
  const stateRef = useRef<ChatState>({ selected, asked, lang });
  stateRef.current = { selected, asked, lang };

  const speechSupported = useMemo(() => getSpeechRecognition() !== null, []);

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, thinking]);

  // Stop the mic and any speech if the page is left.
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = useCallback(
    (text: string, l: Lang) => {
      if (!speak || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text.replace(/[⚠️]/g, ''));
        u.lang = SPEECH_LANG[l];
        const voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith(l === 'ur' ? 'ur' : 'en'));
        if (voice) u.voice = voice; // if no Urdu voice is installed the browser falls back to its default
        window.speechSynthesis.speak(u);
      } catch {
        /* speech output is optional */
      }
    },
    [speak]
  );

  /** Apply a bot turn to the saved state and append its messages. */
  const applyTurn = useCallback(
    (turn: BotTurn, userMsg?: Message) => {
      setSaved(prev => {
        const out: Message[] = [...prev.messages];
        if (userMsg) out.push(userMsg);

        const reset = turn.action === 'reset';
        const base = reset ? [] : out;
        const botMsg: Message = {
          id: nextId.current++,
          role: 'bot',
          text: turn.text,
          lang: turn.lang,
          chips: turn.suggestions,
        };
        const withBot = [...base, botMsg];
        if (turn.warning) {
          withBot.push({ id: nextId.current++, role: 'bot', text: turn.warning, lang: turn.lang, warning: true });
        }

        const selectedNext = reset
          ? []
          : [...prev.selected.filter(s => !turn.removed.includes(s)), ...turn.added.filter(s => !prev.selected.includes(s))];
        return {
          messages: withBot,
          selected: selectedNext,
          asked: reset ? [] : Array.from(new Set([...prev.asked, ...turn.suggestions])),
          lang: turn.lang,
        };
      });

      speakText(turn.text, turn.lang);

      if (turn.action === 'analyze') {
        const finalSelected = [
          ...stateRef.current.selected.filter(s => !turn.removed.includes(s)),
          ...turn.added.filter(s => !stateRef.current.selected.includes(s)),
        ];
        // Let the person read the confirmation before the page changes.
        window.setTimeout(() => onAnalyze(finalSelected), 900);
      }
    },
    [onAnalyze, setSaved, speakText]
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || thinking) return;
      const userMsg: Message = { id: nextId.current++, role: 'user', text, lang: stateRef.current.lang };
      setInput('');
      setMicNotice(null);
      setThinking(true);
      // A tiny delay so replies feel conversational rather than instant.
      window.setTimeout(() => {
        applyTurn(respond(text, stateRef.current), userMsg);
        setThinking(false);
      }, 350);
    },
    [applyTurn, thinking]
  );

  const pickSuggestion = (symptom: string) => {
    if (selected.includes(symptom) || thinking) return;
    const userMsg: Message = { id: nextId.current++, role: 'user', text: label(symptom, lang), lang };
    applyTurn(respondToTap(symptom, stateRef.current), userMsg);
  };

  const removeSymptom = (symptom: string) => {
    setSaved(prev => ({ ...prev, selected: prev.selected.filter(s => s !== symptom) }));
  };

  const resetChat = () => {
    window.speechSynthesis?.cancel?.();
    setInput('');
    setMicNotice(null);
    const l = stateRef.current.lang;
    setSaved({
      messages: [{ id: nextId.current++, role: 'bot', text: greetingText(l), lang: l, chips: ['fever', 'cough', 'headache', 'fatigue'] }],
      selected: [],
      asked: [],
      lang: l,
    });
  };

  // --- Voice input -------------------------------------------------------------

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const startListening = () => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setMicNotice(UI.micOff[lang]);
      return;
    }
    window.speechSynthesis?.cancel?.();
    setMicNotice(null);
    finalTranscriptRef.current = '';

    const rec = new Ctor();
    rec.lang = SPEECH_LANG[lang];
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    let errored = false;

    rec.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalTranscriptRef.current += r[0].transcript + ' ';
        else interim += r[0].transcript;
      }
      setInput((finalTranscriptRef.current + interim).trim());
    };

    rec.onerror = e => {
      errored = true;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setMicNotice(UI.micDenied[lang]);
      else if (e.error === 'no-speech') setMicNotice(UI.micNoSpeech[lang]);
      else if (e.error !== 'aborted') setMicNotice(UI.micFail[lang]);
    };

    rec.onend = () => {
      setListening(false);
      recognitionRef.current = null;
      const spoken = finalTranscriptRef.current.trim();
      finalTranscriptRef.current = '';
      if (spoken && !errored) send(spoken);
    };

    try {
      recognitionRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
      setMicNotice(UI.micFail[lang]);
    }
  };

  const lastBotId = [...messages].reverse().find(m => m.role === 'bot' && !m.warning)?.id;
  const rtl = lang === 'ur';

  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#020204] text-white font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-900/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-blue-900/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Title row */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BotFace talking={thinking} />
              <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${rtl ? 'font-urdu' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
                {UI.title[lang]}
              </h2>
            </div>
            <p className={`text-sm text-zinc-500 ${rtl ? 'font-urdu' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
              {UI.subtitle[lang]}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/5 bg-zinc-950/60 text-[11px] font-mono text-zinc-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Auto language: {lang === 'ur' ? 'اردو' : 'English'}</span>
            <button
              type="button"
              onClick={() => {
                if (speak) window.speechSynthesis?.cancel?.();
                setSpeak(!speak);
              }}
              aria-pressed={speak}
              title={speak ? 'Turn off read-aloud' : 'Read replies aloud'}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                speak ? 'bg-cyan-500 text-black border-cyan-400' : 'border-white/5 bg-zinc-950/60 text-zinc-400 hover:text-white'
              }`}
            >
              {speak ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              type="button"
              onClick={resetChat}
              title={UI.reset[lang]}
              className="p-3 rounded-xl border border-white/5 bg-zinc-950/60 text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Conversation */}
          <div className="lg:col-span-8 rounded-[2rem] border border-white/5 bg-gradient-to-b from-zinc-950 to-black overflow-hidden flex flex-col">
            <div
              ref={scrollRef}
              className="h-[58vh] min-h-[360px] overflow-y-auto p-4 sm:p-6 space-y-4"
              aria-live="polite"
            >
              {messages.map(m => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`${m.role === 'bot' && !m.warning ? '' : 'w-8 h-8 rounded-lg shrink-0 flex items-center justify-center'} ${
                      m.role === 'user' ? 'bg-white/10 text-zinc-300' : m.warning ? 'bg-amber-500/20 text-amber-300' : ''
                    }`}
                  >
                    {m.role === 'user' ? <User size={15} /> : m.warning ? <Info size={15} /> : <BotFace />}
                  </div>

                  <div className="max-w-[85%] min-w-0">
                    <p
                      dir="auto"
                      className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap break-words ${
                        /[؀-ۿ]/.test(m.text) ? 'font-urdu text-base' : ''
                      } ${
                        m.role === 'user'
                          ? 'bg-gradient-to-br from-cyan-400 to-cyan-500 text-black rounded-tr-md shadow-[0_6px_20px_rgba(6,182,212,0.25)]'
                          : m.warning
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-100 rounded-tl-md'
                            : 'bg-zinc-900/70 border border-white/10 text-zinc-200 rounded-tl-md backdrop-blur'
                      }`}
                    >
                      {m.text}
                    </p>

                    {m.id === lastBotId && m.chips && m.chips.length > 0 && !thinking && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {m.chips
                          .filter(c => !selected.includes(c))
                          .map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => pickSuggestion(c)}
                              className="px-3 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/15 text-xs text-cyan-200 transition-all cursor-pointer text-left"
                            >
                              <SymptomName symptom={c} mode={displayMode} className="font-mono" />
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {thinking && (
                <div className="flex gap-3">
                  <BotFace talking />
                  <div className="px-4 py-3 rounded-2xl bg-zinc-900/70 border border-white/5 flex items-center gap-1.5" aria-label="typing">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-white/5 p-3 sm:p-4 bg-black/40">
              {!messages.some(m => m.role === 'user') && (
                <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
                  {(rtl
                    ? ['مجھے بخار اور سر درد ہے', 'کھانسی اور گلے میں درد', 'پیٹ میں درد اور الٹی', 'سینے میں درد']
                    : ['I have fever and headache', 'Cough and sore throat', 'Stomach pain and vomiting', 'Skin rash and itching']
                  ).map(q => (
                    <button key={q} type="button" onClick={() => send(q)} className={`shrink-0 px-3.5 py-2 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-200 transition-colors cursor-pointer ${rtl ? 'font-urdu text-sm' : ''}`}>{q}</button>
                  ))}
                </div>
              )}
              {(listening || micNotice) && (
                <p
                  className={`mb-2 text-xs px-1 ${listening ? 'text-cyan-300' : 'text-amber-300'} ${rtl ? 'font-urdu text-sm' : ''}`}
                  dir={rtl ? 'rtl' : 'ltr'}
                  role="status"
                >
                  {listening ? UI.listening[lang] : micNotice}
                </p>
              )}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={listening ? stopListening : startListening}
                  aria-pressed={listening}
                  aria-label={listening ? 'Stop listening' : 'Speak your symptoms'}
                  title={speechSupported ? (lang === 'ur' ? 'اردو میں بولیں' : 'Speak in English') : UI.micOff[lang]}
                  className={`relative p-3.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    listening
                      ? 'bg-red-500 border-red-400 text-white'
                      : speechSupported
                        ? 'bg-zinc-900 border-white/10 text-cyan-300 hover:bg-zinc-800'
                        : 'bg-zinc-900/50 border-white/5 text-zinc-600'
                  }`}
                >
                  {listening && <span className="absolute inset-0 rounded-xl bg-red-500/40 animate-ping" />}
                  {speechSupported ? <Mic size={18} className="relative" /> : <MicOff size={18} className="relative" />}
                </button>

                <input
                  type="text"
                  dir="auto"
                  lang={lang}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={UI.placeholder[lang]}
                  className={`flex-1 min-w-0 bg-zinc-950 border border-white/10 rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 ${
                    /[؀-ۿ]/.test(input) || (!input && rtl) ? 'font-urdu text-base' : ''
                  }`}
                />

                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  aria-label="Send"
                  className="p-3.5 rounded-xl bg-cyan-500 text-black disabled:bg-zinc-900 disabled:text-zinc-600 hover:bg-white transition-all cursor-pointer shrink-0"
                >
                  <Send size={18} className={rtl ? 'rotate-180' : ''} />
                </button>
              </form>
            </div>
          </div>

          {/* Collected symptoms */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
            <div className="p-6 rounded-[2rem] bg-gradient-to-b from-zinc-950 to-black border border-white/5">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
                <h3 className={`font-black tracking-tight flex items-center gap-2 ${rtl ? 'font-urdu text-lg' : 'uppercase text-sm'}`} dir={rtl ? 'rtl' : 'ltr'}>
                  <ListChecks size={16} className="text-cyan-400" /> {UI.selected[lang]}
                </h3>
                <span className="px-3 py-1 bg-zinc-900 border border-white/5 font-mono text-[10px] text-zinc-400 rounded-md">{selected.length}</span>
              </div>

              <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {selected.length === 0 ? (
                    <p className={`text-sm text-zinc-600 py-6 text-center ${rtl ? 'font-urdu' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
                      {UI.none[lang]}
                    </p>
                  ) : (
                    selected.map(s => (
                      <motion.div
                        key={s}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between gap-2 p-3 bg-zinc-900/40 rounded-xl border border-white/[0.04] text-xs"
                      >
                        <span className="min-w-0 flex-1">
                          <SymptomName symptom={s} mode={displayMode} className="font-mono text-zinc-200" />
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSymptom(s)}
                          aria-label={`Remove ${s}`}
                          className="w-6 h-6 shrink-0 flex items-center justify-center text-zinc-500 hover:text-cyan-300 hover:bg-white/5 rounded-md transition-all cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                disabled={selected.length === 0}
                onClick={() => onAnalyze(selected)}
                className={`group w-full py-4 bg-cyan-500 disabled:bg-zinc-900 text-black disabled:text-zinc-600 font-black rounded-xl transition-all hover:bg-white active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer ${
                  rtl ? 'font-urdu text-base' : 'uppercase tracking-[0.2em] text-xs'
                }`}
              >
                {UI.analyze[lang]}
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            <div className="p-5 rounded-[2rem] bg-gradient-to-b from-zinc-950 to-black border border-white/5">
              <h3 className={`font-black tracking-tight flex items-center gap-2 mb-4 ${rtl ? 'font-urdu text-lg' : 'uppercase text-sm'}`} dir={rtl ? 'rtl' : 'ltr'}>
                <Activity size={16} className="text-cyan-400" /> {rtl ? 'ممکنہ بیماریاں (لائیو)' : 'Likely conditions (live)'}
              </h3>
              {likely.length === 0 ? (
                <p className={`text-sm text-zinc-600 text-center py-3 ${rtl ? 'font-urdu' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>{rtl ? 'علامات بتائیں تو یہاں اندازہ نظر آئے گا۔' : 'Tell me a symptom and a live estimate appears here.'}</p>
              ) : (
                <ul className="space-y-3">
                  {likely.map(r => (
                    <li key={r.disease}>
                      <div className="flex justify-between text-xs mb-1"><span className="capitalize text-zinc-200 font-semibold truncate pr-2">{r.disease}</span><span className="font-mono text-zinc-400">{r.match}%</span></div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden"><motion.div className={`h-full ${matchStrength(r.match) === 'strong' ? 'bg-emerald-400' : matchStrength(r.match) === 'moderate' ? 'bg-amber-400' : 'bg-orange-400'}`} initial={{ width: 0 }} animate={{ width: `${r.match}%` }} transition={{ duration: 0.5 }} /></div>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 flex items-start gap-2 text-[10px] text-zinc-600 leading-snug"><ShieldCheck size={12} className="shrink-0 mt-0.5" />{rtl ? 'یہ علامات کی مطابقت ہے، تشخیص نہیں۔ اس کے بعد "تجزیہ کریں" دبائیں۔' : 'Symptom match only, not a diagnosis. Press Analyze for the full report.'}</p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-zinc-950 rounded-2xl border border-white/5">
              <Info className="text-cyan-500/60 shrink-0 mt-0.5" size={14} />
              <p className={`text-[11px] text-zinc-500 leading-relaxed ${rtl ? 'font-urdu text-sm' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
                {UI.disclaimer[lang]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
