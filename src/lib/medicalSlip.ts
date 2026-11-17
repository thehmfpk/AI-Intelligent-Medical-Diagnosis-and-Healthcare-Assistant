import type { DiseaseInfo } from '../data/medicalData';
import { describeAll, buildSchedule, SLOT_INFO, FOOD_TEXT } from './medicineGuide';

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export interface SlipInput {
  info: DiseaseInfo;
  symptoms: string[];
  match?: number;
  patient?: { name?: string; age?: string; gender?: string; phone?: string; city?: string };
}

export function slipNumber(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `MS-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

/** A4 medical slip as a standalone HTML document (light, print-friendly). */
export function buildSlipHtml({ info, symptoms, match, patient = {} }: SlipInput): string {
  const now = new Date();
  const items = describeAll(info.Medication);
  const { schedule, asNeeded, other } = buildSchedule(items);
  const blank = '<span class="blank"></span>';
  const field = (l: string, v?: string) => `<div class="f"><label>${l}</label><div class="v">${v ? esc(v) : blank}</div></div>`;

  const rows = items
    .filter(i => i.profile.slots.length > 0 || i.profile.asNeeded)
    .map((i, n) => `<tr>
      <td>${n + 1}</td>
      <td><b>${esc(i.name)}</b>${i.examples.length ? `<br><small>e.g. ${esc(i.examples.join(', '))}</small>` : ''}</td>
      <td>${esc(i.profile.label)}<br><small>${esc(i.profile.purpose)}</small></td>
      <td>${i.profile.asNeeded ? 'As needed' : i.profile.slots.map(s => `${SLOT_INFO[s].label} (${SLOT_INFO[s].time})`).join('<br>')}</td>
      <td>${esc(FOOD_TEXT[i.profile.food])}</td>
      <td>${esc(i.profile.duration)}</td></tr>`).join('');

  const sched = schedule.filter(s => s.items.length).map(s =>
    `<div class="slot"><b>${SLOT_INFO[s.slot].label} · ${SLOT_INFO[s.slot].time}</b><ul>${s.items.map(i => `<li>${esc(i.name)}</li>`).join('')}</ul></div>`).join('');

  const care = [...other.map(i => i.name)];
  const prec = [info.Precaution_1, info.Precaution_2, info.Precaution_3, info.Precaution_4].filter(Boolean);

  return `<!doctype html><html><head><meta charset="utf-8"><title>Medical Slip ${slipNumber(now)}</title>
<style>
@page{size:A4;margin:14mm}
*{box-sizing:border-box}
body{font-family:Georgia,'Times New Roman',serif;color:#0f172a;font-size:10.5px;line-height:1.38;margin:0}
.head{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0e7490;padding-bottom:10px}
.brand{display:flex;align-items:center;gap:10px}
.logo{width:42px;height:42px;border-radius:10px;background:#0e7490;color:#fff;display:flex;align-items:center;justify-content:center;font:700 22px Arial}
h1{margin:0;font:800 22px Arial;letter-spacing:-.5px}h1 span{color:#0e7490}
.sub{font:600 9px Arial;letter-spacing:.2em;text-transform:uppercase;color:#64748b}
.meta{text-align:right;font:11px Arial}.meta b{font-size:13px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px 14px;margin:12px 0}
.f label{display:block;font:700 8.5px Arial;letter-spacing:.12em;text-transform:uppercase;color:#64748b}
.v{border-bottom:1px solid #94a3b8;min-height:18px;padding:1px 0;font-weight:600}.blank{display:inline-block;width:100%}
h2{font:800 11px Arial;letter-spacing:.14em;text-transform:uppercase;color:#0e7490;margin:14px 0 6px;border-left:4px solid #0e7490;padding-left:8px}
.rx{font:700 30px Georgia;color:#0e7490;margin:10px 0 0}
table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:5px 6px;vertical-align:top;text-align:left}
th{background:#ecfeff;font:700 9px Arial;letter-spacing:.08em;text-transform:uppercase}small{color:#475569}
.chips span{display:inline-block;border:1px solid #94a3b8;border-radius:99px;padding:1px 8px;margin:0 4px 4px 0;font-size:10.5px}
.sched{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.slot{border:1px solid #cbd5e1;border-radius:6px;padding:6px 8px}.slot ul{margin:4px 0 0;padding-left:14px}
.two{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}ul{margin:0;padding-left:16px}
.warn{border:1.5px solid #dc2626;background:#fef2f2;border-radius:6px;padding:7px 10px;margin-top:12px;font:11px Arial}
.sign{display:flex;justify-content:space-between;margin-top:24px;font:10px Arial}.sign div{width:46%;border-top:1px solid #0f172a;padding-top:4px;text-align:center}
.foot{margin-top:14px;border-top:1px solid #cbd5e1;padding-top:6px;font:9px Arial;color:#64748b;text-align:center}
tr,.slot,.warn{break-inside:avoid}
</style></head><body>
<div class="head"><div class="brand"><div class="logo">+</div><div><h1>DR.<span>HMF</span></h1><div class="sub">AI Medical Assistant · www.drhmf.site</div></div></div>
<div class="meta"><div>Slip No.: <b>${slipNumber(now)}</b></div><div>Date: ${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div><div>Time: ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div></div></div>

<h2>Patient</h2>
<div class="grid">${field('Name', patient.name)}${field('Age', patient.age)}${field('Gender', patient.gender)}${field('Phone', patient.phone)}${field('City', patient.city)}${field('Weight / Allergies', '')}</div>

<h2>Reported symptoms</h2>
<div class="chips">${symptoms.length ? symptoms.map(s => `<span>${esc(s)}</span>`).join('') : '<small>Not recorded</small>'}</div>

<h2>Assessment (AI symptom matching)</h2>
<p style="margin:0"><b style="text-transform:capitalize">${esc(info.Disease)}</b><br><small>${esc(info.Description)}</small></p>

<div class="rx">&#8478;</div>
<table><thead><tr><th>#</th><th>Medicine type</th><th>Used for</th><th>When</th><th>Food</th><th>Duration</th></tr></thead>
<tbody>${rows || '<tr><td colspan="6">No scheduled medicines for this condition. See care advice below.</td></tr>'}</tbody></table>
<p style="margin:6px 0 0"><small>Doses (mg) are intentionally not written here. They must be set by the treating doctor or pharmacist for age, weight and other conditions.</small></p>

${sched ? `<h2>Daily follow-up</h2><div class="sched">${sched}</div>` : ''}
${asNeeded.length ? `<p style="margin:8px 0 0"><b>As needed:</b> ${asNeeded.map(i => esc(i.name)).join('; ')}</p>` : ''}

<div class="two">
<div><h2>Precautions</h2><ul>${prec.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>
<div><h2>Care and non-drug treatment</h2><ul>${(care.length ? care : ['Rest and fluids', 'Follow-up if not improving']).map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>
${info.Diet?.length ? `<div><h2>Diet</h2><ul>${info.Diet.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div>` : ''}
</div>

<div class="warn"><b>Seek urgent care</b> for chest pain, trouble breathing, fainting, confusion, heavy bleeding or any rapid worsening. Call <b>Rescue 1122</b> or <b>Edhi 115</b>. Review with a doctor if not better in 2 to 3 days.</div>

<div class="sign"><div>Patient signature</div><div>Doctor's signature and stamp<br><small>Required before using any medicine</small></div></div>
<div class="foot">Generated by Dr.HMF AI for information only. This slip is not a prescription and is not a diagnosis. It becomes valid only when reviewed and signed by a licensed doctor.</div>
</body></html>`;
}

/** Prints the slip through a hidden iframe so the page itself is untouched. */
export function printSlip(input: SlipInput) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument!;
  doc.open(); doc.write(buildSlipHtml(input)); doc.close();
  const go = () => { iframe.contentWindow!.focus(); iframe.contentWindow!.print(); setTimeout(() => iframe.remove(), 2000); };
  if (doc.readyState === 'complete') setTimeout(go, 100); else iframe.onload = () => setTimeout(go, 100);
}
