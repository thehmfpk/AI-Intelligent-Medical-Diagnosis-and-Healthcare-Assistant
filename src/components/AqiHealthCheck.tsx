import React, { useEffect, useMemo, useState } from 'react';
import { HeartPulse, ShieldCheck, Clock, AlertTriangle, ArrowRight, Lock } from 'lucide-react';
import { bandFor, fetchForecast, HourPoint } from '../lib/aqi';
import { assess, CONDITIONS, DEFAULT_PROFILE, LEVELS, hourLabel, Profile, AgeGroup, Activity, Condition } from '../lib/healthRisk';

interface Props {
  place: { name: string; lat: number; lon: number; aqi: number | null } | null;
  onStartCheckup?: () => void;
}

const AGE: { key: AgeGroup; en: string; ur: string }[] = [
  { key: 'child', en: 'Child (under 12)', ur: 'بچہ (12 سال سے کم)' },
  { key: 'adult', en: 'Teen / adult', ur: 'نوجوان / بالغ' },
  { key: 'senior', en: 'Older adult (65+)', ur: 'بزرگ (65+)' },
];
const ACT: { key: Activity; en: string; ur: string }[] = [
  { key: 'indoors', en: 'Mostly indoors', ur: 'زیادہ تر گھر میں' },
  { key: 'commute', en: 'Some time outside', ur: 'کچھ وقت باہر' },
  { key: 'outdoor', en: 'Outdoor work / exercise', ur: 'باہر کام / ورزش' },
];

const Seg = <T extends string>({ items, value, onChange, label }: { items: { key: T; en: string; ur: string }[]; value: T | null; onChange: (k: T) => void; label: string }) => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-2">
    {items.map(i => (
      <button key={i.key} type="button" aria-pressed={value === i.key} onClick={() => onChange(i.key)}
        className={`px-3.5 py-2 rounded-xl border text-sm text-left cursor-pointer transition-colors ${value === i.key ? 'border-cyan-400 bg-cyan-500/15 text-white' : 'border-white/10 text-zinc-300 hover:bg-white/5'}`}>
        {i.en} <span className="font-urdu text-zinc-400 text-[13px] ml-1">{i.ur}</span>
      </button>
    ))}
  </div>
);

