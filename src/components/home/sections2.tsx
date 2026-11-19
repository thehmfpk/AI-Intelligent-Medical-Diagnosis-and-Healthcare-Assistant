import React, { useEffect, useState } from 'react';
import { ArrowRight, Wind, ShieldCheck, Pill, Lock, AlertTriangle, ChevronDown, MapPin, Clock, HeartPulse } from 'lucide-react';
import { Band, Head, Reveal } from './ui';
import RobotDoctor from '../RobotDoctor';
import { CITIES, bandFor, fetchReadings, Reading } from '../../lib/aqi';

interface Props { onStart: () => void; onAqi: () => void }

/* ------------------------------------------------------------- live air */
const SHOW = ['Lahore', 'Karachi', 'Islamabad', 'Peshawar'];

export const LiveAir: React.FC<{ onAqi: () => void }> = ({ onAqi }) => {
  const [rows, setRows] = useState<{ name: string; ur: string; r: Reading | null }[] | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    const cs = SHOW.map(n => CITIES.find(c => c.name === n)!);
    const ac = new AbortController();
    fetchReadings(cs, ac.signal).then(rs => setRows(cs.map((c, i) => ({ name: c.name, ur: c.ur, r: rs[i] ?? null })))).catch(e => { if (e?.name !== 'AbortError') setErr(true); });
    return () => ac.abort();
  }, []);

  return (
    <Band tone="c" id="air">
      <div className="grid gap-10 lg:gap-14 lg:grid-cols-2 items-center">
        <div>
          <Head title="Check the air" accent="before you step out." sub="Pollution affects your lungs and heart. See today's air quality across Pakistan and anywhere in the world, then get precautions that fit your age, health and routine." />
          <ul className="space-y-3 mb-8 -mt-4">
            {[[<MapPin size={16} />, 'Live map with 27 Pakistani cities, plus search for any city'], [<HeartPulse size={16} />, 'Personal health-risk check with precautions in English and اردو'], [<Clock size={16} />, 'Cleanest hours of the next 24 hours, so you can plan outdoor time']].map(([i, t], k) => (
              <li key={k} className="flex items-start gap-3 text-sm sm:text-base text-zinc-300"><span className="mt-0.5 w-7 h-7 shrink-0 rounded-lg bg-cyan-500/15 text-cyan-300 flex items-center justify-center">{i}</span>{t}</li>
            ))}
          </ul>
          <button onClick={onAqi} className="px-7 py-4 bg-cyan-500 text-black font-black uppercase text-[11px] tracking-[0.25em] rounded-full hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(6,182,212,0.4)] cursor-pointer group">
            Open live AQI map <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        <Reveal delay={0.1}>
          <div className="hs-card p-5 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <p className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-cyan-300"><span className="relative flex w-2.5 h-2.5"><span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60 animate-ping" /><span className="relative w-2.5 h-2.5 rounded-full bg-emerald-400" /></span>Live now</p>
              <Wind className="text-cyan-400" size={20} />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {(rows ?? SHOW.map(n => ({ name: n, ur: '', r: null as Reading | null }))).map(c => {
                const b = c.r ? bandFor(c.r.aqi) : null;
                return (
                  <div key={c.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 min-h-[112px]">
                    <p className="text-sm font-bold flex items-baseline gap-2">{c.name} {c.ur && <span className="font-urdu text-xs text-zinc-400">{c.ur}</span>}</p>
                    {b && c.r ? (
                      <div className="mt-3 flex items-center gap-3">
                        <span className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shrink-0" style={{ background: b.color, color: b.text }}>{c.r.aqi}</span>
                        <span className="text-[11px] leading-tight text-zinc-400">{b.en}{c.r.pm25 != null && <><br />PM2.5 {Math.round(c.r.pm25)}</>}</span>
                      </div>
                    ) : <div className={`mt-3 h-12 rounded-xl bg-white/5 ${err ? '' : 'animate-pulse'}`} aria-label={err ? 'Live data unavailable' : 'Loading'} />}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-[11px] text-zinc-500">{err ? 'Live data is unavailable right now. Open the map to retry.' : 'US AQI. Modelled estimate from Open-Meteo (CAMS); may differ from a ground monitor.'}</p>
          </div>
        </Reveal>
      </div>
    </Band>
  );
};

/* ---------------------------------------------------------------- honest */
export const Trust: React.FC = () => {
  const items = [
    { i: <ShieldCheck size={26} />, t: 'Not a diagnosis', d: 'Dr.HMF suggests likely conditions from your symptoms. Only a doctor can diagnose you.' },
    { i: <Pill size={26} />, t: 'Medicine info, no doses', d: 'Medicine guidance is general and class-level. The slip is not a prescription, and we never give doses.' },
    { i: <Lock size={26} />, t: 'Your data stays with you', d: 'No account needed. Symptom analysis runs in your browser, and your last few results stay only on your own device. Air-quality lookups send just a place’s coordinates.' },
  ];
  return (
    <Band tone="b" id="trust">
      <Head title="Guidance you can trust," accent="limits we say out loud." />
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((x, i) => (
          <Reveal key={x.t} delay={i * 0.08} className="h-full">
            <div className="hs-card h-full p-6 sm:p-8">
              <span className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center mb-5">{x.i}</span>
              <h3 className="text-xl font-black uppercase italic tracking-tight mb-2">{x.t}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{x.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <div className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/[0.07] p-5 sm:p-7 flex flex-col sm:flex-row gap-4 sm:items-center">
          <span className="w-12 h-12 shrink-0 rounded-2xl bg-red-500/20 text-red-300 flex items-center justify-center"><AlertTriangle size={24} /></span>
          <div>
            <p className="font-black uppercase italic tracking-tight text-red-200">In an emergency, do not wait for an app</p>
            <p className="text-sm text-zinc-300 mt-1">Chest pain, severe trouble breathing, fainting, heavy bleeding or signs of a stroke need urgent care. Call your local emergency number (in many Pakistani cities: Rescue 1122 or Edhi 115) or go to the nearest hospital.</p>
          </div>
        </div>
      </Reveal>
    </Band>
  );
};

/* ------------------------------------------------------------------- faq */
const FAQ = [
  ['Is Dr.HMF a real doctor?', 'No. It is an informational assistant that matches your symptoms against 100 conditions and explains the closest matches. It cannot examine you, diagnose you or prescribe medicine.'],
  ['Do I need an account?', 'No. There is no sign-up. Your last few results are kept only on your own device.'],
  ['Which languages and voice input work?', 'English, اردو and Roman Urdu. Voice input uses your browser’s speech recognition and works in Chrome and Edge.'],
  ['How does it decide the likely conditions?', 'It compares the symptoms you give with a table of 100 conditions and ranks them by how closely they match. More specific symptoms give better results.'],
  ['Where does the air-quality data come from?', 'Open-Meteo’s air-quality model (CAMS). It is a modelled estimate in US AQI and can differ from a ground monitor in your area.'],
  ['What should I do if I feel very unwell?', 'Seek medical care. For chest pain, severe breathlessness, fainting or stroke signs, call emergency services straight away.'],
];

export const Faq: React.FC = () => (
  <Band tone="a" id="faq">
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <Head title="Questions," accent="answered." sub="Short, honest answers about what Dr.HMF can and cannot do." />
      <div className="space-y-3">
        {FAQ.map(([q, a], i) => (
          <Reveal key={q} delay={i * 0.05}>
            <details className="hs-card group px-5 sm:px-6 py-4">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-sm sm:text-base text-white [&::-webkit-details-marker]:hidden">
                {q}<ChevronDown size={18} className="shrink-0 text-cyan-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  </Band>
);

/* ------------------------------------------------------------- final cta */
export const FinalCta: React.FC<Props> = ({ onStart, onAqi }) => (
  <Band tone="d" className="!py-14 sm:!py-20">
    <Reveal>
      <div className="hs-card relative overflow-hidden !rounded-[2rem] sm:!rounded-[3rem] px-6 sm:px-12 pt-10 sm:pt-14 pb-0 grid items-end gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="pb-10 sm:pb-14 text-center md:text-left">
          <h2 className="text-[clamp(2rem,5.4vw,4rem)] font-black italic uppercase tracking-tighter leading-[0.95]">Feeling off? <span className="hs-grad">Let’s check, together.</span></h2>
          <p className="mt-5 text-zinc-400 max-w-lg mx-auto md:mx-0 text-sm sm:text-base">Tell Dr.HMF your symptoms in your own words and get a clear, honest next step in a minute.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
            <button onClick={onStart} className="px-7 py-4 bg-cyan-500 text-black font-black uppercase text-[11px] tracking-[0.25em] rounded-full hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(6,182,212,0.45)] cursor-pointer group">Let's begin checkup <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" /></button>
            <button onClick={onAqi} className="px-7 py-4 border border-white/15 bg-white/5 text-white font-black uppercase text-[11px] tracking-[0.25em] rounded-full hover:bg-white/10 hover:border-cyan-400/50 transition-all flex items-center gap-3 cursor-pointer"><Wind size={15} />Live AQI map</button>
          </div>
        </div>
        <div className="flex justify-center md:justify-end self-end">
          <RobotDoctor className="h-56 sm:h-72 md:h-[22rem] w-auto -mb-6 sm:-mb-8" />
        </div>
      </div>
    </Reveal>
  </Band>
);
