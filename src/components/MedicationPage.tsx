import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Printer, MapPin, LocateFixed, Search, ExternalLink, AlertTriangle, Clock, Utensils, Lightbulb, CalendarCheck, Apple, Dumbbell, ShieldCheck, Eye,
} from 'lucide-react';
import type { DiseaseInfo } from '../data/medicalData';
import { describeAll, FOOD_TEXT, SLOT_INFO } from '../lib/medicineGuide';
import { printSlip, buildSlipHtml } from '../lib/medicalSlip';
import MedicineImage from './MedicineImage';
import FollowUpTimeline from './FollowUpTimeline';

interface Props {
  info: DiseaseInfo;
  symptoms: string[];
  onBack: () => void;
  history: { disease: string; date: string; symptoms: number }[];
}

const field = 'w-full bg-zinc-950/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50';
const lab = 'block text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500 mb-1';

const MedicationPage: React.FC<Props> = ({ info, symptoms, onBack }) => {
  const items = useMemo(() => describeAll(info.Medication), [info]);
  const meds = items.filter(i => i.profile.form !== 'care' && i.profile.form !== 'procedure');
  const care = items.filter(i => i.profile.form === 'care' || i.profile.form === 'procedure');

  const [patient, setPatient] = useState({ name: '', age: '', gender: '', phone: '', city: '' });
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoErr, setGeoErr] = useState('');
  const [term, setTerm] = useState('pharmacy');
  const [showMap, setShowMap] = useState(false);

  const place = coords ? `${coords.lat},${coords.lng}` : city.trim();
  const mapQuery = place ? `${term} near ${place}` : '';
  const mapsLink = (t: string) => `https://www.google.com/maps/search/${encodeURIComponent(`${t} pharmacy near ${place || 'me'}`)}`;

  const locate = () => {
    setGeoErr('');
    if (!navigator.geolocation) { setGeoErr('Location is not available in this browser. Type your city instead.'); return; }
    navigator.geolocation.getCurrentPosition(
      p => { setCoords({ lat: +p.coords.latitude.toFixed(4), lng: +p.coords.longitude.toFixed(4) }); setShowMap(true); },
      () => setGeoErr('Could not get your location. Allow location access or type your city.'),
      { timeout: 10000 },
    );
  };

  const slipInput = { info, symptoms, patient };
  const preview = () => {
    const w = window.open('', '_blank');
    if (w) { w.document.write(buildSlipHtml(slipInput)); w.document.close(); }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#020204] text-white">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-cyan-400 cursor-pointer"><ArrowLeft size={14} />Back to prediction</button>

        <header className="grid md:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400 font-black mb-2">Treatment summary</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter capitalize leading-none">{info.Disease}</h2>
            <p className="text-zinc-400 mt-4 max-w-3xl leading-relaxed">{info.Description}</p>
          </div>
          <div className="flex gap-2 no-print">
            <button onClick={preview} className="px-4 py-3 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 flex items-center gap-2 cursor-pointer"><Eye size={14} />Preview slip</button>
            <button onClick={() => printSlip(slipInput)} className="px-5 py-3 rounded-xl bg-cyan-500 text-black text-xs font-black uppercase tracking-widest hover:bg-white flex items-center gap-2 cursor-pointer"><Printer size={14} />Print medical slip</button>
          </div>
        </header>

        {/* Medicine cards */}
        <section>
          <h3 className="font-black uppercase tracking-tight mb-4">Medicine summary</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {meds.map((m, idx) => (
              <motion.article key={m.raw} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (idx % 4) * 0.05 }}
                className="rounded-3xl border border-white/10 bg-zinc-950/50 p-5 flex gap-4">
                <div className="shrink-0"><MedicineImage form={m.profile.form} color={m.profile.color} size={92} /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider font-black" style={{ color: m.profile.color }}>{m.profile.label} · {m.profile.form}</p>
                  <h4 className="text-lg font-black leading-tight">{m.name}</h4>
                  {m.examples.length > 0 && <p className="text-xs text-zinc-500">e.g. {m.examples.join(', ')}</p>}
                  <p className="text-[13px] text-zinc-300 mt-2 leading-snug">{m.profile.purpose}</p>
                  <ul className="mt-3 space-y-1 text-[12px] text-zinc-400">
                    <li className="flex gap-2"><Clock size={13} className="shrink-0 mt-0.5 text-cyan-400" />{m.profile.asNeeded ? 'Only when needed' : m.profile.slots.map(s => `${SLOT_INFO[s].label} ${SLOT_INFO[s].time}`).join(' · ')}</li>
                    <li className="flex gap-2"><Utensils size={13} className="shrink-0 mt-0.5 text-cyan-400" />{FOOD_TEXT[m.profile.food]}</li>
                    <li className="flex gap-2"><CalendarCheck size={13} className="shrink-0 mt-0.5 text-cyan-400" />{m.profile.duration}</li>
                    <li className="flex gap-2"><Lightbulb size={13} className="shrink-0 mt-0.5 text-cyan-400" />{m.profile.tip}</li>
                  </ul>
                  {m.profile.warning && <p className="mt-2 text-[12px] text-amber-300 flex gap-2"><AlertTriangle size={13} className="shrink-0 mt-0.5" />{m.profile.warning}</p>}
                  {m.searchTerm && place && (
                    <a href={mapsLink(m.searchTerm)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 hover:underline"><MapPin size={12} />Find near you<ExternalLink size={10} /></a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
          {care.length > 0 && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h4 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-400 mb-2">Care, therapy and procedures</h4>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-zinc-300 list-disc pl-5">{care.map(c => (<li key={c.raw}>{c.name}</li>))}</ul>
            </div>
          )}
          <p className="text-[11px] text-zinc-500 mt-3">Pictures are illustrations of the medicine type, not of a specific brand. Doses are not shown on purpose: your doctor or pharmacist sets them for you.</p>
        </section>

        {/* Daily plan */}
        <section className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6 md:p-8">
          <h3 className="font-black uppercase tracking-tight mb-5">Daily follow-up</h3>
          <FollowUpTimeline items={items} />
        </section>

        {/* Nearby */}
        <section className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6 md:p-8">
          <h3 className="font-black uppercase tracking-tight mb-1 flex items-center gap-2"><MapPin size={16} className="text-cyan-400" />Available near you</h3>
          <p className="text-sm text-zinc-400 mb-5">Find pharmacies and hospitals in your area on the map. Call before you go to confirm that the medicine is in stock.</p>
          <div className="grid md:grid-cols-[1fr_auto_auto] gap-3 items-end">
            <div><label className={lab} htmlFor="md-city">Your city or area</label><input id="md-city" className={field} value={city} onChange={e => { setCity(e.target.value); setCoords(null); }} placeholder="e.g. Johar Town, Lahore" /></div>
            <button onClick={locate} className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 flex items-center gap-2 cursor-pointer"><LocateFixed size={14} />Use my location</button>
            <button disabled={!place} onClick={() => setShowMap(true)} className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-black uppercase tracking-widest hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"><Search size={14} />Search</button>
          </div>
          {geoErr && <p className="text-amber-300 text-xs mt-2" role="alert">{geoErr}</p>}
          <div className="flex flex-wrap gap-2 mt-4">
            {['pharmacy', '24 hour pharmacy', 'hospital', 'clinic', 'laboratory'].map(t => (
              <button key={t} onClick={() => { setTerm(t); if (place) setShowMap(true); }} aria-pressed={term === t}
                className={`px-3 py-1.5 rounded-full border text-xs cursor-pointer ${term === t ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}>{t}</button>
            ))}
          </div>
          {showMap && place && (
            <div className="mt-5 rounded-2xl overflow-hidden border border-white/10">
              <iframe title="Nearby map" className="w-full h-80 bg-zinc-900" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`} />
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(mapQuery)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 text-xs font-bold text-cyan-400 hover:bg-white/5">Open in Google Maps<ExternalLink size={12} /></a>
            </div>
          )}
        </section>

        {/* Lifestyle */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6"><h4 className="font-black mb-3 flex items-center gap-2"><Apple size={16} className="text-cyan-400" />Diet</h4><ul className="space-y-1.5 text-sm text-zinc-300 list-disc pl-5">{info.Diet.map(d => (<li key={d}>{d}</li>))}</ul></div>
          <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6"><h4 className="font-black mb-3 flex items-center gap-2"><Dumbbell size={16} className="text-cyan-400" />Activity</h4><ul className="space-y-1.5 text-sm text-zinc-300 list-disc pl-5">{info.Workouts.map(d => (<li key={d}>{d}</li>))}</ul></div>
          <div className="rounded-3xl border border-white/10 bg-zinc-950/40 p-6"><h4 className="font-black mb-3 flex items-center gap-2"><ShieldCheck size={16} className="text-cyan-400" />Precautions</h4><ul className="space-y-1.5 text-sm text-zinc-300 list-disc pl-5">{[info.Precaution_1, info.Precaution_2, info.Precaution_3, info.Precaution_4].filter(Boolean).map(d => (<li key={d}>{d}</li>))}</ul></div>
        </section>

        {/* Slip details */}
        <section className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.04] p-6 md:p-8 no-print">
          <h3 className="font-black uppercase tracking-tight mb-1 flex items-center gap-2"><Printer size={16} className="text-cyan-400" />Medical slip</h3>
          <p className="text-sm text-zinc-400 mb-5">Add the patient details to print on the slip. Leave blank to write them by hand.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {(['name', 'age', 'gender', 'phone', 'city'] as const).map(k => (
              <div key={k}><label className={lab} htmlFor={`sl-${k}`}>{k}</label><input id={`sl-${k}`} className={field} value={patient[k]} onChange={e => setPatient(p => ({ ...p, [k]: e.target.value }))} /></div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => printSlip(slipInput)} className="px-6 py-3.5 rounded-xl bg-cyan-500 text-black text-xs font-black uppercase tracking-widest hover:bg-white flex items-center gap-2 cursor-pointer"><Printer size={14} />Print medical slip</button>
          </div>
          <p className="text-[11px] text-zinc-500 mt-3">The slip is information generated by AI. It is not a prescription until a licensed doctor reviews and signs it.</p>
        </section>
      </div>
    </div>
  );
};

export default MedicationPage;
