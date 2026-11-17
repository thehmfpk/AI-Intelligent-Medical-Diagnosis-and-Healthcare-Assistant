/**
 * Appointment booking logic: department triage from the patient's own words,
 * time-slot generation and recommendation, a bilingual confirmation message,
 * and a calendar file. Everything runs in the browser; bookings are kept in
 * this browser's local storage.
 */
import { extractSymptoms, hasRedFlag, mentionsSelfHarm, detectLanguage, Lang } from './symptomMatcher';

export type Urgency = 'emergency' | 'priority' | 'routine';
export type VisitMode = 'clinic' | 'video' | 'phone';

export interface Department {
  id: string;
  en: string;
  ur: string;
  /** Symptom-name fragments that point to this department. */
  hints: RegExp;
}

export const DEPARTMENTS: Department[] = [
  { id: 'general', en: 'General Medicine', ur: 'جنرل میڈیسن', hints: /fever|fatigue|weakness|weight|body ache|chills|sweating/ },
  { id: 'cardiology', en: 'Cardiology', ur: 'امراضِ قلب', hints: /chest|palpitation|heart|irregular heartbeat|blood pressure/ },
  { id: 'pulmonology', en: 'Pulmonology', ur: 'امراضِ سینہ', hints: /cough|breath|wheez|sputum|lung|asthma|nasal congestion(?!.*ear)/ },
  { id: 'neurology', en: 'Neurology', ur: 'اعصابی امراض', hints: /headache|dizz|seizure|numb|tremor|memory|paralysis|fainting|weakness of one|coordination/ },
  { id: 'dermatology', en: 'Dermatology', ur: 'جلدی امراض', hints: /skin|rash|itch|acne|mole|hair|wart|lesion|bump|dry|scalp|nail/ },
  { id: 'gastro', en: 'Gastroenterology', ur: 'معدہ و آنت', hints: /abdominal|stomach|vomit|nausea|diarrh|constipation|stool|heartburn|bloating|rectal|swallow|regurgit/ },
  { id: 'ent', en: 'ENT (Ear, Nose, Throat)', ur: 'ناک کان گلا', hints: /ear|hearing|throat|sinus|nasal|voice|tonsil|hoarse|nose|mouth|tooth|gum/ },
  { id: 'eye', en: 'Ophthalmology', ur: 'آنکھوں کے امراض', hints: /eye|vision|eyelid|blurr|pupil/ },
  { id: 'ortho', en: 'Orthopedics', ur: 'ہڈی و جوڑ', hints: /joint|back|knee|neck|shoulder|bone|muscle|leg|hip|ankle|foot|wrist|elbow|hand|arm|limb|swelling|stiff/ },
  { id: 'psychiatry', en: 'Mental Health', ur: 'دماغی صحت', hints: /anxiety|depress|insomnia|hallucin|suicid|panic|mood|anger|delusion|psychotic|nervous|behavior/ },
  { id: 'urology', en: 'Urology', ur: 'گردہ و مثانہ', hints: /urin|kidney|bladder|prostate|testic|penis|impoten|flank/ },
  { id: 'gynecology', en: 'Gynecology', ur: 'خواتین کے امراض', hints: /pregnan|vagin|menstru|breast|pelvic|period|ovar|uterine|cramp/ },
];

export const deptById = (id: string) => DEPARTMENTS.find(d => d.id === id) ?? DEPARTMENTS[0];

export interface Triage {
  symptoms: string[];
  department: string;
  urgency: Urgency;
  /** Short reasons the assistant shows to the patient. */
  reasons: { en: string; ur: string };
}

/** Reads the patient's reason for visiting and suggests a department and urgency. */
export function triage(reason: string, knownSymptoms: string[] = []): Triage {
  const { found } = reason.trim() ? extractSymptoms(reason) : { found: [] as string[] };
  const symptoms = Array.from(new Set([...knownSymptoms, ...found]));
  const crisis = mentionsSelfHarm(reason);

  const scores = new Map<string, number>();
  for (const s of symptoms) {
    for (const d of DEPARTMENTS) if (d.id !== 'general' && d.hints.test(s)) scores.set(d.id, (scores.get(d.id) ?? 0) + 1);
  }
  let department = 'general';
  let best = 0;
  for (const [id, n] of scores) if (n > best) { best = n; department = id; }
  if (crisis) department = 'psychiatry';

  let urgency: Urgency = 'routine';
  if (crisis || hasRedFlag(symptoms)) urgency = 'emergency';
  else if (symptoms.length >= 4 || symptoms.some(s => /fever|bleeding|severe|blood/.test(s))) urgency = 'priority';

  const dep = deptById(department);
  const reasons = {
    en:
      symptoms.length === 0
        ? 'No symptoms detected yet, so General Medicine is suggested. Add details for a better match.'
        : `${symptoms.length} symptom${symptoms.length === 1 ? '' : 's'} read from your description point to ${dep.en}.`,
    ur:
      symptoms.length === 0
        ? 'ابھی کوئی علامت نہیں ملی، اس لیے جنرل میڈیسن تجویز کی گئی ہے۔ بہتر نتیجے کے لیے مزید تفصیل لکھیں۔'
        : `آپ کی تفصیل سے ${symptoms.length} علامات ملیں جو ${dep.ur} کی طرف اشارہ کرتی ہیں۔`,
  };
  return { symptoms, department, urgency, reasons };
}

