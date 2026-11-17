/**
 * Turns the medication lines of a disease ("Antihistamines (e.g., Loratadine)")
 * into a patient-friendly guide: what it is for, what it looks like, when it is
 * usually taken and how, and what to watch for.
 *
 * This is general educational information about each medicine class. It is not
 * a prescription and gives no doses; the doctor's or pharmacist's instructions
 * always come first.
 */

export type DoseSlot = 'morning' | 'afternoon' | 'evening' | 'night';
export type Form =
  | 'tablet' | 'capsule' | 'syrup' | 'cream' | 'drops' | 'spray' | 'inhaler'
  | 'injection' | 'sachet' | 'device' | 'care' | 'procedure';
export type FoodRule = 'before' | 'after' | 'with' | 'empty' | 'any';

export interface MedicineProfile {
  id: string;
  label: string;
  /** What this kind of medicine does, in plain words. */
  purpose: string;
  form: Form;
  /** Times of day it is normally taken. Empty = not a scheduled medicine. */
  slots: DoseSlot[];
  asNeeded?: boolean;
  food: FoodRule;
  /** How long it is usually used. */
  duration: string;
  tip: string;
  warning?: string;
  /** Accent colour used for its picture and chips. */
  color: string;
}

export interface MedicineItem {
  raw: string;
  /** Display name without the "(e.g., ...)" part. */
  name: string;
  /** Example drug names found in the line, if any. */
  examples: string[];
  /** What to search for when looking for it in a pharmacy. */
  searchTerm: string | null;
  profile: MedicineProfile;
}

const P = (p: MedicineProfile) => p;

