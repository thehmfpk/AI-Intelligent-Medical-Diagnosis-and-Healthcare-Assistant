import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, AlertTriangle, RefreshCw, X, Plus, CalendarCheck, Stethoscope, Pill, CalendarClock, ShieldCheck, RotateCcw, Search,
} from 'lucide-react';
import { medicalEncyclopedia, symptomCategories } from '../data/medicalData';
import { RankedDisease, matchStrength } from '../lib/predictor';
import { describeAll } from '../lib/medicineGuide';
import { hasRedFlag, symptomMatchesQuery, extractSymptoms } from '../lib/symptomMatcher';
import { useSpeechInput } from '../lib/useSpeechInput';
import MicButton from './MicButton';
import SymptomName from './SymptomName';
import MedicineImage from './MedicineImage';
import FollowUpTimeline from './FollowUpTimeline';

interface Props {
  symptoms: string[];
  ranking: RankedDisease[];
  onRerun: (symptoms: string[]) => void;
  onCheckMedication: (d: string) => void;
  onBook: () => void;
  onNewCheckup: () => void;
  history: { disease: string; date: string; symptoms: number }[];
}

const ALL = Object.values(symptomCategories).flat() as string[];
const titleCase = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase());
const findInfo = (d: string) => medicalEncyclopedia[Object.keys(medicalEncyclopedia).find(k => k.toLowerCase() === d.toLowerCase()) ?? ''];

const STRENGTH = {
  strong: { text: 'Strong match', cls: 'text-emerald-400', ring: '#34d399' },
  moderate: { text: 'Moderate match', cls: 'text-amber-400', ring: '#fbbf24' },
  weak: { text: 'Weak match', cls: 'text-orange-400', ring: '#fb923c' },
};

