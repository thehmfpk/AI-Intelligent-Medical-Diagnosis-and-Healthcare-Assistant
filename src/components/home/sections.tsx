import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mic, Languages, MessageSquare, Pill, FileText, Stethoscope, Wind, ClipboardList, Search, HeartPulse, Sparkles, Activity, Printer } from 'lucide-react';
import { Band, Head, Reveal } from './ui';
import type { Page } from '../Header';

/* ---------------------------------------------------------------- ticker */
const TICK = [
  { i: <Stethoscope size={14} />, t: '230 symptoms' },
  { i: <Activity size={14} />, t: '100 conditions' },
  { i: <Languages size={14} />, t: 'English · اردو · Roman Urdu' },
  { i: <Mic size={14} />, t: 'Voice input' },
  { i: <Pill size={14} />, t: 'Medicine guide' },
  { i: <Printer size={14} />, t: 'Printable slip' },
  { i: <Wind size={14} />, t: 'Live AQI map' },
  { i: <HeartPulse size={14} />, t: 'Health risk check' },
];

export const Ticker: React.FC = () => (
  <div className="hs-ticker relative w-full overflow-hidden border-y border-white/10 bg-cyan-500/[0.06] py-4" aria-label="What Dr.HMF offers">
    <div className="hs-marquee">
      {[0, 1].map(k => (
        <ul key={k} className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={k === 1}>
          {TICK.map(x => (
            <li key={x.t} className="flex items-center gap-2.5 whitespace-nowrap text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-300">
              <span className="text-cyan-400">{x.i}</span><span className={/[؀-ۿ]/.test(x.t) ? '' : ''}>{x.t}</span><span className="text-cyan-500/40 ml-6">◆</span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  </div>
);

/* ----------------------------------------------------------- how it works */
interface NavProps { onNavigate: (p: Page) => void; onStart: () => void }

export const HowItWorks: React.FC<NavProps> = ({ onNavigate, onStart }) => {
  const steps = [
    { n: '01', icon: <ClipboardList size={26} />, t: 'Tell Dr.HMF', d: 'Type or speak how you feel in English, اردو or Roman Urdu, or pick from 230 symptoms.', cta: 'Start checkup', go: onStart },
    { n: '02', icon: <Search size={26} />, t: 'See what matches', d: 'Get the most likely conditions ranked, with the symptoms that matched and what to do next.', cta: 'Try the AI chat', go: () => onNavigate('chat') },
    { n: '03', icon: <Pill size={26} />, t: 'Get a plan', d: 'A simple medicine guide, a follow-up timeline, nearby pharmacies and a printable slip.', cta: 'Start checkup', go: onStart },
    { n: '04', icon: <Wind size={26} />, t: 'Stay safe outside', d: 'Check live air quality and your personal risk before you step out.', cta: 'Open AQI map', go: () => onNavigate('aqi') },
  ];
  return (
    <Band tone="a" id="how">
      <Head title="Four steps." accent="One clear answer." sub="No sign-up, no waiting room. Describe how you feel and Dr.HMF does the rest." />
      <div className="relative">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} className="h-full">
              <li className="hs-card h-full p-6 sm:p-7 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <span className="w-14 h-14 rounded-2xl bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">{s.icon}</span>
                  <span className="hs-outline text-5xl font-black italic">{s.n}</span>
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-2">{s.t}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed flex-1">{s.d}</p>
                <button onClick={s.go} className="mt-6 self-start text-[11px] font-black uppercase tracking-widest text-cyan-400 hover:text-white flex items-center gap-2 cursor-pointer group">
                  {s.cta} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Band>
  );
};

/* --------------------------------------------------------------- features */
const Chip: React.FC<{ en: string; ur?: string }> = ({ en, ur }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">{en}{ur && <span className="font-urdu text-[13px] text-cyan-200/80">{ur}</span>}</span>
);

export const Features: React.FC<NavProps> = ({ onNavigate, onStart }) => (
  <Band tone="b" id="features">
    <Head title="Everything for a health check," accent="in one place." />
    <div className="grid gap-5 lg:grid-cols-12">
      {/* symptom checker */}
      <Reveal className="lg:col-span-7">
        <div className="hs-card h-full p-6 sm:p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-3"><Stethoscope className="text-cyan-400" size={26} /><h3 className="text-2xl font-black uppercase italic tracking-tight">Symptom checker</h3></div>
          <p className="text-sm text-zinc-400 max-w-lg">Pick or say your symptoms. Dr.HMF compares them with 100 conditions and ranks the closest matches.</p>
          <div className="mt-6 flex flex-wrap gap-2"><Chip en="Fever" ur="بخار" /><Chip en="Cough" ur="کھانسی" /><Chip en="Headache" ur="سر درد" /><Chip en="Sore throat" ur="گلے میں درد" /><Chip en="Fatigue" ur="تھکاوٹ" /></div>
          <div className="mt-6 space-y-3" aria-label="Example of ranked results">
            {[['Closest match', 'w-[88%]', 'bg-cyan-400'], ['Possible', 'w-[62%]', 'bg-sky-400'], ['Less likely', 'w-[38%]', 'bg-indigo-400']].map(([l, w, c]) => (
              <div key={l} className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-zinc-500"><span className="w-24 shrink-0">{l}</span><span className="h-2.5 flex-1 rounded-full bg-white/5 overflow-hidden"><span className={`block h-full rounded-full ${w} ${c}`} /></span></div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-zinc-500">Illustration of how results are ranked.</p>
          <button onClick={onStart} className="mt-auto pt-6 self-start text-[11px] font-black uppercase tracking-widest text-cyan-400 hover:text-white flex items-center gap-2 cursor-pointer group">Check my symptoms <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" /></button>
        </div>
      </Reveal>

      {/* languages */}
      <Reveal delay={0.08} className="lg:col-span-5">
        <div className="hs-card h-full p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3"><Languages className="text-cyan-400" size={26} /><h3 className="text-2xl font-black uppercase italic tracking-tight">Your language</h3></div>
          <p className="text-sm text-zinc-400">Understands English, اردو and Roman Urdu, and shows Urdu names under every symptom.</p>
          <div className="mt-6 space-y-3">
            <p className="rounded-2xl bg-white/[0.05] px-4 py-3 text-sm text-zinc-200">I have a fever and a sore throat</p>
            <p className="rounded-2xl bg-white/[0.05] px-4 py-3 text-base font-urdu text-zinc-200" dir="rtl">مجھے بخار اور گلے میں درد ہے</p>
            <p className="rounded-2xl bg-white/[0.05] px-4 py-3 text-sm text-zinc-200">Mujhe bukhar aur gale mein dard hai</p>
          </div>
        </div>
      </Reveal>

      {/* voice */}
      <Reveal delay={0.04} className="lg:col-span-4">
        <div className="hs-card h-full p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3"><Mic className="text-cyan-400" size={26} /><h3 className="text-2xl font-black uppercase italic tracking-tight">Voice input</h3></div>
          <p className="text-sm text-zinc-400">Just speak. Works in Chrome and Edge.</p>
          <div className="mt-7 flex items-end justify-center gap-1.5 h-20" aria-hidden>
            {[40, 70, 100, 60, 85, 45, 75, 55, 90, 50, 65].map((h, i) => <span key={i} className="hero-bar w-2 rounded-full bg-gradient-to-t from-cyan-500 to-sky-300" style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }} />)}
          </div>
        </div>
      </Reveal>

      {/* chat */}
      <Reveal delay={0.08} className="lg:col-span-4">
        <div className="hs-card h-full p-6 sm:p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-3"><MessageSquare className="text-cyan-400" size={26} /><h3 className="text-2xl font-black uppercase italic tracking-tight">AI chat</h3></div>
          <p className="text-sm text-zinc-400">Talk to the AI doctor in plain sentences and watch likely conditions update live.</p>
          <div className="mt-5 space-y-2 text-sm">
            <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-cyan-500 px-4 py-2 text-black font-medium">I feel dizzy since morning</p>
            <p className="max-w-[90%] rounded-2xl rounded-bl-sm bg-white/[0.07] px-4 py-2 text-zinc-200">Noted dizziness. Any headache or nausea?</p>
          </div>
          <button onClick={() => onNavigate('chat')} className="mt-auto pt-5 self-start text-[11px] font-black uppercase tracking-widest text-cyan-400 hover:text-white flex items-center gap-2 cursor-pointer group">Open AI chat <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" /></button>
        </div>
      </Reveal>

      {/* medicine & slip */}
      <Reveal delay={0.12} className="lg:col-span-4">
        <div className="hs-card h-full p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3"><FileText className="text-cyan-400" size={26} /><h3 className="text-2xl font-black uppercase italic tracking-tight">Medicine guide & slip</h3></div>
          <p className="text-sm text-zinc-400">General medicine information, a follow-up timeline, nearby pharmacies and a printable A4 slip to show your doctor.</p>
          <div className="mt-6 flex items-center gap-3 text-cyan-300"><span className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center"><Pill size={22} /></span><span className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center"><Sparkles size={22} /></span><span className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center"><Printer size={22} /></span></div>
          <p className="mt-4 text-[11px] text-zinc-500">General guidance only. Not a prescription.</p>
        </div>
      </Reveal>
    </div>
  </Band>
);