// --- Slots -----------------------------------------------------------------

export interface Booking {
  id: string;
  ref: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  city: string;
  department: string;
  mode: VisitMode;
  reason: string;
  symptoms: string[];
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  urgency: Urgency;
  lang: Lang;
  createdAt: string;
}

export const pad = (n: number) => String(n).padStart(2, '0');
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromISODate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** The next `count` days the service is open (closed on Sundays). */
export function upcomingDays(count = 14, from = new Date()): string[] {
  const out: string[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (out.length < count) {
    if (d.getDay() !== 0) out.push(toISODate(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** 30-minute slots: 09:00-13:00 and 15:00-20:00. */
export function daySlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h < 13; h++) for (const m of [0, 30]) slots.push(`${pad(h)}:${pad(m)}`);
  for (let h = 15; h < 20; h++) for (const m of [0, 30]) slots.push(`${pad(h)}:${pad(m)}`);
  return slots;
}

export const slotDate = (date: string, time: string) => {
  const [h, m] = time.split(':').map(Number);
  const d = fromISODate(date);
  d.setHours(h, m, 0, 0);
  return d;
};

export function isSlotTaken(bookings: Booking[], date: string, time: string, department: string): boolean {
  return bookings.some(b => b.date === date && b.time === time && b.department === department);
}

export function isSlotPast(date: string, time: string, now = new Date(), minLeadMinutes = 30): boolean {
  return slotDate(date, time).getTime() < now.getTime() + minLeadMinutes * 60000;
}

export interface SlotSuggestion {
  date: string;
  time: string;
  why: { en: string; ur: string };
}

/**
 * Picks up to three free slots. Urgent cases get the earliest openings;
 * routine cases get the earliest slot on each of the next days, mornings first.
 */
export function recommendSlots(bookings: Booking[], department: string, urgency: Urgency, now = new Date()): SlotSuggestion[] {
  const out: SlotSuggestion[] = [];
  const days = upcomingDays(10, now);
  if (urgency !== 'routine') {
    for (const d of days) {
      for (const t of daySlots()) {
        if (isSlotPast(d, t, now) || isSlotTaken(bookings, d, t, department)) continue;
        out.push({
          date: d,
          time: t,
          why: {
            en: out.length === 0 ? 'Earliest opening, recommended for your symptoms' : 'Next earliest opening',
            ur: out.length === 0 ? 'سب سے جلدی دستیاب وقت، آپ کی علامات کے لیے تجویز کردہ' : 'اگلا قریب ترین وقت',
          },
        });
        if (out.length === 3) return out;
      }
    }
    return out;
  }
  for (const d of days) {
    const t = daySlots().find(s => !isSlotPast(d, s, now, 180) && !isSlotTaken(bookings, d, s, department));
    if (t) {
      out.push({ date: d, time: t, why: { en: out.length === 0 ? 'First comfortable opening' : 'Another early opening', ur: out.length === 0 ? 'پہلا مناسب وقت' : 'ایک اور جلدی کا وقت' } });
      if (out.length === 3) break;
    }
  }
  return out;
}

// --- Storage ---------------------------------------------------------------

const KEY = 'dr_hmf_appointments_v1';

export function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

export function saveBooking(b: Booking) {
  try {
    localStorage.setItem(KEY, JSON.stringify([b, ...loadBookings()].slice(0, 50)));
  } catch {
    /* storage unavailable: the on-screen confirmation still works */
  }
}

export function makeRef(date: Date = new Date()): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HMF-${String(date.getFullYear()).slice(2)}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${rand}`;
}

// --- Formatting ------------------------------------------------------------

export function formatDate(date: string, lang: Lang | 'en' = 'en'): string {
  return new Intl.DateTimeFormat(lang === 'ur' ? 'ur-PK-u-nu-latn' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(fromISODate(date));
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${suffix}`;
}

export const MODE_LABEL: Record<VisitMode, { en: string; ur: string }> = {
  clinic: { en: 'Clinic visit', ur: 'کلینک میں ملاقات' },
  video: { en: 'Video consultation', ur: 'ویڈیو مشاورت' },
  phone: { en: 'Phone consultation', ur: 'فون پر مشاورت' },
};

export const URGENCY_LABEL: Record<Urgency, { en: string; ur: string }> = {
  emergency: { en: 'Urgent attention advised', ur: 'فوری توجہ ضروری' },
  priority: { en: 'Priority', ur: 'ترجیحی' },
  routine: { en: 'Routine', ur: 'معمول' },
};

// --- Confirmation message --------------------------------------------------

export interface Confirmation {
  title: string;
  greeting: string;
  summary: string[];
  prepare: string[];
  advice: string;
  emergency: string;
}

/** Builds the confirmation text in English or Urdu from the booking details. */
export function composeConfirmation(b: Booking, lang: Lang): Confirmation {
  const dep = deptById(b.department);
  const when = `${formatDate(b.date, lang)}, ${formatTime(b.time)}`;
  const reasonKeys = b.symptoms.join(' ');
  const hasFever = /fever/.test(reasonKeys);
  const hasPain = /pain|ache/.test(reasonKeys);
  const hasStomach = /abdominal|vomit|nausea|diarrh/.test(reasonKeys);

  if (lang === 'ur') {
    const prepare = [
      'وقت سے 15 منٹ پہلے پہنچیں یا ویڈیو/فون کال کے لیے تیار رہیں۔',
      'پرانی رپورٹس، نسخے اور استعمال ہونے والی ادویات کی فہرست ساتھ رکھیں۔',
      'علامات کب شروع ہوئیں اور کیسے بدلیں، یہ لکھ لیں۔',
    ];
    if (hasFever) prepare.push('بخار کا درجۂ حرارت دن میں دو بار ناپ کر لکھ لیں۔');
    if (hasPain) prepare.push('درد کی جگہ اور شدت (1 سے 10) نوٹ کریں۔');
    if (hasStomach) prepare.push('کھانے پینے میں جو کچھ لیا اس کا مختصر ریکارڈ رکھیں۔');
    return {
      title: 'آپ کی اپوائنٹمنٹ کنفرم ہو گئی ہے',
      greeting: `محترم ${b.name}، ڈاکٹر ایچ ایم ایف کے نظام نے آپ کے لیے وقت محفوظ کر لیا ہے۔`,
      summary: [
        `ریفرنس نمبر: ${b.ref}`,
        `شعبہ: ${dep.ur}`,
        `تاریخ اور وقت: ${when}`,
        `طریقہ: ${MODE_LABEL[b.mode].ur}`,
        `ترجیح: ${URGENCY_LABEL[b.urgency].ur}`,
      ],
      prepare,
      advice:
        b.urgency === 'routine'
          ? 'اگر آپ کی حالت بگڑ جائے تو ملاقات کا انتظار نہ کریں، فوراً طبی مدد لیں۔'
          : 'آپ کی علامات کی بنیاد پر یہ جلد کا وقت دیا گیا ہے۔ حالت بگڑنے پر انتظار نہ کریں۔',
      emergency: 'ہنگامی صورت میں ریسکیو 1122 یا ایدھی 115 پر کال کریں۔',
    };
  }

  const prepare = [
    'Arrive 15 minutes early, or be ready a few minutes before a video or phone call.',
    'Bring previous reports, prescriptions and a list of medicines you take.',
    'Write down when the symptoms started and how they changed.',
  ];
  if (hasFever) prepare.push('Measure and note your temperature twice a day.');
  if (hasPain) prepare.push('Note where the pain is and how strong it is (1 to 10).');
  if (hasStomach) prepare.push('Keep a short note of what you ate and drank.');
  return {
    title: 'Your appointment is confirmed',
    greeting: `Dear ${b.name}, the Dr.HMF scheduling assistant has reserved a time for you.`,
    summary: [
      `Reference: ${b.ref}`,
      `Department: ${dep.en}`,
      `Date and time: ${when}`,
      `Type: ${MODE_LABEL[b.mode].en}`,
      `Priority: ${URGENCY_LABEL[b.urgency].en}`,
    ],
    prepare,
    advice:
      b.urgency === 'routine'
        ? 'If you get worse before the visit, do not wait for the appointment. Get medical help right away.'
        : 'Based on your symptoms you were given an early slot. If you get worse, do not wait for it.',
    emergency: 'In an emergency call Rescue 1122 or Edhi 115.',
  };
}

export function confirmationText(b: Booking, lang: Lang): string {
  const c = composeConfirmation(b, lang);
  return [c.title, '', c.greeting, '', ...c.summary, '', ...c.prepare.map(p => `- ${p}`), '', c.advice, c.emergency].join('\n');
}

/** An .ics calendar file for the appointment (30 minutes). */
export function buildIcs(b: Booking): string {
  const start = slotDate(b.date, b.time);
  const end = new Date(start.getTime() + 30 * 60000);
  const f = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const dep = deptById(b.department);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dr.HMF//Appointment//EN',
    'BEGIN:VEVENT',
    `UID:${b.id}@drhmf.site`,
    `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    `SUMMARY:Dr.HMF appointment - ${dep.en}`,
    `DESCRIPTION:Reference ${b.ref}. ${MODE_LABEL[b.mode].en}. Arrive 15 minutes early.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/** Language to write the confirmation in, from the patient's own text. */
export function pickLang(reason: string, browserPrefersUrdu: boolean): Lang {
  if (reason.trim() && detectLanguage(reason) === 'ur') return 'ur';
  return browserPrefersUrdu && !reason.trim() ? 'ur' : 'en';
}