const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void; en: string; ur: string }> = ({ on, onChange, en, ur }) => (
  <label className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border cursor-pointer text-sm transition-colors ${on ? 'border-cyan-400 bg-cyan-500/15' : 'border-white/10 hover:bg-white/5'}`}>
    <input type="checkbox" checked={on} onChange={e => onChange(e.target.checked)} className="accent-cyan-400 w-4 h-4" />
    <span className="text-zinc-200">{en} <span className="font-urdu text-zinc-400 text-[13px] ml-1">{ur}</span></span>
  </label>
);

const endHour = (iso: string) => hourLabel(`${iso.slice(0, 11)}${String((parseInt(iso.slice(11, 13), 10) + 1) % 24).padStart(2, '0')}:00`);

const AqiHealthCheck: React.FC<Props> = ({ place, onStartCheckup }) => {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [checked, setChecked] = useState(false);
  const [forecast, setForecast] = useState<HourPoint[]>([]);
  const [fErr, setFErr] = useState(false);
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setProfile(p => ({ ...p, [k]: v }));
  const toggleCond = (c: Condition, on: boolean) => setProfile(p => ({ ...p, conditions: on ? [...p.conditions, c] : p.conditions.filter(x => x !== c) }));

  const key = place ? `${place.lat},${place.lon}` : '';
  useEffect(() => {
    setForecast([]); setFErr(false);
    if (!place) return;
    const ac = new AbortController();
    fetchForecast(place.lat, place.lon, ac.signal).then(setForecast).catch(e => { if (e?.name !== 'AbortError') setFErr(true); });
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const ready = !!place && place.aqi != null && profile.age != null;
  const result = useMemo(() => (checked && ready ? assess(profile, place!.aqi as number, forecast) : null), [checked, ready, profile, place, forecast]);
  const lvl = result ? LEVELS[result.level] : null;
  const band = place?.aqi != null ? bandFor(place.aqi) : null;
  const maxH = Math.max(50, ...forecast.map(f => f.aqi));

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-zinc-950/50 p-5 md:p-8" aria-labelledby="hc-title">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center"><HeartPulse className="text-black" size={20} /></div>
            <h3 id="hc-title" className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic">My health <span className="text-cyan-400">risk</span> check</h3>
          </div>
          <p className="text-zinc-400 text-sm max-w-2xl">Tell us a little about yourself and get precautions for today's air in the place selected on the map.</p>
          <p className="font-urdu text-zinc-500 text-sm mt-1" dir="rtl">اپنے بارے میں بتائیں اور نقشے پر منتخب جگہ کی آج کی ہوا کے مطابق احتیاطیں حاصل کریں۔</p>
        </div>
        {place && band && (
          <div className="rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg" style={{ background: band.color, color: band.text }}>{place.aqi}</span>
            <div><p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Checking for</p><p className="font-bold leading-tight">{place.name}</p><p className="text-[11px] text-zinc-500">{band.en}</p></div>
          </div>
        )}
      </div>

      {!place || place.aqi == null ? (
        <p className="text-sm text-amber-300">Pick a place with live data on the map first (or search for one above).</p>
      ) : (
        <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-8">
          {/* form */}
          <form onSubmit={e => { e.preventDefault(); if (profile.age) setChecked(true); }} className="space-y-5">
            <fieldset><legend className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Age group *</legend>
              <Seg items={AGE} value={profile.age} onChange={k => set('age', k)} label="Age group" /></fieldset>
            <fieldset><legend className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Health conditions (optional)</legend>
              <div className="grid gap-2">{CONDITIONS.map(c => <Toggle key={c.key} on={profile.conditions.includes(c.key)} onChange={v => toggleCond(c.key, v)} en={c.en} ur={c.ur} />)}</div></fieldset>
            <fieldset><legend className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Today you will be</legend>
              <Seg items={ACT} value={profile.activity} onChange={k => set('activity', k)} label="Activity today" /></fieldset>
            <fieldset><legend className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Also</legend>
              <div className="grid gap-2">
                <Toggle on={profile.smoker} onChange={v => set('smoker', v)} en="I smoke" ur="میں سگریٹ پیتا/پیتی ہوں" />
                <Toggle on={profile.hasMask} onChange={v => set('hasMask', v)} en="I have an N95 / KN95 mask" ur="میرے پاس N95 ماسک ہے" />
                <Toggle on={profile.hasPurifier} onChange={v => set('hasPurifier', v)} en="I have an air purifier" ur="میرے پاس ایئر پیوریفائر ہے" />
              </div></fieldset>
            <button type="submit" disabled={!profile.age} className="w-full py-4 rounded-2xl bg-cyan-500 text-black font-black uppercase tracking-widest text-xs hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
              Check my risk <ArrowRight size={15} />
            </button>
            {!profile.age && <p className="text-[11px] text-zinc-500 -mt-2">Choose an age group to continue.</p>}
            <p className="text-[11px] text-zinc-500 flex gap-1.5"><Lock size={12} className="shrink-0 mt-0.5" />Your answers stay in this browser tab. They are not saved or sent anywhere; only the place's coordinates are used to fetch air data.</p>
          </form>

          {/* result */}
          <div>
            {!result || !lvl ? (
              <div className="h-full min-h-[240px] rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-center p-8 text-zinc-500 text-sm">
                Your personal risk level, precautions and the best time to go out will appear here.
              </div>
            ) : (
              <div className="space-y-5" aria-live="polite">
                <div className="rounded-2xl p-5 flex flex-wrap items-center gap-5" style={{ background: lvl.color, color: lvl.text }}>
                  <div className="text-center"><p className="text-4xl font-black leading-none">{result.score}</p><p className="text-[10px] font-mono uppercase mt-1 opacity-80">Your score</p></div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-2xl font-black leading-tight">{lvl.en} <span className="font-urdu text-lg opacity-90">{lvl.ur}</span></p>
                    <p className="text-sm mt-1 opacity-95">{lvl.summary.en}</p>
                    <p className="font-urdu text-sm opacity-90 mt-0.5" dir="rtl">{lvl.summary.ur}</p>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">Score = today's AQI ({place.aqi}) adjusted for your age, conditions and activity. It is a simple guide, not a medical measurement.</p>

                {result.reasons.length > 0 && (
                  <ul className="text-sm text-zinc-300 space-y-1.5">
                    {result.reasons.map((r, i) => <li key={i} className="flex gap-2"><span className="text-cyan-400">•</span><span>{r.en} <span className="font-urdu text-zinc-500 block sm:inline">{r.ur}</span></span></li>)}
                  </ul>
                )}

                <div>
                  <h4 className="font-black uppercase text-sm tracking-tight mb-3 flex items-center gap-2"><ShieldCheck size={16} className="text-cyan-400" />Your precautions</h4>
                  <ul className="space-y-2.5">
                    {result.tips.map((t, i) => (
                      <li key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                        {t.tag && <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-cyan-300 bg-cyan-500/10 rounded px-2 py-0.5 mb-1.5">{t.tag}</span>}
                        <p className="text-sm text-zinc-100 leading-snug">{t.en}</p>
                        <p className="font-urdu text-sm text-zinc-400 mt-1 leading-relaxed" dir="rtl">{t.ur}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 p-4">
                  <h4 className="font-black uppercase text-sm tracking-tight mb-1 flex items-center gap-2"><Clock size={16} className="text-cyan-400" />Next 24 hours in {place.name}</h4>
                  {forecast.length > 0 && result.best ? (
                    <>
                      <p className="text-sm text-zinc-300 mb-3">Cleanest 3 hours: <b className="text-white">{hourLabel(result.best.from)} – {endHour(result.best.to)}</b> (average AQI {result.best.avg}). Plan outdoor errands then.</p>
                      <div className="flex items-end gap-[3px] h-24" role="img" aria-label="Hourly AQI forecast for the next 24 hours">
                        {forecast.map(f => {
                          const b = bandFor(f.aqi);
                          const inBest = f.time >= result.best!.from && f.time <= result.best!.to;
                          return <div key={f.time} title={`${hourLabel(f.time)}: AQI ${f.aqi}`} className={`flex-1 rounded-t ${inBest ? 'ring-2 ring-white' : ''}`} style={{ height: `${Math.max(8, (f.aqi / maxH) * 100)}%`, background: b.color }} />;
                        })}
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1"><span>{hourLabel(forecast[0].time)}</span><span>{hourLabel(forecast[Math.floor(forecast.length / 2)].time)}</span><span>{hourLabel(forecast[forecast.length - 1].time)}</span></div>
                    </>
                  ) : <p className="text-sm text-zinc-500">{fErr ? 'Could not load the forecast right now.' : 'Loading forecast…'}</p>}
                </div>

                <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.06] p-4">
                  <h4 className="font-black uppercase text-sm tracking-tight mb-2 flex items-center gap-2 text-red-300"><AlertTriangle size={16} />When to get help</h4>
                  <ul className="space-y-2">{result.seek.map((t, i) => <li key={i}><p className="text-sm text-zinc-200">{t.en}</p><p className="font-urdu text-sm text-zinc-400" dir="rtl">{t.ur}</p></li>)}</ul>
                  {onStartCheckup && <button onClick={onStartCheckup} type="button" className="mt-4 px-5 py-2.5 rounded-xl border border-white/15 text-xs font-bold hover:bg-white/10 flex items-center gap-2 cursor-pointer">Feeling unwell? Start a symptom checkup <ArrowRight size={13} /></button>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AqiHealthCheck;
