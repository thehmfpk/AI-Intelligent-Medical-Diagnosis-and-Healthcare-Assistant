import React from 'react';
import { DisplayMode, englishLabel, urduLabel } from '../data/symptomTranslations';

interface SymptomNameProps {
  symptom: string;
  mode: DisplayMode;
  /** Classes for the English line (font, colour, size come from the parent). */
  className?: string;
}

/** Shows a symptom in English, Urdu, or both (English on top, Urdu underneath). */
const SymptomName: React.FC<SymptomNameProps> = ({ symptom, mode, className = '' }) => {
  if (mode === 'ur') {
    return (
      <span dir="rtl" lang="ur" className={`font-urdu text-[1.2em] truncate min-w-0 ${className}`}>
        {urduLabel(symptom)}
      </span>
    );
  }
  if (mode === 'en') {
    return <span className={`truncate min-w-0 ${className}`}>{englishLabel(symptom)}</span>;
  }
  return (
    <span className="flex flex-col min-w-0">
      <span className={`truncate ${className}`}>{englishLabel(symptom)}</span>
      <span dir="rtl" lang="ur" className="font-urdu truncate text-[14px] leading-snug text-cyan-300/80 text-right">
        {urduLabel(symptom)}
      </span>
    </span>
  );
};

export default SymptomName;
