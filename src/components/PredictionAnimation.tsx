import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import DoctorAvatar from './DoctorAvatar';

interface Props {
  symptomCount: number;
  onDone: () => void;
  duration?: number;
}

const STEPS = [
  { en: 'Reading your symptoms', ur: 'آپ کی علامات پڑھی جا رہی ہیں' },
  { en: 'Comparing with known conditions', ur: 'معلوم بیماریوں سے موازنہ' },
  { en: 'Preparing your report', ur: 'آپ کی رپورٹ تیار ہو رہی ہے' },
];

/** Full-screen overlay: the doctor rises on screen, types, and hands over to the result. */
const PredictionAnimation: React.FC<Props> = ({ symptomCount, onDone, duration = 3400 }) => {
  const [step, setStep] = React.useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const t = window.setTimeout(onDone, reduce ? 600 : duration);
    const s1 = window.setTimeout(() => setStep(1), duration / 3);
    const s2 = window.setTimeout(() => setStep(2), (duration / 3) * 2);
    return () => { clearTimeout(t); clearTimeout(s1); clearTimeout(s2); };
  }, [onDone, duration]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(34,211,238,0.14),transparent_60%)]" />
      <div className="relative w-full max-w-md px-6 flex flex-col items-center">
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 70, damping: 14 }}
          className="relative"
        >
          <DoctorAvatar size={210} typing speaking={false} />
          {/* laptop the doctor types on */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-56">
            <div className="h-24 rounded-t-xl border border-cyan-400/40 bg-zinc-900 relative overflow-hidden">
              <div className="absolute inset-2 space-y-1.5">
                {[70, 92, 55, 80].map((w, i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 rounded bg-cyan-400/60"
                    initial={{ width: 0 }}
                    animate={{ width: `${w}%` }}
                    transition={{ delay: 0.5 + i * 0.35, duration: 0.5 }}
                  />
                ))}
              </div>
              <div className="absolute left-0 right-0 h-px bg-cyan-300/80 shadow-[0_0_10px_#22d3ee] animate-[scan-line_1.4s_linear_infinite_alternate]" />
            </div>
            <div className="h-2 rounded-b-md bg-zinc-700" />
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-white font-bold text-lg">{STEPS[step].en}</p>
          <p className="font-urdu text-cyan-300 text-base mt-1" dir="rtl">{STEPS[step].ur}</p>
          <p className="text-zinc-500 text-xs font-mono mt-3">{symptomCount} symptom{symptomCount === 1 ? '' : 's'}</p>
        </div>
        <div className="mt-5 w-56 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-cyan-400"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: duration / 1000, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionAnimation;
