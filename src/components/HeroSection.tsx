import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wind, Mic, Languages, HeartPulse, ShieldCheck, Sparkles, Send } from 'lucide-react';
import DoctorAvatar from './DoctorAvatar';

interface Props { onStart: () => void; onAqi: () => void; }

const WORDS = [
  { text: 'English', cls: '' },
  { text: 'اردو', cls: 'font-urdu' },
  { text: 'Roman Urdu', cls: '' },
];

// Looping demo conversation shown in the chat card (illustration, not live data).
const DEMOS = [
  { user: 'mujhe bukhar aur sar dard hai', chips: [['Fever', 'بخار'], ['Headache', 'سر درد']], bot: 'Noted. Anything else you feel?', botUr: 'نوٹ کر لیا۔ کیا کچھ اور بھی محسوس ہو رہا ہے؟' },
  { user: 'I have a dry cough and sore throat', chips: [['Cough', 'کھانسی'], ['Sore throat', 'گلے میں درد']], bot: 'Got it. Any fever or body ache?', botUr: 'ٹھیک ہے۔ بخار یا جسم میں درد؟' },
];

const ease = [0.16, 1, 0.3, 1] as const;
const up = (d = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease } } });

const ChatDemo: React.FC = () => {
  const [demo, setDemo] = useState(0);
  const [step, setStep] = useState(0); // 0 empty, 1 user, 2 typing, 3 reply
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setStep(3); return; }
    const plan: [number, number][] = [[1, 600], [2, 1700], [3, 3000], [0, 7200]];
    const timers = plan.map(([s, t]) => window.setTimeout(() => { setStep(s); if (s === 0) setDemo(d => (d + 1) % DEMOS.length); }, t));
    const loop = window.setTimeout(() => setStep(s => s), 0);
    return () => { timers.forEach(clearTimeout); clearTimeout(loop); };
  }, [demo]);
  const d = DEMOS[demo];

  return (
    <div className="w-[min(88vw,330px)] rounded-3xl border border-cyan-400/25 bg-zinc-950/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-cyan-500/15 to-transparent">
        <span className="relative flex w-2.5 h-2.5"><span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-70 animate-ping" /><span className="relative w-2.5 h-2.5 rounded-full bg-emerald-400" /></span>
        <span className="text-xs font-black tracking-wide text-white">Dr.HMF Assistant</span>
        <span className="ml-auto text-[9px] font-mono uppercase tracking-widest text-zinc-500">live demo</span>
      </div>
      <div className="px-4 py-4 h-[170px] flex flex-col justify-end gap-2.5 text-[13px]">
        <AnimatePresence mode="popLayout">
          {step >= 1 && (
            <motion.div key={`u${demo}`} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="self-end max-w-[85%] px-3.5 py-2 rounded-2xl rounded-tr-md bg-gradient-to-br from-cyan-400 to-cyan-500 text-black font-medium">{d.user}</motion.div>
          )}
          {step === 2 && (
            <motion.div key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="self-start px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.06] border border-white/10 flex gap-1.5">
              {[0, 0.15, 0.3].map(x => (<span key={x} className="hero-dot w-1.5 h-1.5 rounded-full bg-cyan-300" style={{ animationDelay: `${x}s` }} />))}
            </motion.div>
          )}
          {step >= 3 && (
            <motion.div key={`b${demo}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="self-start max-w-[92%] px-3.5 py-2.5 rounded-2xl rounded-tl-md bg-white/[0.06] border border-white/10 text-zinc-100">
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {d.chips.map(([en, ur]) => (<span key={en} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold">✓ {en} <span className="font-urdu">{ur}</span></span>))}
              </div>
              <p>{d.bot}</p>
              <p className="font-urdu text-cyan-200/90 mt-0.5" dir="rtl">{d.botUr}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 px-3 pb-3">
        <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-[12px] text-zinc-500">Type or speak your symptoms…</div>
        <span className="relative p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300"><span className="hero-pulse-ring absolute inset-0 rounded-xl border border-cyan-400" /><Mic size={16} className="relative" /></span>
        <span className="p-2.5 rounded-xl bg-cyan-500 text-black"><Send size={16} /></span>
      </div>
    </div>
  );
};

const HeroSection: React.FC<Props> = ({ onStart, onAqi }) => {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(n => (n + 1) % WORDS.length), 2200); return () => clearInterval(t); }, []);

  return (
    // 100vh hero: fills the screen on desktop and tablets; on small phones it may grow to fit its content.
    <section className="relative w-full min-h-[100svh] lg:h-[100svh] flex items-center pt-20 sm:pt-24 pb-6 sm:pb-8 border-b border-white/5 overflow-hidden -mt-px">
      {/* background */}
      <div className="absolute -top-24 -left-10 w-[480px] h-[480px] rounded-full bg-cyan-500/20 blur-[130px] hero-orb pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-[520px] h-[520px] rounded-full bg-blue-600/20 blur-[140px] hero-orb pointer-events-none" style={{ animationDelay: '-7s' }} />
      <div className="absolute inset-0 pointer-events-none opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)] bg-[radial-gradient(circle,rgba(34,211,238,0.35)_1px,transparent_1px)] bg-[size:30px_30px]" />
      <div className="hero-sweep absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-cyan-400/[0.05] to-transparent pointer-events-none" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10">
        {/* ---------- Left ---------- */}
        <div className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1">
          <motion.div {...up(0)} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/[0.07] mb-[2.2vh]">
            <Sparkles size={13} className="text-cyan-300" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-300 uppercase font-black">AI Medical Chatbot · Online</span>
          </motion.div>

          <motion.h1 {...up(0.1)} className="font-black tracking-tighter italic uppercase leading-[0.92]" style={{ fontSize: 'clamp(2.4rem, min(9vw, 10.8vh), 6.4rem)' }}>
            Talk to your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-500 hero-shine">AI doctor</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-600">anytime.</span>
          </motion.h1>

          <motion.div {...up(0.22)} className="mt-[3vh] flex flex-wrap items-center gap-x-3 gap-y-0 justify-center lg:justify-start text-base md:text-xl text-zinc-300">
            <Mic className="text-cyan-400 shrink-0" size={20} />
            <span>Speak or type in</span>
            <span className="relative inline-block min-w-[8rem] text-left h-8 overflow-hidden">
              {WORDS.map((p, k) => (
                <span key={p.text} className={`absolute left-0 top-0 font-black text-cyan-300 transition-all duration-500 ${p.cls} ${k === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>{p.text}</span>
              ))}
            </span>
          </motion.div>

          <motion.p {...up(0.32)} className="mt-[1.6vh] text-zinc-400 text-sm md:text-base max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            Describe how you feel and get a clear result, a medicine plan and a printable slip. Plus a live air-quality map for your city.
          </motion.p>

          <motion.div {...up(0.42)} className="mt-[3.6vh] flex flex-wrap gap-4 justify-center lg:justify-start">
            <button onClick={onStart} className="group px-8 py-4 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.28em] rounded-full hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_50px_rgba(6,182,212,0.45)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] cursor-pointer">
              Let's Begin Checkup <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
            </button>
            <button onClick={onAqi} className="px-8 py-4 border border-white/15 text-white font-black uppercase text-xs tracking-[0.28em] rounded-full hover:bg-white/5 hover:border-cyan-400/50 transition-all cursor-pointer flex items-center gap-3 backdrop-blur">
              <Wind size={16} /> Live AQI Map
            </button>
          </motion.div>

          <motion.ul {...up(0.55)} className="mt-[4vh] hidden sm:flex flex-wrap gap-x-7 gap-y-2 justify-center lg:justify-start text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            <li className="flex items-center gap-2"><Languages size={13} className="text-cyan-400" />Urdu + English</li>
            <li className="flex items-center gap-2"><Mic size={13} className="text-cyan-400" />Voice input</li>
            <li className="flex items-center gap-2"><HeartPulse size={13} className="text-cyan-400" />Medicine plan</li>
            <li className="flex items-center gap-2"><ShieldCheck size={13} className="text-cyan-400" />Safety first</li>
          </motion.ul>
        </div>

        {/* ---------- Right: doctor + live chat demo ---------- */}
        <motion.div className="lg:col-span-5 order-1 lg:order-2 flex justify-center" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease }}>
          <div className="relative flex flex-col items-center w-full max-w-[340px] lg:max-w-none lg:block lg:w-[var(--sw)] lg:h-[var(--sh)]" style={{ '--sw': 'clamp(270px, min(40vw, 64vh), 520px)', '--sh': 'clamp(330px, min(48vw, 78vh), 700px)' } as React.CSSProperties}>
            <div className="relative w-[min(62vw,30vh)] aspect-square lg:absolute lg:left-1/2 lg:top-[38%] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[92%]">
              <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 hero-spin" />
              <div className="absolute inset-[9%] rounded-full border border-dotted border-cyan-400/25 hero-spin-rev" />
              <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.3),rgba(37,99,235,0.08)_60%,transparent_72%)] shadow-[0_0_90px_rgba(6,182,212,0.28)]" />
              <div className="hero-pulse-ring absolute inset-[18%] rounded-full border border-cyan-400/60" />
              <div className="absolute inset-0 flex items-end justify-center overflow-hidden rounded-full">
                <div className="-mb-[2%] w-[72%]"><DoctorAvatar size={300} speaking className="w-full h-auto drop-shadow-[0_12px_30px_rgba(0,0,0,0.5)]" /></div>
              </div>
            </div>

            <div className="hidden lg:block absolute left-0 top-[6%] hero-float origin-left">
              <div className="px-3.5 py-2.5 rounded-2xl border border-white/10 bg-zinc-950/85 backdrop-blur-md shadow-2xl">
                <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Heart rhythm</p>
                <svg viewBox="0 0 160 40" className="w-28 h-6"><path className="hero-ecg" d="M0 22 H40 L48 22 L54 6 L62 36 L68 22 H96 L102 16 L108 22 H160" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>

            <div className="hidden lg:block lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:bottom-0"><div className="hero-float" style={{ animationDelay: '-2s' }}><ChatDemo /></div></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
