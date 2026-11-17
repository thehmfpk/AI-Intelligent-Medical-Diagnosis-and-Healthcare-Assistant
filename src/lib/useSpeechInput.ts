import { useCallback, useEffect, useRef, useState } from 'react';
import { browserPrefersUrdu } from './autoLanguage';

interface Alt { transcript: string }
interface Res { isFinal: boolean; 0: Alt }
interface Ev { resultIndex: number; results: ArrayLike<Res> }
interface Rec {
  lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
  onresult: ((e: Ev) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null;
  start: () => void; stop: () => void; abort: () => void;
}
type Ctor = new () => Rec;

const getCtor = (): Ctor | null => {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

export type SpeechLang = 'en' | 'ur';
export const SPEECH_CODE: Record<SpeechLang, string> = { en: 'en-US', ur: 'ur-PK' };
export const defaultSpeechLang = (): SpeechLang => (browserPrefersUrdu() ? 'ur' : 'en');

/**
 * Browser speech-to-text (Web Speech API; Chrome and Edge). Calls `onFinal`
 * once with everything heard when the person stops speaking.
 */
export function useSpeechInput(onFinal: (text: string) => void) {
  const supported = getCtor() !== null;
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Rec | null>(null);
  const finalRef = useRef('');
  const cb = useRef(onFinal);
  cb.current = onFinal;

  const stop = useCallback(() => recRef.current?.stop(), []);

  const start = useCallback((lang: SpeechLang) => {
    const C = getCtor();
    if (!C) { setError('Voice input is not supported in this browser. Please use Chrome or Edge.'); return; }
    setError(null); setInterim(''); finalRef.current = '';
    const rec = new C();
    rec.lang = SPEECH_CODE[lang]; rec.continuous = false; rec.interimResults = true; rec.maxAlternatives = 1;
    let failed = false;
    rec.onresult = e => {
      let part = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalRef.current += r[0].transcript + ' '; else part += r[0].transcript;
      }
      setInterim((finalRef.current + part).trim());
    };
    rec.onerror = e => {
      failed = true;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setError('Microphone access is blocked. Allow it in your browser settings.');
      else if (e.error === 'no-speech') setError("I didn't hear anything. Tap the mic and try again.");
      else if (e.error !== 'aborted') setError("Voice input didn't work. Please try again or type.");
    };
    rec.onend = () => {
      setListening(false); setInterim(''); recRef.current = null;
      const text = finalRef.current.trim(); finalRef.current = '';
      if (text && !failed) cb.current(text);
    };
    try { recRef.current = rec; rec.start(); setListening(true); }
    catch { setListening(false); setError("Voice input didn't work. Please try again or type."); }
  }, []);

  useEffect(() => () => recRef.current?.abort(), []);
  return { supported, listening, interim, error, start, stop, clearError: () => setError(null) };
}
