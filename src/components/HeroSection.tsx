import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wind, Mic, HeartPulse, ShieldCheck, ChevronDown } from 'lucide-react';
import DoctorAvatar from './DoctorAvatar';

interface Props { onStart: () => void; onAqi: () => void; }

const PHRASES = [
  { text: 'English', cls: '' },
  { text: 'اردو', cls: 'font-urdu' },
  { text: 'Roman Urdu', cls: '' },
];

const ease = [0.16, 1, 0.3, 1] as const;
const up = (d = 0) => ({ initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease } } });

const HeroSection: React.FC<Props> = ({ onStart, onAqi }) => {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(n => (n + 1) % PHRASES.length), 2200); return () => clearInterval(t); }, []);

  return (
    <section className="relative w-[100vw] ml-[calc(50%-50vw)] min-h-[100svh] lg:h-[100svh] flex items-center pt-24 sm:pt-28 pb-6 sm:pb-8 border-b border-white/5 overflow-hidden">
      {/* animated background */}
      <div className="absolute -top-10 left-[8%] w-[420px] h-[420px] rounded-full bg-cyan-500/15 blur-[120px] hero-orb pointer-events-none" />
      <div className="absolute bottom-0 right-[6%] w-[460px] h-[460px] rounded-full bg-blue-600/15 blur-[130px] hero-orb pointer-events-none" style={{ animationDelay: '-7s' }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.5] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] bg-[radial-gradient(circle,rgba(34,211,238,0.35)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8 items-center relative z-10">
        {/* ---------- Left ---------- */}
        <div className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1">
          <motion.div {...up(0)} className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/[0.07] mb-[2.4vh]">
            <span className="relative flex w-2 h-2"><span className="absolute inline-flex w-full h-full rounded-full bg-cyan-400 opacity-75 animate-ping" /><span className="relative w-2 h-2 rounded-full bg-cyan-400" /></span>
            <span className="text-[10px] md:text-[11px] font-mono tracking-[0.3em] text-cyan-300 uppercase font-black">AI Medical Assistant · Online</span>
          </motion.div>

          <motion.h1 {...up(0.1)} className="font-black tracking-tighter leading-[0.92] italic uppercase" style={{ fontSize: 'clamp(2.3rem, min(8.4vw, 8.2vh), 5.6rem)' }}>
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-500 hero-shine">Dr.HMF</span>
            <br />your health<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-600">companion.</span>
          </motion.h1>

          <motion.p {...up(0.2)} className="mt-[2.2vh] text-base sm:text-lg lg:text-[1.35rem] font-semibold text-white/90 tracking-tight">
            Say it. See it. <span className="text-cyan-300">Understand it.</span>
          </motion.p>

          <motion.div {...up(0.25)} className="mt-[1.6vh] flex flex-wrap items-center gap-x-3 gap-y-1 justify-center lg:justify-start text-lg md:text-2xl text-zinc-300">
            <Mic className="text-cyan-400 shrink-0" size={22} />
            <span>Speak or type in</span>
            <span className="relative inline-block min-w-[7.5rem] text-left h-9 overflow-hidden">
              {PHRASES.map((p, k) => (
                <span key={p.text} className={`absolute left-0 top-0 font-black text-cyan-300 transition-all duration-500 ${p.cls} ${k === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>{p.text}</span>
              ))}
            </span>
          </motion.div>

          <motion.p {...up(0.35)} className="mt-[1.8vh] hidden sm:block text-zinc-400 text-sm md:text-base lg:text-[1.02rem] max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
            Describe how you feel in your own words, by voice or by typing. Dr.HMF listens, matches your symptoms, ranks the most likely conditions and shows you a clear next step: a simple medicine guide, a printable medical slip, and the air quality around you today. Everything in <span className="text-white">English</span>, <span className="font-urdu text-white">اردو</span> and <span className="text-white">Roman Urdu</span>.
          </motion.p>

          <motion.div {...up(0.45)} className="mt-[3.6vh] flex flex-wrap gap-5 justify-center lg:justify-start">
            <button onClick={onStart} className="group relative px-10 py-5 bg-cyan-500 text-black font-black uppercase text-xs tracking-[0.3em] rounded-full hover:bg-white transition-all flex items-center gap-4 shadow-[0_0_50px_rgba(6,182,212,0.45)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] cursor-pointer">
              Let's Begin Checkup <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
            </button>
            <button onClick={onAqi} className="px-10 py-5 border border-white/15 text-white font-black uppercase text-xs tracking-[0.3em] rounded-full hover:bg-white/5 hover:border-cyan-400/50 transition-all cursor-pointer flex items-center gap-3 backdrop-blur">
              <Wind size={16} /> Live AQI Map
            </button>
          </motion.div>

          <motion.div {...up(0.6)} className="mt-[3vh] hidden sm:block">
            <div className="grid grid-cols-3 max-w-xl mx-auto lg:mx-0 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur divide-x divide-white/10">
              {[
                { n: '230', l: 'Symptoms understood' },
                { n: '100', l: 'Conditions covered' },
                { n: '3', l: 'Languages' },
              ].map(x => (
                <div key={x.l} className="px-4 py-[1.2vh] text-center lg:text-left">
                  <p className="text-xl lg:text-2xl font-black text-cyan-300 leading-none">{x.n}</p>
                  <p className="mt-1 text-[9px] lg:text-[10px] font-mono uppercase tracking-wider text-zinc-500 leading-tight">{x.l}</p>
                </div>
              ))}
            </div>
            <ul className="mt-[1.8vh] [@media(max-height:830px)]:hidden flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              <li className="flex items-center gap-2"><Mic size={13} className="text-cyan-400" />Voice input</li>
              <li className="flex items-center gap-2"><HeartPulse size={13} className="text-cyan-400" />Medicine guide</li>
              <li className="flex items-center gap-2"><Wind size={13} className="text-cyan-400" />Live AQI</li>
              <li className="flex items-center gap-2"><ShieldCheck size={13} className="text-cyan-400" />Guidance, not a prescription</li>
            </ul>
          </motion.div>
        </div>

        {/* ---------- Right: holographic stage ---------- */}
        <motion.div className="lg:col-span-5 order-1 lg:order-2 flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease }}>
          <div className="relative mt-3 sm:mt-0 w-[min(68vw,25vh)] h-[min(68vw,25vh)] sm:w-[min(60vw,42vh)] sm:h-[min(60vw,42vh)] lg:w-[min(38vw,64vh)] lg:h-[min(38vw,64vh)]">
            {/* rings */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 hero-spin" />
            <div className="absolute inset-[9%] rounded-full border border-cyan-400/20 hero-spin-rev" style={{ borderStyle: 'dotted' }} />
            <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.28),rgba(37,99,235,0.08)_60%,transparent_72%)] shadow-[0_0_80px_rgba(6,182,212,0.25)]" />

            {/* doctor */}
            <div className="absolute inset-0 flex items-end justify-center overflow-hidden rounded-full">
              <div className="relative -mb-[3%] w-[78%]"><DoctorAvatar size={300} speaking className="w-full h-auto drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]" /></div>
            </div>

            {/* floating cards */}
            <div className="absolute -left-3 sm:left-0 lg:left-2 top-[2%] sm:top-[10%] hero-float scale-[0.72] sm:scale-100 origin-top-left sm:origin-left">
              <div className="px-4 py-3 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
                <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Symptom noted</p>
                <p className="text-sm font-bold text-white flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Fever <span className="font-urdu text-cyan-300 text-base">بخار</span></p>
              </div>
            </div>

            <div className="absolute -right-3 sm:right-0 lg:right-3 top-[-2%] sm:top-[6%] hero-float scale-[0.72] sm:scale-100 origin-top-right" style={{ animationDelay: '-2s' }}>
              <div className="px-4 py-3 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md shadow-2xl w-44">
                <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-1"><HeartPulse size={10} className="text-red-400" />Heart rhythm</p>
                <svg viewBox="0 0 160 40" className="w-full h-8"><path className="hero-ecg" d="M0 22 H40 L48 22 L54 6 L62 36 L68 22 H96 L102 16 L108 22 H160" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>

            <div className="absolute -left-3 sm:left-0 lg:left-2 bottom-[2%] sm:bottom-[8%] hero-float scale-[0.72] sm:scale-100 origin-bottom-left sm:origin-left" style={{ animationDelay: '-4s' }}>
              <div className="px-4 py-3 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
                <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1"><Mic size={10} className="text-cyan-400" />Listening</p>
                <div className="flex items-end gap-1 h-6">{[0, 0.15, 0.3, 0.1, 0.4, 0.2, 0.35].map((d, k) => (<span key={k} className="hero-bar w-1 h-full rounded-full bg-cyan-400" style={{ animationDelay: `${d}s` }} />))}</div>
              </div>
            </div>

            <div className="absolute -right-3 sm:right-0 lg:right-3 bottom-[8%] sm:bottom-[16%] hero-float scale-[0.72] sm:scale-100 origin-bottom-right" style={{ animationDelay: '-1s' }}>
              <div className="px-4 py-3 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md shadow-2xl">
                <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Daily plan</p>
                <p className="text-sm font-bold text-white">Morning · 8:00 AM</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em]">
        Scroll <ChevronDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
