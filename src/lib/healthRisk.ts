/** Personal air-pollution risk and precautions. General guidance only: not medical advice, no diagnosis, no drug doses. */
import { HourPoint } from './aqi';

export type AgeGroup = 'child' | 'adult' | 'senior';
export type Activity = 'indoors' | 'commute' | 'outdoor';
export type Condition = 'lung' | 'heart' | 'pregnancy' | 'diabetes' | 'allergy' | 'recent';

export interface Profile {
  age: AgeGroup | null;
  conditions: Condition[];
  smoker: boolean;
  activity: Activity;
  hasMask: boolean;
  hasPurifier: boolean;
}

export const DEFAULT_PROFILE: Profile = { age: null, conditions: [], smoker: false, activity: 'commute', hasMask: false, hasPurifier: false };

export const CONDITIONS: { key: Condition; en: string; ur: string }[] = [
  { key: 'lung', en: 'Asthma / COPD / lung disease', ur: 'دمہ / پھیپھڑوں کی بیماری' },
  { key: 'heart', en: 'Heart disease / high blood pressure', ur: 'دل کی بیماری / ہائی بلڈ پریشر' },
  { key: 'pregnancy', en: 'Pregnant', ur: 'حمل' },
  { key: 'diabetes', en: 'Diabetes', ur: 'شوگر' },
  { key: 'allergy', en: 'Allergies / sinus trouble', ur: 'الرجی / سائنس' },
  { key: 'recent', en: 'Recent cough or chest infection', ur: 'حالیہ کھانسی یا سینے کا انفیکشن' },
];

export interface Level { en: string; ur: string; color: string; text: string; summary: { en: string; ur: string } }
export const LEVELS: Level[] = [
  { en: 'Low risk', ur: 'کم خطرہ', color: '#22c55e', text: '#052e16', summary: { en: 'Air is fine for you today. Normal routine is OK.', ur: 'آج آپ کے لیے ہوا ٹھیک ہے۔ معمول کے کام کر سکتے ہیں۔' } },
  { en: 'Moderate risk', ur: 'درمیانہ خطرہ', color: '#eab308', text: '#422006', summary: { en: 'Mostly fine, but take a few simple precautions.', ur: 'زیادہ تر ٹھیک ہے، مگر چند آسان احتیاطیں کریں۔' } },
  { en: 'High risk', ur: 'زیادہ خطرہ', color: '#f97316', text: '#431407', summary: { en: 'Pollution can affect you today. Limit time outside and protect yourself.', ur: 'آج آلودگی آپ پر اثر ڈال سکتی ہے۔ باہر کم رہیں اور خود کو بچائیں۔' } },
  { en: 'Very high risk', ur: 'بہت زیادہ خطرہ', color: '#ef4444', text: '#ffffff', summary: { en: 'Avoid outdoor exposure where you can. Use a proper mask if you must go out.', ur: 'جہاں ممکن ہو باہر جانے سے بچیں۔ مجبوری میں درست ماسک پہنیں۔' } },
  { en: 'Severe risk', ur: 'شدید خطرہ', color: '#a855f7', text: '#ffffff', summary: { en: 'Stay indoors with the cleanest air you can. Go out only if necessary.', ur: 'صاف ترین ہوا والی جگہ گھر کے اندر رہیں۔ صرف ضرورت پر باہر جائیں۔' } },
];

export interface Tip { en: string; ur: string; tag?: string }
export interface Result {
  score: number; level: number; reasons: { en: string; ur: string }[]; tips: Tip[]; seek: Tip[];
  best: { from: string; to: string; avg: number } | null;
}

const SENSITIVE: Condition[] = ['lung', 'heart', 'pregnancy', 'recent'];

