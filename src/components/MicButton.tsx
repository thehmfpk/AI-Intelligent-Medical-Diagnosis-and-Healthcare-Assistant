import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { SpeechLang, defaultSpeechLang } from '../lib/useSpeechInput';

interface Props {
  supported: boolean;
  listening: boolean;
  onStart: (lang: SpeechLang) => void;
  onStop: () => void;
  className?: string;
}

/** Mic button with a tiny EN / اردو chooser for the spoken language (defaults to the device language). */
const MicButton: React.FC<Props> = ({ supported, listening, onStart, onStop, className = '' }) => {
  const [lang, setLang] = useState<SpeechLang>(defaultSpeechLang);
  return (
    <div className={`flex items-center gap-1 shrink-0 ${className}`}>
      <button type="button" disabled={listening} onClick={() => setLang(l => (l === 'en' ? 'ur' : 'en'))}
        title="Language you will speak in" aria-label={`Speaking language: ${lang === 'ur' ? 'Urdu' : 'English'}. Tap to change`}
        className="px-2 py-1.5 rounded-lg border border-white/10 bg-zinc-900/60 text-[10px] font-bold text-zinc-300 hover:text-cyan-300 cursor-pointer disabled:opacity-50">
        {lang === 'ur' ? 'اردو' : 'EN'}
      </button>
      <button type="button" onClick={listening ? onStop : () => onStart(lang)} aria-pressed={listening}
        aria-label={listening ? 'Stop listening' : 'Speak your symptoms'}
        title={supported ? (lang === 'ur' ? 'اردو میں بولیں' : 'Speak in English') : 'Voice input needs Chrome or Edge'}
        className={`relative p-3 rounded-xl border transition-all cursor-pointer ${listening ? 'bg-red-500 border-red-400 text-white' : supported ? 'bg-zinc-900 border-white/10 text-cyan-300 hover:bg-zinc-800' : 'bg-zinc-900/50 border-white/5 text-zinc-600'}`}>
        {listening && <span className="absolute inset-0 rounded-xl bg-red-500/40 animate-ping" />}
        {supported ? <Mic size={16} className="relative" /> : <MicOff size={16} className="relative" />}
      </button>
    </div>
  );
};

export default MicButton;
