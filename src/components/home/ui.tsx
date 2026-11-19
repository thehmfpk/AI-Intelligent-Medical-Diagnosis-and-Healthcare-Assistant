import React from 'react';
import { motion } from 'framer-motion';

export type Tone = 'a' | 'b' | 'c' | 'd';

/** Fade-and-rise when scrolled into view. */
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}>
    {children}
  </motion.div>
);

/** Full-width section band with its own mesh-gradient mood. */
export const Band: React.FC<{ tone: Tone; id?: string; children: React.ReactNode; className?: string }> = ({ tone, id, children, className = '' }) => (
  <section id={id} className={`hs-band hs-bg-${tone} relative w-full overflow-hidden py-16 sm:py-20 lg:py-28 ${className}`}>
    <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">{children}</div>
  </section>
);

export const Head: React.FC<{ eyebrow: string; title: string; accent: string; sub?: string; center?: boolean }> = ({ eyebrow, title, accent, sub, center }) => (
  <Reveal className={`mb-10 sm:mb-14 ${center ? 'text-center mx-auto' : ''} max-w-3xl`}>
    <p className="text-[10px] sm:text-[11px] font-mono text-cyan-400 font-bold tracking-[0.35em] sm:tracking-[0.5em] uppercase mb-4">{eyebrow}</p>
    <h2 className="text-[clamp(2rem,5.6vw,4.2rem)] font-black italic uppercase tracking-tighter leading-[0.95] text-white">
      {title} <span className="hs-grad">{accent}</span>
    </h2>
    {sub && <p className="mt-5 text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">{sub}</p>}
  </Reveal>
);