export function assess(p: Profile, aqi: number, forecast: HourPoint[]): Result {
  const reasons: { en: string; ur: string }[] = [];
  const sens = (p.age === 'child' || p.age === 'senior' ? 1 : 0) + p.conditions.filter(c => SENSITIVE.includes(c)).length;
  let mult = 1;
  if (sens > 0) { mult += Math.min(0.45 + (sens - 1) * 0.1, 0.8); reasons.push({ en: 'You are in a sensitive group, so the same air affects you more.', ur: 'آپ حساس گروپ میں ہیں، اس لیے یہی ہوا آپ پر زیادہ اثر کرتی ہے۔' }); }
  if (p.conditions.includes('diabetes') || p.conditions.includes('allergy')) mult += 0.1;
  if (p.smoker) { mult += 0.1; reasons.push({ en: 'Smoking already stresses your lungs and heart.', ur: 'سگریٹ نوشی پہلے ہی پھیپھڑوں اور دل پر بوجھ ڈالتی ہے۔' }); }
  if (p.activity === 'outdoor') { mult *= 1.3; reasons.push({ en: 'Long outdoor work or exercise makes you breathe in much more polluted air.', ur: 'لمبی بیرونی محنت یا ورزش سے آپ بہت زیادہ آلودہ ہوا سانس میں لیتے ہیں۔' }); }
  if (p.activity === 'indoors') { mult *= 0.8; reasons.push({ en: 'Staying mostly indoors lowers your exposure.', ur: 'زیادہ تر گھر کے اندر رہنے سے آپ کا خطرہ کم ہوتا ہے۔' }); }
  const score = Math.round(aqi * mult);
  const level = score < 55 ? 0 : score < 105 ? 1 : score < 155 ? 2 : score < 230 ? 3 : 4;

  const tips: Tip[] = [];
  const add = (en: string, ur: string, tag?: string) => tips.push({ en, ur, tag });
  const outdoorsNow = p.activity !== 'indoors';

  if (level === 0) add('Enjoy the fresh air. Opening windows to ventilate is fine today.', 'تازہ ہوا سے لطف اٹھائیں۔ آج کھڑکیاں کھول کر ہوا لگانا ٹھیک ہے۔');
  if (level >= 1 && aqi > 100) add('Keep windows closed while pollution is high; ventilate at the cleaner time of day.', 'آلودگی زیادہ ہو تو کھڑکیاں بند رکھیں؛ دن کے صاف وقت میں ہوا لگائیں۔');
  if (level >= 2 && outdoorsNow) {
    add('Wear a well-fitted N95 / KN95 mask outdoors. Cloth and surgical masks do not filter fine PM2.5 well.', 'باہر درست فٹ N95 / KN95 ماسک پہنیں۔ کپڑے اور سرجیکل ماسک باریک PM2.5 کو اچھی طرح نہیں روکتے۔', 'Mask');
    if (!p.hasMask) add('You said you have no N95 mask. Get one before going out; it helps more than anything else you can wear.', 'آپ کے پاس N95 ماسک نہیں۔ باہر جانے سے پہلے لے لیں؛ یہ سب سے زیادہ مددگار ہے۔', 'Mask');
  }
  if (level >= 2) add('Move hard exercise indoors. Walk or work outside only when you must, and take breaks.', 'سخت ورزش گھر کے اندر کریں۔ باہر صرف ضرورت پر چلیں یا کام کریں، اور وقفے لیں۔', 'Activity');
  if (aqi >= 150) {
    if (p.hasPurifier) add('Run your air purifier (HEPA) in the room where you spend most time, especially the bedroom.', 'اپنا HEPA ایئر پیوریفائر اس کمرے میں چلائیں جہاں زیادہ وقت گزارتے ہیں، خاص طور پر بیڈروم۔', 'Home');
    else add('No purifier? Keep one room as clean as you can: windows shut, damp-mop dust, no candles, incense or indoor smoking.', 'پیوریفائر نہیں؟ ایک کمرہ جتنا ممکن ہو صاف رکھیں: کھڑکیاں بند، گیلا پوچا، موم بتی/اگربتی یا اندر سگریٹ نہیں۔', 'Home');
    add('In the car, close windows and use recirculate mode.', 'گاڑی میں کھڑکیاں بند رکھیں اور ری سرکولیٹ موڈ استعمال کریں۔', 'Travel');
  }
  if (p.age === 'child') add('Keep children’s sports and play indoors when the air is poor; outdoor school activities can wait.', 'ہوا خراب ہو تو بچوں کا کھیل اور اسپورٹس گھر کے اندر رکھیں؛ سکول کی بیرونی سرگرمیاں ملتوی کریں۔', 'Child');
  if (p.age === 'senior') add('Limit long trips and busy roads; ask someone to do errands on very polluted days.', 'لمبے سفر اور رش والی سڑکوں سے بچیں؛ زیادہ آلودہ دنوں میں کسی سے کام کروا لیں۔', 'Older adult');
  if (p.conditions.includes('lung')) {
    add('Keep your prescribed quick-relief inhaler with you and follow your doctor’s asthma/COPD action plan.', 'اپنا ڈاکٹر کا بتایا ہوا فوری آرام والا انہیلر ساتھ رکھیں اور دمہ/COPD ایکشن پلان پر عمل کریں۔', 'Lungs');
    if (aqi > 100) add('Avoid known triggers (dust, smoke, strong smells) and skip outdoor exertion today.', 'جانے پہچانے ٹرگرز (دھول، دھواں، تیز بو) سے بچیں اور آج باہر مشقت نہ کریں۔', 'Lungs');
  }
  if (p.conditions.includes('heart')) {
    add('Avoid heavy exertion outside and take your regular medicines as prescribed. Rest if you feel chest discomfort or a racing heart.', 'باہر بھاری مشقت سے بچیں اور اپنی روزمرہ دوائیں ڈاکٹر کے مطابق لیں۔ سینے میں بے چینی یا تیز دھڑکن ہو تو آرام کریں۔', 'Heart');
  }
  if (p.conditions.includes('pregnancy')) add('Limit time outdoors when AQI is above 100 and use an N95 mask if you must go out. Mention heavy smog days at your next check-up.', 'AQI 100 سے اوپر ہو تو باہر کم رہیں اور مجبوری میں N95 پہنیں۔ اگلے چیک اپ میں شدید سموگ کے دنوں کا ذکر کریں۔', 'Pregnancy');
  if (p.conditions.includes('diabetes')) add('Keep up your usual routine, meals and medicines, and stay hydrated; pollution adds strain on the heart and blood vessels.', 'اپنا معمول، کھانا اور دوائیں جاری رکھیں اور پانی پئیں؛ آلودگی دل اور شریانوں پر بوجھ بڑھاتی ہے۔', 'Diabetes');
  if (p.conditions.includes('allergy')) add('After coming home, wash your face, rinse your nose with saline and change clothes to remove pollen and dust.', 'گھر آ کر منہ دھوئیں، نمکین پانی سے ناک صاف کریں اور کپڑے بدلیں تاکہ دھول اور پولن اتر جائیں۔', 'Allergy');
  if (p.conditions.includes('recent')) add('With a recent cough or chest infection your airways are more sensitive; avoid outdoor exposure until you feel better.', 'حالیہ کھانسی یا انفیکشن میں سانس کی نالیاں زیادہ حساس ہوتی ہیں؛ ٹھیک ہونے تک باہر کی آلودگی سے بچیں۔', 'Chest');
  if (p.smoker && aqi > 50) add('Avoid smoking, especially indoors. Smoke on top of polluted air multiplies the damage.', 'سگریٹ سے بچیں، خاص طور پر گھر کے اندر۔ آلودہ ہوا کے ساتھ دھواں نقصان بڑھا دیتا ہے۔', 'Smoking');
  if (level >= 1) {
    add('Drink water regularly and avoid walking beside heavy traffic; choose parks or inner streets.', 'باقاعدگی سے پانی پئیں اور بھاری ٹریفک کے ساتھ پیدل چلنے سے بچیں؛ پارک یا اندرونی گلیاں چنیں۔');
    add('Do not burn rubbish, leaves or plastic; it makes local air worse for everyone.', 'کچرا، پتے یا پلاسٹک نہ جلائیں؛ اس سے مقامی ہوا سب کے لیے بدتر ہوتی ہے۔');
  }

  const seek: Tip[] = [
    { en: 'Stop the activity, go indoors and rest if you get a cough, wheeze, tight chest, sore eyes/throat or dizziness.', ur: 'کھانسی، سانس میں سیٹی، سینے میں جکڑن، آنکھوں/گلے میں جلن یا چکر آئیں تو سرگرمی روک کر گھر کے اندر آرام کریں۔' },
    { en: 'Get medical help urgently for chest pain, severe breathlessness, fainting, or if your inhaler is not helping.', ur: 'سینے میں درد، شدید سانس پھولنا، بے ہوشی، یا انہیلر سے آرام نہ آئے تو فوراً ڈاکٹر سے رجوع کریں۔' },
  ];

  let best: Result['best'] = null;
  if (forecast.length >= 3) {
    let bi = 0, bv = Infinity;
    for (let i = 0; i + 3 <= forecast.length; i++) {
      const avg = (forecast[i].aqi + forecast[i + 1].aqi + forecast[i + 2].aqi) / 3;
      if (avg < bv) { bv = avg; bi = i; }
    }
    best = { from: forecast[bi].time, to: forecast[bi + 2].time, avg: Math.round(bv) };
  }
  return { score, level, reasons, tips, seek, best };
}

export const hourLabel = (iso: string) => {
  const h = parseInt(iso.slice(11, 13), 10);
  return `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'AM' : 'PM'}`;
};