const ResultPage: React.FC<Props> = ({ symptoms, ranking, onRerun, onCheckMedication, onBook, onNewCheckup, history }) => {
  const [pick, setPick] = useState(0);
  const [edit, setEdit] = useState<string[]>(symptoms);
  const [q, setQ] = useState('');
  // Reset the editor when a new prediction arrives
  React.useEffect(() => { setEdit(symptoms); setPick(0); }, [symptoms, ranking]);

  const mic = useSpeechInput(text => setEdit(e => [...e, ...extractSymptoms(text).found.filter(f => !e.includes(f))]));

  const current = ranking[pick];
  const info = current ? findInfo(current.disease) : undefined;
  const items = useMemo(() => (info ? describeAll(info.Medication) : []), [info]);
  const changed = edit.length !== symptoms.length || edit.some(s => !symptoms.includes(s));
  const suggestions = useMemo(() => (q.trim() ? ALL.filter(s => !edit.includes(s) && symptomMatchesQuery(s, q)).slice(0, 6) : []), [q, edit]);

  if (!current) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#020204] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <Stethoscope className="mx-auto text-cyan-400 mb-4" size={40} />
          <h2 className="text-2xl font-black mb-2">No prediction yet</h2>
          <p className="text-zinc-400 mb-6">Start a checkup and tell the doctor how you feel.</p>
          <button onClick={onNewCheckup} className="px-8 py-4 bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-white cursor-pointer">Let's Begin Checkup</button>
        </div>
      </div>
    );
  }

  const st = STRENGTH[matchStrength(current.match)];
  const circ = 2 * Math.PI * 42;

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#020204] text-white">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {hasRedFlag(symptoms) && (
          <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-5 flex gap-3" role="alert">
            <AlertTriangle className="text-red-400 shrink-0" />
            <p className="text-sm text-red-200"><b>Some of your symptoms can be serious.</b> Do not wait: call Rescue 1122 or Edhi 115, or go to the nearest emergency room. / آپ کی کچھ علامات سنگین ہو سکتی ہیں، فوراً 1122 یا 115 پر کال کریں۔</p>
          </div>
        )}

        {/* Top result */}
        <motion.section key={current.disease} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-zinc-950/50 p-6 md:p-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400 font-black mb-2">{pick === 0 ? 'Most likely condition' : `Option ${pick + 1}`}</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter capitalize leading-none">{current.disease}</h2>
            {info && <p className="text-zinc-400 mt-4 max-w-2xl leading-relaxed">{info.Description}</p>}
            <div className="mt-5 flex flex-wrap gap-2">
              {current.matched.map(s => (<span key={s} className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]"><span className="inline-flex items-center gap-1.5">✓ <SymptomName symptom={s} mode="both" /></span></span>))}
              {current.unexplained.map(s => (<span key={s} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[11px]" title="Not usually listed for this condition"><SymptomName symptom={s} mode="both" /></span>))}
            </div>
            {current.missing.length > 0 && <p className="text-[12px] text-zinc-500 mt-3">Also common with this condition, and worth checking: {current.missing.slice(0, 5).join(', ')}.</p>}
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="9" />
                <motion.circle cx="50" cy="50" r="42" fill="none" stroke={st.ring} strokeWidth="9" strokeLinecap="round" strokeDasharray={circ}
                  initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - current.match / 100) }} transition={{ duration: 1, ease: 'easeOut' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-black">{current.match}%</span><span className="text-[9px] font-mono uppercase text-zinc-500">symptom match</span></div>
            </div>
            <p className={`mt-2 text-xs font-bold ${st.cls}`}>{st.text}</p>
          </div>
        </motion.section>

        {/* Other possibilities + edit symptoms */}
        <div className="grid lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6">
            <h3 className="font-black uppercase tracking-tight mb-4 flex items-center gap-2"><Stethoscope size={16} className="text-cyan-400" />Other possibilities</h3>
            <div className="space-y-2">
              {ranking.map((r, i) => (
                <button key={r.disease} onClick={() => setPick(i)} aria-pressed={i === pick}
                  className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-colors ${i === pick ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/10 hover:bg-white/5'}`}>
                  <div className="flex justify-between items-center"><span className="font-bold capitalize">{r.disease}</span><span className="text-xs font-mono text-zinc-400">{r.match}%</span></div>
                  <div className="h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden"><div className="h-full bg-cyan-400" style={{ width: `${r.match}%` }} /></div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-zinc-500 mt-3 leading-relaxed">The percentage shows how well your symptoms fit each condition's usual symptom list. It is not a probability of having the disease.</p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6">
            <h3 className="font-black uppercase tracking-tight mb-4 flex items-center gap-2"><RefreshCw size={16} className="text-cyan-400" />Your symptoms</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {edit.map(s => (
                <span key={s} className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs">
                  <SymptomName symptom={s} mode="both" /><button aria-label={`Remove ${s}`} onClick={() => setEdit(e => e.filter(x => x !== s))} className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer"><X size={11} /></button>
                </span>
              ))}
              {edit.length === 0 && <span className="text-sm text-zinc-500">Add at least one symptom.</span>}
            </div>
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10"><MicButton supported={mic.supported} listening={mic.listening} onStart={mic.start} onStop={mic.stop} /></div>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Add a symptom (type or speak)" className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-2.5 pl-9 pr-32 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50" />
              {suggestions.length > 0 && (
                <ul className="absolute z-20 left-0 right-0 mt-1 rounded-xl border border-white/10 bg-zinc-950 shadow-xl overflow-hidden">
                  {suggestions.map(s => (<li key={s}><button onClick={() => { setEdit(e => [...e, s]); setQ(''); }} className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 flex items-center gap-2 cursor-pointer"><Plus size={12} className="text-cyan-400 shrink-0" /><SymptomName symptom={s} mode="both" /></button></li>))}
                </ul>
              )}
            </div>
            {mic.listening && <p className="text-cyan-300 text-xs mb-2" role="status">Listening… {mic.interim}</p>}
            {!mic.listening && mic.error && <p className="text-amber-300 text-xs mb-2" role="alert">{mic.error}</p>}
            <button disabled={edit.length === 0} onClick={() => onRerun(edit)}
              className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${changed ? 'bg-cyan-500 text-black hover:bg-white' : 'border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10'}`}>
              <RotateCcw size={14} />{changed ? 'Re-run prediction with changes' : 'Re-run prediction'}
            </button>
            <button onClick={onNewCheckup} className="w-full mt-2 py-3 rounded-xl border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/5 cursor-pointer">Start a new checkup</button>
          </section>
        </div>

        {/* Medicine map */}
        {info && (
          <section className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6 md:p-8">
            <h3 className="font-black uppercase tracking-tight mb-1 flex items-center gap-2"><Pill size={16} className="text-cyan-400" />Medicine map</h3>
            <p className="text-sm text-zinc-400 mb-6">What is usually suggested for <b className="capitalize text-white">{current.disease}</b>, and what each one is for.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {items.map(i => (
                <div key={i.raw} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="shrink-0"><MedicineImage form={i.profile.form} color={i.profile.color} size={64} /></div>
                  <div className="min-w-0">
                    <p className="font-bold leading-tight">{i.name}</p>
                    {i.examples.length > 0 && <p className="text-[11px] text-zinc-500">e.g. {i.examples.join(', ')}</p>}
                    <p className="text-[11px] font-mono uppercase tracking-wider mt-1" style={{ color: i.profile.color }}>{i.profile.label}</p>
                    <p className="text-[13px] text-zinc-300 mt-1 leading-snug">For: {i.profile.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Follow-up */}
        {info && (
          <section className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6 md:p-8">
            <h3 className="font-black uppercase tracking-tight mb-1 flex items-center gap-2"><CalendarClock size={16} className="text-cyan-400" />Follow-up plan: when to take what</h3>
            <p className="text-sm text-zinc-400 mb-6">A general daily rhythm for these kinds of medicine. Your doctor's or pharmacist's instructions always come first.</p>
            <FollowUpTimeline items={items} />
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {[info.Precaution_1, info.Precaution_2, info.Precaution_3, info.Precaution_4].filter(Boolean).map(p => (
                <div key={p} className="flex gap-2 text-sm text-zinc-300"><ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />{titleCase(p)}</div>
              ))}
            </div>
            <p className="mt-6 text-[12px] text-zinc-500">See a doctor if you are not improving in 2 to 3 days, or sooner if you get worse.</p>
          </section>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => onCheckMedication(current.disease)} className="flex-1 px-6 py-5 bg-cyan-500 hover:bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-3 cursor-pointer group">
            Treatment, pharmacy and medical slip <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={onBook} className="flex-1 px-6 py-5 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-3 cursor-pointer"><CalendarCheck size={14} />Book an appointment</button>
        </div>

        <p className="text-[11px] text-zinc-600 text-center leading-relaxed max-w-3xl mx-auto">
          This is a symptom-matching tool for information only. It is not a diagnosis or a prescription. Last checks: {history.length}.
        </p>
      </div>
    </div>
  );
};

export default ResultPage;
