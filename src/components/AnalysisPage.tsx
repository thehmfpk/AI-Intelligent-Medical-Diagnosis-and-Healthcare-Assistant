import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, Activity, Info, Filter, Terminal, MessageCircle, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import { symptomCategories } from '../data/medicalData';
import { symptomMatchesQuery } from '../lib/symptomMatcher';
import SymptomName from './SymptomName';
import DoctorAvatar from './DoctorAvatar';
import { useAutoDisplayMode } from '../lib/autoLanguage';
import { englishLabel, urduLabel } from '../data/symptomTranslations';

interface AnalysisPageProps {
  onAnalyze: (selectedSymptoms: string[]) => void;
  /** Jump to the conversational assistant. */
  onOpenChat: () => void;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ onAnalyze, onOpenChat }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [voiceOn, setVoiceOn] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const allSymptoms = useMemo(() => Object.values(symptomCategories).flat() as string[], []);
  // Language is detected automatically: Urdu script or Roman Urdu typed in search, else the device language.
  const displayMode = useAutoDisplayMode(search, allSymptoms);
  const lastAdded = selected[selected.length - 1];

  const doctorLine = useMemo(() => {
    if (!lastAdded) {
      return {
        en: "Hello, I'm Dr. HMF. Select the symptoms you feel, one by one, and I will guide you.",
        ur: 'السلام علیکم، میں ڈاکٹر ایچ ایم ایف ہوں۔ جو علامات آپ محسوس کر رہے ہیں وہ ایک ایک کر کے منتخب کریں۔',
      };
    }
    return {
      en: `Noted: ${englishLabel(lastAdded)}. Is there anything else you feel?`,
      ur: `نوٹ کر لیا: ${urduLabel(lastAdded) || englishLabel(lastAdded)}۔ کیا آپ کچھ اور بھی محسوس کر رہے ہیں؟`,
    };
  }, [lastAdded]);

  // The doctor "talks" briefly whenever the line changes; the voice is optional and off by default.
  const timer = useRef<number>();
  useEffect(() => {
    setSpeaking(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSpeaking(false), Math.min(4500, 900 + doctorLine.en.length * 38));
    if (voiceOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const urdu = displayMode !== 'en' && /[\u0600-\u06FF]/.test(search);
      const u = new SpeechSynthesisUtterance(urdu ? doctorLine.ur : doctorLine.en);
      u.lang = urdu ? 'ur-PK' : 'en-US';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
    return () => window.clearTimeout(timer.current);
  }, [doctorLine, voiceOn]);
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const toggleSymptom = (s: string) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const categories = Object.keys(symptomCategories);
  
  const filteredSymptoms = useMemo(() => {
    let result: { category: string, symptoms: string[] }[] = [];
    
    Object.entries(symptomCategories).forEach(([category, symptoms]) => {
      const matched = symptoms.filter(s => symptomMatchesQuery(s, search));
      if (matched.length > 0) {
        if (!activeCategory || activeCategory === category) {
          result.push({ category, symptoms: matched });
        }
      }
    });

    return result;
  }, [search, activeCategory]);

  // Framer Motion Layout Variants
  const containerVariants = {
    animate: { transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="pt-32 pb-40 min-h-screen bg-[#020204] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      {/* Structural Sci-Fi Aesthetics */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-900/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-blue-900/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-6 lg:px-16 relative z-10">
        
        {/* --- SECTION 1: HEADER --- */}
        <div className="mb-16 border-b border-white/5 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-400 uppercase font-black flex items-center gap-1.5">
                <Terminal size={10} /> Mode_Diagnostic: active
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
              Biometric <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">Symptom Node.</span>
            </h2>
            <p className="text-zinc-500 max-w-xl text-sm md:text-base font-light leading-relaxed mt-4">
              Map and feed biometric anomalies directly into our telemetry grid. Isolate your target vectors below.
            </p>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 font-mono text-[11px] text-zinc-600 border border-white/5 bg-zinc-900/20 px-6 py-4 rounded-2xl backdrop-blur-sm">
            <div>CORE: <span className="text-cyan-400 font-bold">ONLINE</span></div>
            <div>MESH SYNC: <span className="text-white">100%</span></div>
          </div>
        </div>

        {/* --- SECTION 2: MANAGEMENT INTERFACE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Controls & Mapping Panel */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Filter and Input Controls */}
            <div className="space-y-6">
              {/* Immersive Tech Search Bar */}
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search a symptom in English or Urdu — fever, بخار, bukhar…"
                  className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/30 focus:bg-black/80 transition-all font-mono tracking-wide shadow-inner"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-700 pointer-events-none border border-zinc-800/60 px-2 py-1 rounded">SYS_SRCH_v4</div>
              </div>

              {/* High Tech Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-white/[0.03]">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className={`px-5 py-3 rounded-xl text-[10px] font-mono tracking-widest uppercase font-black transition-all whitespace-nowrap border ${
                    activeCategory === null 
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]' 
                      : 'bg-zinc-900/30 text-zinc-500 border-white/5 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  [ ALL MODULES ]
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-3 rounded-xl text-[10px] font-mono tracking-widest uppercase font-black transition-all whitespace-nowrap border ${
                      activeCategory === cat 
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]' 
                        : 'bg-zinc-900/30 text-zinc-500 border-white/5 hover:text-white hover:bg-zinc-900/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Biomarker Grid Panel */}
            <div className="space-y-12 max-h-[750px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-zinc-900 hover:scrollbar-thumb-cyan-950">
              <AnimatePresence mode="popLayout">
                {filteredSymptoms.map((group) => (
                  <motion.div 
                    key={group.category} 
                    className="space-y-4"
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                  >
                    {/* Category Title Element */}
                    <div className="flex items-center justify-between border-l-2 border-cyan-500/50 pl-4 py-1 bg-gradient-to-r from-cyan-500/5 to-transparent">
                      <h4 className="text-xs font-mono font-black uppercase tracking-[0.25em] text-cyan-400/80">{group.category}</h4>
                      <span className="text-[10px] font-mono text-zinc-600 uppercase font-bold">{group.symptoms.length} Indicators Loaded</span>
                    </div>

                    {/* Node Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {group.symptoms.map(sym => {
                        const isSelected = selected.includes(sym);
                        return (
                          <motion.button
                            key={sym}
                            variants={itemVariants}
                            onClick={() => toggleSymptom(sym)}
                            whileHover={{ y: isSelected ? 0 : -2 }}
                            className={`group flex items-center justify-between p-4 rounded-xl border text-xs transition-all duration-200 relative overflow-hidden ${
                              isSelected 
                                ? 'bg-gradient-to-r from-cyan-950/40 to-zinc-950 border-cyan-500/50 text-white font-bold shadow-[0_0_25px_rgba(6,182,212,0.15)]'
                                : 'bg-zinc-950/20 border-white/5 text-zinc-400 hover:border-cyan-500/20 hover:text-white hover:bg-zinc-900/20'
                            }`}
                          >
                            {/* Visual background tech overlay on active */}
                            {isSelected && <div className="absolute inset-0 bg-cyan-500/[0.02] pointer-events-none animate-pulse" />}
                            
                            <span className="min-w-0 flex-1 pr-3 text-left">
                              <SymptomName symptom={sym} mode={displayMode} className="font-mono tracking-tight" />
                            </span>
                            
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                              isSelected 
                                ? 'bg-cyan-500 border-cyan-400 text-black' 
                                : 'border-zinc-800 group-hover:border-zinc-600'
                            }`}>
                              {isSelected && <Check size={10} strokeWidth={4} />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* No Results Fallback */}
              {filteredSymptoms.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 border border-dashed border-white/5 rounded-[2rem] bg-zinc-950/10"
                >
                  <Filter className="text-zinc-700 mb-4 animate-pulse" size={28} />
                  <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest text-center px-6">
                    Zero matrix matches. Refine critical keywords.
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* --- SIDEBAR AREA: CYBER REPORT REVIEW --- */}
          <div className="lg:col-span-4 lg:sticky lg:top-36">
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-zinc-950 via-zinc-950 to-black border border-white/5 relative overflow-hidden group shadow-2xl">
              {/* Grid backdrop effect to match style guide section 2 */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 relative z-10">
                <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-2">
                  <Activity size={16} className="text-cyan-500 animate-pulse" /> Telemetry Log
                </h3>
                <div className="px-3 py-1 bg-zinc-900 border border-white/5 font-mono text-[9px] text-zinc-400 uppercase rounded-md">
                  {selected.length} Batch
                </div>
              </div>

              {/* AI doctor: always looks at the patient and guides the next step */}
              <div className="relative z-10 mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-24 -mb-4 overflow-hidden rounded-xl bg-gradient-to-b from-cyan-500/10 to-transparent">
                    <DoctorAvatar size={96} speaking={speaking} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan-400">Dr. HMF</span>
                      <button
                        type="button"
                        onClick={() => { setVoiceOn(v => { if (v) window.speechSynthesis?.cancel(); return !v; }); }}
                        aria-pressed={voiceOn}
                        aria-label={voiceOn ? 'Turn doctor voice off' : 'Turn doctor voice on'}
                        className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer"
                      >
                        {voiceOn ? <Volume2 size={12} /> : <VolumeX size={12} />} {voiceOn ? 'Voice on' : 'Voice off'}
                      </button>
                    </div>
                    <p className="text-[13px] leading-snug text-zinc-200">{doctorLine.en}</p>
                    {displayMode !== 'en' && <p className="font-urdu text-sm leading-relaxed text-cyan-200/90 mt-1" dir="rtl">{doctorLine.ur}</p>}
                  </div>
                </div>
              </div>

              {/* Selected List Console */}
              <div className="space-y-2.5 mb-10 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-900 relative z-10">
                <AnimatePresence mode="popLayout">
                  {selected.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="text-center py-12 px-4"
                    >
                      <p className="text-zinc-600 font-mono text-[11px] uppercase tracking-wider leading-relaxed">
                        [ WAITING FOR TELEMETRY INPUT OVERLAY... ]
                      </p>
                    </motion.div>
                  ) : (
                    selected.map(sym => (
                      <motion.div
                        key={sym}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between p-3.5 bg-zinc-900/30 hover:bg-zinc-900/60 rounded-xl border border-white/[0.03] text-xs transition-colors"
                      >
                        <span className="min-w-0 flex-1 mr-3">
                          <SymptomName symptom={sym} mode={displayMode} className="font-mono text-zinc-300 font-medium" />
                        </span>
                        <button 
                          onClick={() => toggleSymptom(sym)}
                          className="w-5 h-5 flex items-center justify-center text-zinc-600 hover:text-cyan-400 hover:bg-white/5 rounded-md transition-all"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Done: starts the prediction animation */}
              <button
                disabled={selected.length === 0}
                onClick={() => onAnalyze(selected)}
                className="group w-full py-5 bg-cyan-500 disabled:bg-zinc-900 text-black disabled:text-zinc-600 font-black uppercase tracking-[0.25em] text-xs rounded-xl transition-all hover:bg-white active:scale-[0.98] flex items-center justify-center gap-3 relative z-10 cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.2)] disabled:shadow-none"
              >
                Done <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />
              </button>

              {/* Can't find the disease? Talk to the AI chat */}
              <div className="relative z-10 mt-4 rounded-xl border border-white/5 bg-zinc-900/30 p-4 text-center">
                <p className="text-[12px] text-zinc-400 leading-snug">
                  Can't find your disease here? You can also talk to our AI Chat.
                </p>
                <p className="font-urdu text-sm text-zinc-500 mt-1" dir="rtl">اگر آپ کو اپنی بیماری یہاں نہ ملے تو AI چیٹ سے بھی بات کر سکتے ہیں۔</p>
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-widest hover:bg-cyan-500/15 transition-all cursor-pointer"
                >
                  <MessageCircle size={14} /> Talk to AI Chat
                </button>
              </div>

              {/* Legal Tech Disclaimer */}
              <div className="mt-8 flex items-start gap-3.5 p-4 bg-zinc-950 rounded-xl border border-white/5 relative z-10">
                <Info className="text-cyan-500/60 shrink-0 mt-0.5" size={14} />
                <p className="text-[9px] font-mono text-zinc-600 leading-relaxed uppercase">
                  Notice: System diagnostic nodes use pattern matching architectures. Algorithmic outputs are non-definitive metrics. Cross-reference with standard practitioner infrastructure.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