const PROFILES: Record<string, MedicineProfile> = {
  antibiotic: P({ id: 'antibiotic', label: 'Antibiotic', purpose: 'Kills or stops the bacteria causing the infection.', form: 'capsule', slots: ['morning', 'evening'], food: 'after', duration: 'Complete the full course (usually 5 to 7 days)', tip: 'Take at the same times each day, about 12 hours apart.', warning: 'Do not stop early even if you feel better. Only use it if a doctor confirms a bacterial infection.', color: '#0ea5e9' }),
  antifungal: P({ id: 'antifungal', label: 'Antifungal', purpose: 'Treats infections caused by fungus or yeast.', form: 'tablet', slots: ['morning'], food: 'after', duration: 'Days to weeks, as prescribed', tip: 'Take once a day with a meal for better absorption.', color: '#a855f7' }),
  antiviral: P({ id: 'antiviral', label: 'Antiviral', purpose: 'Slows down the virus and helps the body recover.', form: 'capsule', slots: ['morning', 'evening'], food: 'any', duration: 'Short course, started early', tip: 'Works best when started early in the illness.', color: '#14b8a6' }),
  analgesic: P({ id: 'analgesic', label: 'Pain / fever relief', purpose: 'Eases pain, swelling or fever.', form: 'tablet', slots: [], asNeeded: true, food: 'after', duration: 'Only while you have pain or fever', tip: 'Keep at least 6 hours between doses and take it after food.', warning: 'Do not exceed the daily limit on the label. Avoid combining several pain medicines.', color: '#f97316' }),
  antihistamine: P({ id: 'antihistamine', label: 'Allergy relief', purpose: 'Calms allergy symptoms such as itching, sneezing and watery eyes.', form: 'tablet', slots: ['night'], food: 'any', duration: 'While symptoms last', tip: 'Many cause drowsiness, so night time is usually best.', warning: 'Avoid driving if you feel sleepy.', color: '#22c55e' }),
  steroid: P({ id: 'steroid', label: 'Anti-inflammatory steroid', purpose: 'Reduces strong inflammation and allergic reactions.', form: 'tablet', slots: ['morning'], food: 'after', duration: 'Short course, as prescribed', tip: 'Best taken in the morning with breakfast.', warning: 'Never stop a long course suddenly without your doctor.', color: '#ef4444' }),
  inhaler: P({ id: 'inhaler', label: 'Inhaler / breathing medicine', purpose: 'Opens the airways and makes breathing easier.', form: 'inhaler', slots: ['morning', 'night'], food: 'any', duration: 'Regularly, or when breathless', tip: 'Rinse your mouth after steroid inhalers. Use a spacer if you have one.', color: '#38bdf8' }),
  stomach: P({ id: 'stomach', label: 'Stomach / acidity medicine', purpose: 'Lowers stomach acid and protects the stomach lining.', form: 'tablet', slots: ['morning', 'night'], food: 'before', duration: '2 to 8 weeks, as advised', tip: 'Take 30 minutes before a meal for best effect.', color: '#eab308' }),
  gut: P({ id: 'gut', label: 'Digestive support', purpose: 'Settles the stomach, controls vomiting or diarrhoea, or restores gut balance.', form: 'sachet', slots: ['morning', 'afternoon', 'evening'], food: 'any', duration: 'Until the stomach settles', tip: 'Sip fluids little by little through the day.', warning: 'See a doctor if there is blood, severe pain or you cannot keep fluids down.', color: '#84cc16' }),
  laxative: P({ id: 'laxative', label: 'Laxative / fibre', purpose: 'Softens stool and relieves constipation.', form: 'syrup', slots: ['night'], food: 'any', duration: 'Short term', tip: 'Drink plenty of water and add fibre to your meals.', color: '#10b981' }),
  heart: P({ id: 'heart', label: 'Heart and blood pressure', purpose: 'Protects the heart, controls blood pressure or removes extra fluid.', form: 'tablet', slots: ['morning'], food: 'any', duration: 'Long term, as prescribed', tip: 'Take at the same time every day. Do not skip doses.', warning: 'Chest pain, fainting or severe breathlessness is an emergency.', color: '#e11d48' }),
  statin: P({ id: 'statin', label: 'Cholesterol medicine', purpose: 'Lowers cholesterol and protects blood vessels.', form: 'tablet', slots: ['night'], food: 'any', duration: 'Long term', tip: 'Usually taken in the evening or at bedtime.', color: '#f43f5e' }),
  mind: P({ id: 'mind', label: 'Mood and mind medicine', purpose: 'Balances mood, anxiety, sleep or thinking.', form: 'tablet', slots: ['morning'], food: 'any', duration: 'Weeks to months, reviewed by your doctor', tip: 'Take regularly. Effects often build up over 2 to 4 weeks.', warning: 'Never stop suddenly. Tell your doctor about any thoughts of self-harm.', color: '#8b5cf6' }),
  nerve: P({ id: 'nerve', label: 'Nerve and pain medicine', purpose: 'Calms nerve pain and prevents attacks.', form: 'capsule', slots: ['night'], food: 'any', duration: 'As prescribed', tip: 'Often taken at night because it can cause drowsiness.', color: '#6366f1' }),
  hormone: P({ id: 'hormone', label: 'Hormone / diabetes medicine', purpose: 'Controls blood sugar or balances hormones.', form: 'tablet', slots: ['morning', 'evening'], food: 'with', duration: 'Long term, as prescribed', tip: 'Take with meals and keep regular meal times.', warning: 'Check blood sugar as advised by your doctor.', color: '#d946ef' }),
  vitamin: P({ id: 'vitamin', label: 'Vitamin / supplement', purpose: 'Replaces missing nutrients and supports recovery.', form: 'tablet', slots: ['morning'], food: 'with', duration: 'Weeks to months', tip: 'Take with breakfast. Iron works best with vitamin C and away from tea.', color: '#f59e0b' }),
  urology: P({ id: 'urology', label: 'Urinary / prostate medicine', purpose: 'Relieves urinary pain or eases urine flow.', form: 'capsule', slots: ['night'], food: 'after', duration: 'As prescribed', tip: 'Drink enough water through the day.', color: '#06b6d4' }),
  joint: P({ id: 'joint', label: 'Gout / joint / immune medicine', purpose: 'Prevents flare-ups and controls joint or immune inflammation.', form: 'tablet', slots: ['morning'], food: 'after', duration: 'Long term, reviewed regularly', tip: 'Take daily and keep follow-up blood tests.', color: '#fb923c' }),
  topical: P({ id: 'topical', label: 'Cream / ointment / local treatment', purpose: 'Treats the affected skin, eye, ear or mouth area directly.', form: 'cream', slots: ['morning', 'night'], food: 'any', duration: 'Until healed, as directed', tip: 'Wash your hands first and apply a thin layer on clean, dry skin.', color: '#2dd4bf' }),
  drops: P({ id: 'drops', label: 'Drops / spray', purpose: 'Treats the eye, ear or nose directly.', form: 'drops', slots: ['morning', 'afternoon', 'night'], food: 'any', duration: 'As directed', tip: 'Do not touch the dropper tip to your eye, ear or nose.', color: '#22d3ee' }),
  injection: P({ id: 'injection', label: 'Injection (given by a clinician)', purpose: 'Given by a doctor or nurse for faster or targeted effect.', form: 'injection', slots: [], food: 'any', duration: 'Single dose or a short series', tip: 'This is arranged at the clinic or hospital.', color: '#64748b' }),
  hospital: P({ id: 'hospital', label: 'Hospital treatment', purpose: 'Given in hospital for severe or urgent cases.', form: 'procedure', slots: [], food: 'any', duration: 'During hospital care', tip: 'Not something to take at home. Seek medical care if advised.', color: '#dc2626' }),
  procedure: P({ id: 'procedure', label: 'Procedure / surgery', purpose: 'A treatment done by a specialist when medicine alone is not enough.', form: 'procedure', slots: [], food: 'any', duration: 'Decided by your specialist', tip: 'Ask your specialist about risks, recovery and alternatives.', color: '#475569' }),
  therapy: P({ id: 'therapy', label: 'Therapy / supportive care', purpose: 'Non-drug care that helps recovery.', form: 'care', slots: [], food: 'any', duration: 'As advised', tip: 'Follow the routine your therapist or doctor gives you.', color: '#0d9488' }),
  general: P({ id: 'general', label: 'Medicine (as prescribed)', purpose: 'Part of the usual treatment for this condition.', form: 'tablet', slots: ['morning'], food: 'any', duration: 'As prescribed', tip: 'Take exactly as your doctor or pharmacist instructs.', color: '#0ea5e9' }),
};

