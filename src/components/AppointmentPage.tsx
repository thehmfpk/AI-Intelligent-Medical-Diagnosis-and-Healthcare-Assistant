import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck, User, Phone, Mail, MapPin, Stethoscope, Video, Building2, PhoneCall, Sparkles,
  CheckCircle2, AlertTriangle, Download, Copy, Printer, RotateCcw, Clock, MessageCircle,
} from 'lucide-react';
import {
  Booking, DEPARTMENTS, VisitMode, MODE_LABEL, URGENCY_LABEL, deptById, triage, upcomingDays, daySlots,
  isSlotTaken, isSlotPast, recommendSlots, loadBookings, saveBooking, makeRef, formatDate, formatTime,
  composeConfirmation, confirmationText, buildIcs, pickLang,
} from '../lib/appointments';
import { browserPrefersUrdu } from '../lib/autoLanguage';
import { useSpeechInput } from '../lib/useSpeechInput';
import SymptomName from './SymptomName';
import MicButton from './MicButton';
import type { Lang } from '../lib/symptomMatcher';

interface Props {
  /** Symptoms from a checkup the patient already did, to pre-fill the visit reason. */
  knownSymptoms?: string[];
  onStartCheckup: () => void;
}

const input =
  'w-full bg-zinc-950/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors';
const label = 'block text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500 mb-1.5';

