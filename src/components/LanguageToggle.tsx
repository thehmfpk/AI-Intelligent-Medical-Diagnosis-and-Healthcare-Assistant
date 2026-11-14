import React from 'react';
import { Languages } from 'lucide-react';
import { DisplayMode } from '../data/symptomTranslations';

interface LanguageToggleProps {
  mode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
  /** Hide the "both" option (e.g. for the chat reply language). */
  allowBoth?: boolean;
  className?: string;
}

const OPTIONS: { id: DisplayMode; label: string; urdu?: boolean }[] = [
  { id: 'en', label: 'English' },
  { id: 'ur', label: 'اردو', urdu: true },
  { id: 'both', label: 'EN + اردو' },
];

const LanguageToggle: React.FC<LanguageToggleProps> = ({ mode, onChange, allowBoth = true, className = '' }) => (
  <div
    role="group"
    aria-label="Symptom language"
    className={`inline-flex items-center gap-1 p-1 rounded-xl border border-white/5 bg-zinc-950/60 ${className}`}
  >
    <Languages size={14} className="text-cyan-400 mx-2 shrink-0" aria-hidden />
    {OPTIONS.filter(o => allowBoth || o.id !== 'both').map(o => (
      <button
        key={o.id}
        type="button"
        onClick={() => onChange(o.id)}
        aria-pressed={mode === o.id}
        className={`px-3 py-2 rounded-lg text-[11px] font-mono font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
          o.urdu ? 'font-urdu text-sm' : ''
        } ${
          mode === o.id
            ? 'bg-cyan-500 text-black shadow-[0_0_16px_rgba(6,182,212,0.25)]'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export default LanguageToggle;