// Order matters: the first matching rule wins.
const RULES: [RegExp, keyof typeof PROFILES][] = [
  [/\b(iv |intravenous|vasopressor|infusion|thrombolytic|magnesium sulfate|octreotide|hospitali[sz]ation|source control|glucagon|nebulized epinephrine|epinephrine \(for anaphylaxis\)|blood transfusion|npo|nutritional support|tpn|isoproterenol|ors? \()/i, 'hospital'],
  [/\b(surgery|surgical|tympano|cholecystectomy|appendectomy|laminectomy|tympan|hysterectomy|excision|incision|drainage|discectomy|ligation|turp|uppp|snare|cryotherapy|laser|endoscopic|pacemaker|dialysis|replacement|curettage|hemostasis|pci|decompression|electrosurgical|root canal|fillings|scaling|histopathology|chemical peel|auto-inflation|tubes)/i, 'procedure'],
  [/\b(injection|injections|injectable|auto-injector|immunotherapy|nerve blocks?|biologic|adalimumab|omalizumab|interferon|glatiramer|natalizumab|anti-vegf|enzyme replacement|immunoglobulin|epinephrine|injectables)\b/i, 'injection'],
  [/\b(drops|eye drops|ear drops|nasal spray|saline nasal|nasal saline|nasal corticosteroid|intranasal|decongestant|nasal decongestant|oxymetazoline|artificial tears|lubricant|mouthwash|mouth rinse|rinse|gargle)s?\b/i, 'drops'],
  [/\b(cream|ointment|gel|lotion|shampoo|toothpaste|retinoid|hydroquinone|azelaic|calcipotriol|imiquimod|fluorouracil|clotrimazole|mupirocin|zinc oxide|petroleum|emollient|moisturi[sz]ers?|emollients?|antiseptic cleansing|witch hazel|suppositor|topical|sitz|lidocaine|vitamin d analog|calcineurin|tacrolimus)\b/i, 'topical'],
  [/\b(antibiotic|penicillin|amoxicillin|cef|azithromycin|ciprofloxacin|doxycycline|metronidazole|clindamycin|cephalexin|nitrofurantoin|trimethoprim|fosfomycin|erythromycin|moxifloxacin|clarithromycin)/i, 'antibiotic'],
  [/\b(antifungal|fluconazole|terbinafine|griseofulvin|itraconazole|ketoconazole)\b/i, 'antifungal'],
  [/\b(antiviral|oseltamivir|tenofovir|ganciclovir)\b/i, 'antiviral'],
  [/\b(pain|analges|paracetamol|acetaminophen|ibuprofen|nsaid|naproxen|diclofenac|mefenamic|indomethacin|aspirin|opioid|morphine|tramadol|antipyretic|fever reducer|colchicine\b(?!.*gout)|local anesthetic|tranexamic|cough (syrup|suppressant)|dextromethorphan|expectorant|guaifenesin|cough syrups)/i, 'analgesic'],
  [/\b(antihistamine|loratadine|cetirizine|diphenhydramine|olopatadine|ketotifen|mast cell|leukotriene|montelukast)/i, 'antihistamine'],
  [/\b(inhaled|inhaler|beta-agonists?|beta agonists?|salbutamol|albuterol|bronchodilators?|anticholinergics?|ipratropium|roflumilast|phosphodiesterase|fluticasone)\b/i, 'inhaler'],
  [/\b(corticosteroid|steroid|prednis|dexamethasone|hydrocortisone)/i, 'steroid'],
  [/\b(proton pump|omeprazole|pantoprazole|h2 blocker|ranitidine|antacid|sucralfate|prokinetic|antispasmodic|dicyclomine|misoprostol)/i, 'stomach'],
  [/\b(antiemetic|ondansetron|promethazine|loperamide|rehydration|probiotic|ursodeoxycholic|lactulose \(for hepatic)/i, 'gut'],
  [/\b(laxative|lactulose|fiber|fibre|psyllium|stool softener|docusate|polyethylene|osmotic)/i, 'laxative'],
  [/\b(statin)/i, 'statin'],
  [/\b(ace inhibitor|lisinopril|beta-blocker|metoprolol|calcium channel|amlodipine|antihypertens|labetalol|nitroglycerin|diuretic|furosemide|spironolactone|aldosterone|digoxin|atropine|alpha blocker|aspirin)/i, 'heart'],
  [/\b(ssri|snri|benzodiazepine|buspirone|antidepress|antipsychotic|clozapine|lithium|mood stabili[sz]er|bupropion|tricyclic|risperidone|olanzapine|modafinil|clonazepam|alprazolam)/i, 'mind'],
  [/\b(muscle relaxants?|gabapentin|pregabalin|amitriptyline|alpha-lipoic|disease-modifying|fingolimod)/i, 'nerve'],
  [/\b(insulin|metformin|contraceptive|progest|clomiphene|levonorgestrel|glucose|folic|prenatal|iron|vitamin|supplement|thiamine|magnesium|calcium|glucosamine|aredS2|b6|b1)/i, 'vitamin'],
  [/\b(finasteride|tadalafil|phenazopyridine|cranberry|tamsulosin|5-alpha)/i, 'urology'],
  [/\b(allopurinol|febuxostat|colchicine|methotrexate|hydroxyurea|biologics)/i, 'joint'],
  [/\b(therapy|cbt|psychotherapy|counsel|support|group|education|speech|occupational|physio|physical|tens|acupuncture|phototherapy|photodynamic|cpap|oxygen|device|splint|brace|crutch|immobili|compress|ice|heat|rice|monitor|reassurance|rest|hydration|diet|lifestyle|weight loss|fasting|avoid|wound care|suction|humidified|bed rest|no fda|behavioral|motivational|abstain|partner|nebuli[sz]ation|frequent|dietary|clear liquid|high-fiber|cognitive|gradual|juice|dilation|discontinu|adjust|electrolyte|vision aids|ear wick|antiseptic|cleansing|ice\/heat|gargles?)/i, 'therapy'],
];

const INSULIN = /insulin/i;
const SPECIAL: [RegExp, Partial<MedicineProfile>][] = [
  [INSULIN, { id: 'insulin', label: 'Insulin', purpose: 'Controls blood sugar.', form: 'injection', slots: ['morning', 'evening'], food: 'before', duration: 'As prescribed', tip: 'Time it with meals exactly as your doctor taught you.', warning: 'Low blood sugar (shaky, sweaty, confused) needs sugar immediately.', color: '#d946ef' }],
  [/nitroglycerin/i, { label: 'Chest pain relief', slots: [], asNeeded: true, form: 'tablet', purpose: 'Opens the heart vessels quickly during chest pain.', tip: 'Dissolved under the tongue only for chest pain, as your doctor directed.', warning: 'Chest pain that does not settle in minutes is an emergency: call 1122.' }],
  [/(aspirin)/i, { label: 'Aspirin', slots: ['morning'], asNeeded: false, form: 'tablet', purpose: 'Thins the blood or relieves pain, depending on why it is prescribed.', food: 'after', tip: 'Take after food to protect the stomach.' }],
  [/cough (syrup|suppressant)|expectorant|dextromethorphan|guaifenesin/i, { form: 'syrup', label: 'Cough relief', purpose: 'Soothes cough and loosens or calms it.', slots: ['evening', 'night'], asNeeded: false, food: 'any', tip: 'Measure with the cap or spoon that comes with it.' }],
  [/(epinephrine)/i, { label: 'Emergency adrenaline', slots: [], asNeeded: true, form: 'injection', purpose: 'Emergency treatment for severe allergic reactions.', tip: 'Carry it with you. Use as trained, then call emergency services.' }],
];

function classify(line: string): MedicineProfile {
  for (const [re, patch] of SPECIAL) {
    if (re.test(line)) {
      const baseKey = RULES.find(([r]) => r.test(line))?.[1] ?? 'general';
      return { ...PROFILES[baseKey], ...patch } as MedicineProfile;
    }
  }
  for (const [re, key] of RULES) if (re.test(line)) return PROFILES[key];
  return PROFILES.general;
}

function parseNames(line: string): { name: string; examples: string[] } {
  const paren = line.match(/\(([^)]*)\)/);
  const name = line.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim() || line;
  let examples: string[] = [];
  if (paren) {
    const inner = paren[1].replace(/^e\.g\.,?\s*/i, '');
    if (/^e\.g\./i.test(paren[1])) {
      examples = inner.split(/,| or | \+ /).map(s => s.trim()).filter(Boolean);
    }
  }
  return { name, examples };
}

export function describeMedicine(line: string): MedicineItem {
  const profile = classify(line);
  const { name, examples } = parseNames(line);
  let searchTerm: string | null = null;
  if (profile.form !== 'care' && profile.form !== 'procedure' && profile.form !== 'injection') {
    searchTerm = examples[0] ?? (/\b(therapy|surgery|diet|rest|fasting|support)\b/i.test(name) ? null : name);
  }
  return { raw: line, name, examples, searchTerm, profile };
}

export function describeAll(lines: string[]): MedicineItem[] {
  return lines.map(describeMedicine);
}

export const SLOT_INFO: Record<DoseSlot, { label: string; time: string; icon: 'sunrise' | 'sun' | 'sunset' | 'moon' }> = {
  morning: { label: 'Morning', time: '8:00 AM', icon: 'sunrise' },
  afternoon: { label: 'Afternoon', time: '2:00 PM', icon: 'sun' },
  evening: { label: 'Evening', time: '6:00 PM', icon: 'sunset' },
  night: { label: 'Night', time: '9:30 PM', icon: 'moon' },
};

export const FOOD_TEXT: Record<FoodRule, string> = {
  before: '30 min before food',
  after: 'After food',
  with: 'With food',
  empty: 'On an empty stomach',
  any: 'With or without food',
};

export interface DaySchedule {
  slot: DoseSlot;
  items: MedicineItem[];
}

/** Groups scheduled medicines by time of day. */
export function buildSchedule(items: MedicineItem[]): { schedule: DaySchedule[]; asNeeded: MedicineItem[]; other: MedicineItem[] } {
  const slots: DoseSlot[] = ['morning', 'afternoon', 'evening', 'night'];
  const schedule = slots.map(slot => ({ slot, items: items.filter(i => i.profile.slots.includes(slot)) }));
  const asNeeded = items.filter(i => i.profile.asNeeded);
  const other = items.filter(i => i.profile.slots.length === 0 && !i.profile.asNeeded);
  return { schedule, asNeeded, other };
}