const AppointmentPage: React.FC<Props> = ({ knownSymptoms = [], onStartCheckup }) => {
  const [form, setForm] = useState({ name: '', age: '', gender: '', phone: '', email: '', city: '', reason: '' });
  const [department, setDepartment] = useState<string | null>(null);
  const [mode, setMode] = useState<VisitMode>('clinic');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookings, setBookings] = useState<Booking[]>(() => loadBookings());
  const [done, setDone] = useState<Booking | null>(null);
  const [confLang, setConfLang] = useState<Lang>('en');
  const [copied, setCopied] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  // Voice: dictate the visit reason; it is appended to what is already written.
  const mic = useSpeechInput(text => setForm(f => ({ ...f, reason: (f.reason ? f.reason + ' ' : '') + text })));

  // The AI step: read the reason, suggest department and urgency.
  const tri = useMemo(() => triage(form.reason, knownSymptoms), [form.reason, knownSymptoms]);
  const dept = department ?? tri.department;
  const days = useMemo(() => upcomingDays(14), []);
  const slots = useMemo(() => daySlots(), []);
  const suggestions = useMemo(() => recommendSlots(bookings, dept, tri.urgency), [bookings, dept, tri.urgency]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your full name';
    const age = Number(form.age);
    if (!form.age || !Number.isFinite(age) || age < 0 || age > 120) e.age = 'Enter a valid age';
    if (!form.gender) e.gender = 'Select one';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email or leave it empty';
    if (!form.city.trim()) e.city = 'Enter your city';
    if (!date || !time) e.slot = 'Choose a date and a time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const confirm = () => {
    if (!validate()) return;
    const fresh = loadBookings();
    if (isSlotTaken(fresh, date, time, dept)) {
      setBookings(fresh);
      setTime('');
      setErrors({ slot: 'That slot was just taken. Please pick another one.' });
      return;
    }
    const lang = pickLang(form.reason + ' ' + form.name, browserPrefersUrdu());
    const b: Booking = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      ref: makeRef(),
      name: form.name.trim(),
      age: form.age,
      gender: form.gender,
      phone: form.phone.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      department: dept,
      mode,
      reason: form.reason.trim(),
      symptoms: tri.symptoms,
      date,
      time,
      urgency: tri.urgency,
      lang,
      createdAt: new Date().toISOString(),
    };
    saveBooking(b);
    setBookings(loadBookings());
    setConfLang(lang);
    setDone(b);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setDone(null);
    setForm({ name: '', age: '', gender: '', phone: '', email: '', city: '', reason: '' });
    setDepartment(null); setDate(''); setTime(''); setErrors({});
  };

  const copyText = async (b: Booking) => {
    try { await navigator.clipboard.writeText(confirmationText(b, confLang)); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };

  const downloadIcs = (b: Booking) => {
    const url = URL.createObjectURL(new Blob([buildIcs(b)], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = `appointment-${b.ref}.ics`; a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------- Confirmation view ----------------
  if (done) {
    const c = composeConfirmation(done, confLang);
    const rtl = confLang === 'ur';
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#020204] text-white px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto" id="appointment-card">
          <div className="rounded-[2rem] border border-emerald-500/30 bg-zinc-950/60 p-8 md:p-10 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center"><CheckCircle2 className="text-emerald-400" /></div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-black">AI scheduling assistant</p>
                <h2 className={`text-2xl font-black ${rtl ? 'font-urdu' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>{c.title}</h2>
              </div>
            </div>

            <div dir={rtl ? 'rtl' : 'ltr'} className={rtl ? 'font-urdu text-right leading-loose' : ''}>
              <p className="text-zinc-300 mb-5">{c.greeting}</p>
              <ul className="rounded-2xl border border-white/10 divide-y divide-white/5 mb-6">
                {c.summary.map(line => (<li key={line} className="px-4 py-3 text-sm text-zinc-200">{line}</li>))}
              </ul>
              <h3 className="text-xs font-mono font-black uppercase tracking-widest text-cyan-400 mb-2">{rtl ? 'تیاری' : 'How to prepare'}</h3>
              <ul className="space-y-2 mb-6 text-sm text-zinc-300 list-disc pl-5 rtl:pr-5 rtl:pl-0">
                {c.prepare.map(p => (<li key={p}>{p}</li>))}
              </ul>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200 flex gap-3">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div><p>{c.advice}</p><p className="mt-1 font-bold">{c.emergency}</p></div>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-zinc-500 leading-relaxed">
              This booking is saved on this device only. There is no clinic system connected, so please keep the reference number and call the clinic if you need to change it.
            </p>

            <div className="no-print mt-6 flex flex-wrap gap-3">
              <button onClick={() => setConfLang(l => (l === 'ur' ? 'en' : 'ur'))} className="px-4 py-2.5 rounded-lg border border-white/10 text-xs font-bold hover:bg-white/5 cursor-pointer">
                {confLang === 'ur' ? 'Show in English' : 'اردو میں دیکھیں'}
              </button>
              <button onClick={() => copyText(done)} className="px-4 py-2.5 rounded-lg border border-white/10 text-xs font-bold hover:bg-white/5 flex items-center gap-2 cursor-pointer"><Copy size={14} />{copied ? 'Copied' : 'Copy'}</button>
              <a target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(confirmationText(done, confLang))}`} className="px-4 py-2.5 rounded-lg border border-white/10 text-xs font-bold hover:bg-white/5 flex items-center gap-2"><MessageCircle size={14} />WhatsApp</a>
              <button onClick={() => downloadIcs(done)} className="px-4 py-2.5 rounded-lg border border-white/10 text-xs font-bold hover:bg-white/5 flex items-center gap-2 cursor-pointer"><Download size={14} />Add to calendar</button>
              <button onClick={() => window.print()} className="px-4 py-2.5 rounded-lg border border-white/10 text-xs font-bold hover:bg-white/5 flex items-center gap-2 cursor-pointer"><Printer size={14} />Print</button>
            </div>
            <div className="no-print mt-4 flex flex-wrap gap-3">
              <button onClick={reset} className="px-5 py-3 rounded-xl bg-cyan-500 text-black text-xs font-black uppercase tracking-widest hover:bg-white flex items-center gap-2 cursor-pointer"><RotateCcw size={14} />Book another</button>
              <button onClick={onStartCheckup} className="px-5 py-3 rounded-xl border border-cyan-500/40 text-cyan-300 text-xs font-black uppercase tracking-widest hover:bg-cyan-500/10 cursor-pointer">Let's Begin Checkup</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------------- Booking form ----------------
  const err = (k: string) => errors[k] && <p className="text-red-400 text-[11px] mt-1" role="alert">{errors[k]}</p>;

  return (
    <div className="pt-32 pb-28 min-h-screen bg-[#020204] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500 flex items-center justify-center"><CalendarCheck className="text-black" size={22} /></div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase">Book an <span className="text-cyan-400">Appointment</span></h2>
          </div>
          <p className="text-zinc-400 max-w-2xl">Add your details, describe how you feel, and pick a time. The AI assistant suggests the right department, recommends the best slots and writes your confirmation.</p>
          <p className="font-urdu text-zinc-500 mt-1" dir="rtl">اپنی تفصیل لکھیں، وقت منتخب کریں، اور AI اسسٹنٹ آپ کی تصدیق تیار کر دے گا۔</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {/* Patient details */}
            <section className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6 md:p-8">
              <h3 className="font-black uppercase tracking-tight mb-5 flex items-center gap-2"><User size={16} className="text-cyan-400" />Patient details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className={label} htmlFor="ap-name">Full name</label><input id="ap-name" className={input} value={form.name} onChange={set('name')} placeholder="e.g. Ayesha Khan" autoComplete="name" />{err('name')}</div>
                <div><label className={label} htmlFor="ap-age">Age</label><input id="ap-age" inputMode="numeric" className={input} value={form.age} onChange={set('age')} placeholder="Years" />{err('age')}</div>
                <div><label className={label} htmlFor="ap-gender">Gender</label>
                  <select id="ap-gender" className={input} value={form.gender} onChange={set('gender')}>
                    <option value="">Select</option><option>Female</option><option>Male</option><option>Other</option>
                  </select>{err('gender')}</div>
                <div><label className={label} htmlFor="ap-phone"><Phone size={10} className="inline mr-1" />Phone</label><input id="ap-phone" type="tel" className={input} value={form.phone} onChange={set('phone')} placeholder="03xx xxxxxxx" autoComplete="tel" />{err('phone')}</div>
                <div><label className={label} htmlFor="ap-email"><Mail size={10} className="inline mr-1" />Email (optional)</label><input id="ap-email" type="email" className={input} value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" />{err('email')}</div>
                <div className="sm:col-span-2"><label className={label} htmlFor="ap-city"><MapPin size={10} className="inline mr-1" />City</label><input id="ap-city" className={input} value={form.city} onChange={set('city')} placeholder="e.g. Lahore" autoComplete="address-level2" />{err('city')}</div>
                <div className="sm:col-span-2">
                  <label className={label} htmlFor="ap-reason">What brings you in? (English, اردو or Roman Urdu)</label>
                  <div className="relative">
                    <textarea id="ap-reason" rows={3} className={input + ' pr-4 pb-12'} value={form.reason} onChange={set('reason')} placeholder="e.g. bukhar aur sar dard 2 din se hai" />
                    <div className="absolute right-2 bottom-2"><MicButton supported={mic.supported} listening={mic.listening} onStart={mic.start} onStop={mic.stop} /></div>
                  </div>
                  {mic.listening && <p className="text-cyan-300 text-xs mt-1" role="status">Listening… {mic.interim}</p>}
                  {!mic.listening && mic.error && <p className="text-amber-300 text-xs mt-1" role="alert">{mic.error}</p>}
                  {knownSymptoms.length > 0 && !form.reason && (
                    <button type="button" onClick={() => setForm(f => ({ ...f, reason: knownSymptoms.join(', ') }))} className="mt-2 text-[11px] text-cyan-400 hover:underline cursor-pointer">Use symptoms from my checkup ({knownSymptoms.length})</button>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <span className={label}>Visit type</span>
                <div className="grid grid-cols-3 gap-2">
                  {([['clinic', Building2], ['video', Video], ['phone', PhoneCall]] as const).map(([m, Icon]) => (
                    <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 cursor-pointer transition-colors ${mode === m ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>
                      <Icon size={18} />{MODE_LABEL[m].en}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Slot picker */}
            <section className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6 md:p-8">
              <h3 className="font-black uppercase tracking-tight mb-5 flex items-center gap-2"><Clock size={16} className="text-cyan-400" />Date and time slot</h3>
              <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
                {days.map(d => {
                  const dt = new Date(d + 'T00:00');
                  const on = d === date;
                  return (
                    <button key={d} type="button" onClick={() => { setDate(d); setTime(''); }} aria-pressed={on}
                      className={`shrink-0 w-16 py-3 rounded-xl border text-center cursor-pointer transition-colors ${on ? 'bg-cyan-500 text-black border-cyan-400' : 'border-white/10 text-zinc-300 hover:bg-white/5'}`}>
                      <div className="text-[10px] font-mono uppercase">{dt.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                      <div className="text-lg font-black leading-tight">{dt.getDate()}</div>
                      <div className="text-[10px] font-mono uppercase opacity-70">{dt.toLocaleDateString('en-GB', { month: 'short' })}</div>
                    </button>
                  );
                })}
              </div>
              {date ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                  {slots.map(t => {
                    const off = isSlotPast(date, t) || isSlotTaken(bookings, date, t, dept);
                    const on = t === time;
                    return (
                      <button key={t} type="button" disabled={off} onClick={() => setTime(t)} aria-pressed={on}
                        className={`py-2.5 rounded-lg border text-xs font-mono font-bold transition-colors ${off ? 'border-white/5 text-zinc-700 line-through cursor-not-allowed' : on ? 'bg-cyan-500 text-black border-cyan-400 cursor-pointer' : 'border-white/10 text-zinc-300 hover:bg-white/5 cursor-pointer'}`}>
                        {formatTime(t)}
                      </button>
                    );
                  })}
                </div>
              ) : <p className="text-sm text-zinc-500 mt-2">Pick a day to see the available times. Closed on Sundays.</p>}
              {err('slot')}
            </section>
          </div>

          {/* AI panel */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <section className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.04] p-6">
              <h3 className="font-black uppercase tracking-tight mb-4 flex items-center gap-2"><Sparkles size={16} className="text-cyan-400" />AI assistant</h3>
              <div className="mb-4">
                <span className={label}>Suggested department</span>
                <div className="flex items-center gap-2 mb-2"><Stethoscope size={16} className="text-cyan-400" /><span className="font-bold">{deptById(dept).en}</span><span className="font-urdu text-zinc-400 text-sm">{deptById(dept).ur}</span></div>
                <select aria-label="Department" className={input} value={dept} onChange={e => { setDepartment(e.target.value); setTime(''); }}>
                  {DEPARTMENTS.map(d => (<option key={d.id} value={d.id}>{d.en}</option>))}
                </select>
                <p className="text-[12px] text-zinc-400 mt-2 leading-snug">{tri.reasons.en}</p>
                <p className="font-urdu text-[13px] text-zinc-500 mt-1" dir="rtl">{tri.reasons.ur}</p>
              </div>
              {tri.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">{tri.symptoms.slice(0, 8).map(s => (<span key={s} className="px-2 py-1 rounded-md bg-white/5 text-[11px] text-zinc-300"><SymptomName symptom={s} mode="both" /></span>))}</div>
              )}
              <div className={`rounded-xl p-3 text-xs font-bold ${tri.urgency === 'emergency' ? 'bg-red-500/10 border border-red-500/40 text-red-300' : tri.urgency === 'priority' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' : 'bg-white/5 text-zinc-300'}`}>
                Priority: {URGENCY_LABEL[tri.urgency].en}
                {tri.urgency === 'emergency' && <p className="font-normal mt-1">These symptoms can be serious. Do not wait for an appointment: call Rescue 1122 or Edhi 115 or go to the nearest emergency room.</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6">
              <h3 className="font-black uppercase tracking-tight mb-1 text-sm">Recommended times</h3>
              <p className="text-[11px] text-zinc-500 mb-3">{tri.urgency === 'routine' ? 'Earliest comfortable opening on the next days.' : 'Earliest openings, because of your symptoms.'}</p>
              <div className="space-y-2">
                {suggestions.map((s, i) => {
                  const on = s.date === date && s.time === time;
                  return (
                    <button key={s.date + s.time} type="button" onClick={() => { setDate(s.date); setTime(s.time); }} aria-pressed={on}
                      className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-colors ${on ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/10 hover:bg-white/5'}`}>
                      <div className="text-sm font-bold">{formatDate(s.date)} · {formatTime(s.time)}</div>
                      <div className="text-[11px] text-zinc-500">{i === 0 ? '★ ' : ''}{s.why.en}</div>
                    </button>
                  );
                })}
                {suggestions.length === 0 && <p className="text-sm text-zinc-500">No free slots in the next days for this department.</p>}
              </div>
            </section>

            <button onClick={confirm} className="w-full py-5 rounded-2xl bg-cyan-500 text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-3">
              Confirm appointment <CalendarCheck size={16} />
            </button>
            <AnimatePresence>{Object.keys(errors).length > 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 text-xs text-center" role="alert">Please fix the highlighted fields.</motion.p>
            )}</AnimatePresence>
            <p className="text-[11px] text-zinc-500 text-center leading-relaxed">Demo scheduling: bookings are stored on this device and no clinic system is connected. Not for emergencies.</p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
