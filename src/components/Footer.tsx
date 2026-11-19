import React from 'react';
import { Stethoscope, Compass, Wrench, Info, ArrowUpRight, ArrowUp } from 'lucide-react';
import { Page } from './Header';

interface FooterProps {
  setCurrentPage: (p: Page) => void;
}

const COLS: { title: string; icon: React.ReactNode; links: { name: string; id: Page }[] }[] = [
  { title: 'Explore', icon: <Compass size={14} />, links: [
    { name: 'Home', id: 'home' }, { name: 'Symptom checkup', id: 'analysis' }, { name: 'AI chat', id: 'chat' }, { name: 'Prediction', id: 'result' }, { name: 'Treatment plan', id: 'medication' },
  ] },
  { title: 'Tools', icon: <Wrench size={14} />, links: [
    { name: 'Live AQI map', id: 'aqi' }, { name: 'Health risk check', id: 'aqi' }, { name: 'Contact', id: 'contact' },
  ] },
];

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => (
  <footer className="hs-band hs-bg-d relative overflow-hidden pt-16 sm:pt-24 pb-8">
    <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 mb-14">
        {/* brand */}
        <div className="lg:col-span-5">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-4 mb-6 cursor-pointer text-left" aria-label="Dr.HMF home">
            <span className="w-12 h-12 rounded-2xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.15)]"><Stethoscope className="text-cyan-400" size={24} /></span>
            <span>
              <span className="block text-2xl font-bold tracking-tighter text-white">DR.<span className="text-cyan-400">HMF</span></span>
              <span className="block text-[10px] text-cyan-400/70 tracking-[0.3em] font-mono uppercase font-bold">Bio-digital AI</span>
            </span>
          </button>
          <p className="text-base text-zinc-400 leading-relaxed max-w-md">
            Your health companion: describe symptoms in English, <span className="font-urdu text-white">اردو</span> or Roman Urdu, get likely conditions, a medicine guide and live air-quality advice.
          </p>
          <div className="mt-6 inline-flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 max-w-md">
            <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed">Dr.HMF is an informational tool, not medical advice. It cannot diagnose or prescribe. In an emergency, contact your local emergency services.</p>
          </div>
        </div>

        {/* links */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10">
          {COLS.map(c => (
            <div key={c.title}>
              <h3 className="text-white font-bold mb-5 flex items-center gap-2 uppercase tracking-widest text-xs"><span className="text-cyan-400">{c.icon}</span>{c.title}</h3>
              <ul className="space-y-3">
                {c.links.map(l => (
                  <li key={l.name}>
                    <button onClick={() => setCurrentPage(l.id)} className="group flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-colors text-sm font-medium cursor-pointer">
                      {l.name}<ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-white font-bold mb-5 flex items-center gap-2 uppercase tracking-widest text-xs"><span className="text-cyan-400"><Info size={14} /></span>Good to know</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>Medicine info is general, no doses</li>
              <li>Results come from your symptoms only</li>
              <li>AQI by Open-Meteo (modelled estimate)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-5">
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-mono font-bold text-center sm:text-left">&copy; 2026 Dr.HMF · Bio-digital AI</p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-300 hover:text-cyan-300 hover:border-cyan-400/50 transition-colors cursor-pointer">
          Back to top <ArrowUp size={12} />
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
