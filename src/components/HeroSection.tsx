import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wind, Mic, Languages, Stethoscope } from 'lucide-react';
import RobotDoctor from './RobotDoctor';

interface Props { onStart: () => void; onAqi: () => void; }

const ease = [0.16, 1, 0.3, 1] as const;

const HeroSection: React.FC<Props> = ({ onStart, onAqi }) => {
  const Buttons = (
    <div className="flex flex-wrap lg:flex-col lg:items-stretch gap-3 justify-center">
      <button onClick={onStart} className="group px-7 py-4 bg-cyan-500 text-black font-black uppercase text-[11px] tracking-[0.25em] rounded-full hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(6,182,212,0.45)] cursor-pointer">
        Let's Begin Checkup <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={16} />
      </button>
      <button onClick={onAqi} className="px-7 py-4 border border-white/15 bg-white/5 backdrop-blur text-white font-black uppercase text-[11px] tracking-[0.25em] rounded-full hover:bg-white/10 hover:border-cyan-400/50 transition-all flex items-center gap-3 cursor-pointer">
        <Wind size={15} /> Live AQI Map
      </button>
    </div>
  );

  const Para = (
    <p className="text-zinc-200 text-sm lg:text-[0.95rem] leading-relaxed max-w-[19rem] lg:max-w-[14rem] xl:max-w-[19rem] mx-auto lg:mx-0 text-center lg:text-left">
      Tell Dr.HMF how you feel in English, <span className="font-urdu text-white">اردو</span> or Roman Urdu. Get a clear result, a medicine guide and a printable slip.
    </p>
  );

  return (
    <section className="rbhero relative w-[100vw] ml-[calc(50%-50vw)] min-h-[100svh] flex flex-col pt-24 lg:pt-28 overflow-hidden">

      <div className="rbmesh" aria-hidden>
        <span className="rbmesh-blob rbmesh-a" /><span className="rbmesh-blob rbmesh-b" /><span className="rbmesh-blob rbmesh-c" />
      </div>
      <div className="rbhero-edge" aria-hidden /><div className="rbhero-line" aria-hidden />

      {/* stage */}
      <div className="relative flex-1 min-h-[440px] sm:min-h-[520px] w-full max-w-[1700px] mx-auto">
        {/* giant word behind the robot */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}
          className="rb-word rb-title absolute left-0 right-0 top-[2%] sm:top-[3%] text-center font-black tracking-tighter select-none px-2"
        >
          <span className="block sm:inline">HEALTHCARE</span>{' '}<span className="block sm:inline">COMPANION</span>
        </motion.h1>

        {/* robot, cropped by the bottom edge */}
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.15 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[84%] sm:h-[90%] lg:h-[92%] flex items-end"
        >
          <div className="rb-bob h-full"><RobotDoctor className="h-full w-auto drop-shadow-[0_20px_50px_rgba(2,6,23,0.45)]" /></div>
        </motion.div>

        {/* left stat chip */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease, delay: 0.5 }}
          className="absolute left-3 sm:left-8 lg:left-[5%] top-[56%] sm:top-[44%] lg:top-[48%]">
          <div className="rb-bob flex items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-md shadow-2xl" style={{ animationDelay: '-2s' }}>
            <div className="flex -space-x-2">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center border-2 border-zinc-950"><Mic size={15} /></span>
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center border-2 border-zinc-950"><Languages size={15} /></span>
            </div>
            <div className="leading-tight">
              <p className="text-white font-black text-base sm:text-lg">230+</p>
              <p className="text-zinc-400 text-[10px] sm:text-xs">Symptoms understood</p>
            </div>
          </div>
        </motion.div>

        {/* right shield chip */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease, delay: 0.6 }}
          className="absolute right-3 sm:right-8 lg:right-[6%] top-[52%] sm:top-[38%] lg:top-[40%]">
          <div className="rb-bob relative w-[88px] sm:w-[112px] lg:w-[128px]" style={{ animationDelay: '-4s' }}>
            <svg viewBox="0 0 120 138" className="w-full drop-shadow-xl">
              <path d="M60 4 L112 24 V68 C112 100 90 124 60 134 C30 124 8 100 8 68 V24 Z" fill="rgba(6,182,212,0.10)" stroke="rgba(34,211,238,0.6)" strokeWidth="2" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pb-2 text-center">
              <Stethoscope className="text-cyan-300 mb-0.5" size={18} />
              <p className="text-white font-black text-xl sm:text-2xl leading-none">100+</p>
              <p className="text-zinc-400 text-[10px] sm:text-xs mt-0.5">Conditions</p>
            </div>
          </div>
        </motion.div>

        {/* desktop: paragraph bottom-left, buttons bottom-right */}
        <div className="hidden lg:block absolute left-[5%] bottom-10 z-10">{Para}</div>
        <div className="hidden lg:block absolute right-[5%] bottom-10 z-10">{Buttons}</div>
      </div>

      {/* mobile / tablet: text + buttons below the robot */}
      <div className="lg:hidden relative z-10 px-5 pb-8 pt-5 flex flex-col gap-5 bg-gradient-to-b from-transparent to-black/20">
        {Para}
        {Buttons}
      </div>
    </section>
  );
};

export default HeroSection;
