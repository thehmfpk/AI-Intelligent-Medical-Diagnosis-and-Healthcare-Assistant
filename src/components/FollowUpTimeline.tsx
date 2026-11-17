import React from 'react';
import { Sunrise, Sun, Sunset, Moon, Clock, Utensils } from 'lucide-react';
import { buildSchedule, SLOT_INFO, FOOD_TEXT, MedicineItem, DoseSlot } from '../lib/medicineGuide';

const ICONS = { sunrise: Sunrise, sun: Sun, sunset: Sunset, moon: Moon };

/** Daily plan: which medicine goes in which time slot, plus as-needed and non-drug care. */
const FollowUpTimeline: React.FC<{ items: MedicineItem[] }> = ({ items }) => {
  const { schedule, asNeeded, other } = buildSchedule(items);
  const filled = schedule.filter(s => s.items.length > 0);
  return (
    <div>
      {filled.length === 0 ? (
        <p className="text-sm text-zinc-400">None of the suggestions here are taken at fixed times of day. See "As needed" and "Care and procedures" below.</p>
      ) : (
        <ol className="relative border-l border-cyan-500/30 ml-3 space-y-5">
          {filled.map(({ slot, items: its }) => {
            const info = SLOT_INFO[slot as DoseSlot];
            const Icon = ICONS[info.icon];
            return (
              <li key={slot} className="pl-6 relative">
                <span className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-zinc-950 border border-cyan-500/50 flex items-center justify-center"><Icon size={13} className="text-cyan-400" /></span>
                <div className="flex items-baseline gap-2 mb-2">
                  <h4 className="font-black text-white">{info.label}</h4>
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1"><Clock size={11} />{info.time}</span>
                </div>
                <ul className="space-y-2">
                  {its.map(i => (
                    <li key={i.raw} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                      <p className="text-sm text-white font-semibold">{i.name}{i.examples.length > 0 && <span className="text-zinc-400 font-normal"> ({i.examples.join(', ')})</span>}</p>
                      <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5"><Utensils size={11} />{FOOD_TEXT[i.profile.food]}</p>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      )}
      {asNeeded.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <h4 className="text-xs font-mono font-black uppercase tracking-widest text-amber-400 mb-2">As needed</h4>
          <ul className="text-sm text-zinc-300 space-y-1 list-disc pl-5">{asNeeded.map(i => (<li key={i.raw}>{i.name}: {i.profile.tip}</li>))}</ul>
        </div>
      )}
      {other.length > 0 && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h4 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-400 mb-2">Care and procedures</h4>
          <ul className="text-sm text-zinc-300 space-y-1 list-disc pl-5">{other.map(i => (<li key={i.raw}>{i.name}</li>))}</ul>
        </div>
      )}
    </div>
  );
};

export default FollowUpTimeline;
