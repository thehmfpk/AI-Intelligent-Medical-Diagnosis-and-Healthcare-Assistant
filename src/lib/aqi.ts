/** Live air-quality data (Open-Meteo, US AQI scale) and EPA-style health bands. */

export interface City { name: string; ur: string; lat: number; lon: number; }

export const CITIES: City[] = [
  { name: 'Lahore', ur: 'لاہور', lat: 31.5497, lon: 74.3436 },
  { name: 'Karachi', ur: 'کراچی', lat: 24.8607, lon: 67.0011 },
  { name: 'Islamabad', ur: 'اسلام آباد', lat: 33.6844, lon: 73.0479 },
  { name: 'Rawalpindi', ur: 'راولپنڈی', lat: 33.5651, lon: 73.0169 },
  { name: 'Faisalabad', ur: 'فیصل آباد', lat: 31.4504, lon: 73.135 },
  { name: 'Multan', ur: 'ملتان', lat: 30.1575, lon: 71.5249 },
  { name: 'Peshawar', ur: 'پشاور', lat: 34.0151, lon: 71.5249 },
  { name: 'Quetta', ur: 'کوئٹہ', lat: 30.1798, lon: 66.975 },
  { name: 'Hyderabad', ur: 'حیدرآباد', lat: 25.396, lon: 68.3578 },
  { name: 'Gujranwala', ur: 'گوجرانوالہ', lat: 32.1877, lon: 74.1945 },
  { name: 'Sialkot', ur: 'سیالکوٹ', lat: 32.4945, lon: 74.5229 },
  { name: 'Bahawalpur', ur: 'بہاولپور', lat: 29.3544, lon: 71.6911 },
  { name: 'Sargodha', ur: 'سرگودھا', lat: 32.0836, lon: 72.6711 },
  { name: 'Sukkur', ur: 'سکھر', lat: 27.7052, lon: 68.8574 },
  { name: 'Larkana', ur: 'لاڑکانہ', lat: 27.559, lon: 68.2123 },
  { name: 'Sahiwal', ur: 'ساہیوال', lat: 30.6682, lon: 73.1114 },
  { name: 'Kasur', ur: 'قصور', lat: 31.1187, lon: 74.4467 },
  { name: 'Okara', ur: 'اوکاڑہ', lat: 30.8138, lon: 73.4534 },
  { name: 'Rahim Yar Khan', ur: 'رحیم یار خان', lat: 28.4202, lon: 70.2952 },
  { name: 'Dera Ismail Khan', ur: 'ڈیرہ اسماعیل خان', lat: 31.8626, lon: 70.9019 },
  { name: 'Mardan', ur: 'مردان', lat: 34.1989, lon: 72.0231 },
  { name: 'Abbottabad', ur: 'ایبٹ آباد', lat: 34.1688, lon: 73.2215 },
  { name: 'Jhelum', ur: 'جہلم', lat: 32.9425, lon: 73.7257 },
  { name: 'Muzaffarabad', ur: 'مظفرآباد', lat: 34.37, lon: 73.4711 },
  { name: 'Gilgit', ur: 'گلگت', lat: 35.9208, lon: 74.3144 },
  { name: 'Skardu', ur: 'سکردو', lat: 35.2971, lon: 75.6333 },
  { name: 'Gwadar', ur: 'گوادر', lat: 25.1264, lon: 62.3225 },
];

export interface Band { max: number; en: string; ur: string; color: string; text: string; advice: { en: string; ur: string }; }

export const BANDS: Band[] = [
  { max: 50, en: 'Good', ur: 'اچھی', color: '#22c55e', text: '#052e16', advice: { en: 'Air is clean. Enjoy outdoor activities.', ur: 'ہوا صاف ہے۔ باہر کی سرگرمیاں کر سکتے ہیں۔' } },
  { max: 100, en: 'Moderate', ur: 'درمیانی', color: '#eab308', text: '#422006', advice: { en: 'Acceptable. Very sensitive people (asthma, heart or lung disease) should limit long hard outdoor effort.', ur: 'قابلِ قبول۔ دمہ، دل یا پھیپھڑوں کے مریض لمبی سخت ورزش سے پرہیز کریں۔' } },
  { max: 150, en: 'Unhealthy for sensitive groups', ur: 'حساس افراد کے لیے مضر', color: '#f97316', text: '#431407', advice: { en: 'Children, older adults and people with asthma or heart disease should reduce outdoor exertion and consider a mask.', ur: 'بچے، بزرگ اور دمہ یا دل کے مریض باہر کم نکلیں اور ماسک پہنیں۔' } },
  { max: 200, en: 'Unhealthy', ur: 'مضرِ صحت', color: '#ef4444', text: '#ffffff', advice: { en: 'Everyone should limit outdoor exertion. Wear an N95 mask outside and keep windows closed.', ur: 'سب لوگ باہر کی مشقت کم کریں۔ باہر N95 ماسک پہنیں اور کھڑکیاں بند رکھیں۔' } },
  { max: 300, en: 'Very unhealthy', ur: 'انتہائی مضر', color: '#a855f7', text: '#ffffff', advice: { en: 'Avoid outdoor activity. Stay indoors with clean air if possible. Sensitive people should be extra careful.', ur: 'باہر کی سرگرمی سے بچیں۔ ممکن ہو تو صاف ہوا والے کمرے میں رہیں۔' } },
  { max: Infinity, en: 'Hazardous', ur: 'خطرناک', color: '#7f1d1d', text: '#ffffff', advice: { en: 'Health emergency conditions. Stay indoors, use air purifiers and an N95 mask if you must go out.', ur: 'ہنگامی صورتحال۔ گھر میں رہیں، ایئر پیوریفائر استعمال کریں اور مجبوری میں N95 ماسک پہنیں۔' } },
];

export const bandFor = (aqi: number): Band => BANDS.find(b => aqi <= b.max)!;

export interface Reading { aqi: number; pm25: number | null; pm10: number | null; time: string; }

const URL_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality';

interface Cur { time: string; us_aqi: number | null; pm2_5: number | null; pm10: number | null }

/** Fetches current air quality for many places in one request. Entries with no data are skipped. */
export async function fetchReadings(points: { lat: number; lon: number }[], signal?: AbortSignal): Promise<(Reading | null)[]> {
  const url = `${URL_BASE}?latitude=${points.map(p => p.lat).join(',')}&longitude=${points.map(p => p.lon).join(',')}&current=us_aqi,pm2_5,pm10&timezone=auto`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Air quality service returned ${res.status}`);
  const json = await res.json();
  const arr: { current?: Cur }[] = Array.isArray(json) ? json : [json];
  return arr.map(o => {
    const c = o.current;
    if (!c || c.us_aqi == null) return null;
    return { aqi: Math.round(c.us_aqi), pm25: c.pm2_5, pm10: c.pm10, time: c.time };
  });
}

export interface Place { name: string; sub: string; lat: number; lon: number; }

/** Looks up places worldwide by name (Open-Meteo geocoding, no key). */
export async function searchPlaces(q: string, signal?: AbortSignal): Promise<Place[]> {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`, { signal });
  if (!res.ok) throw new Error(`Place search returned ${res.status}`);
  const json = await res.json();
  const list: { name: string; latitude: number; longitude: number; country?: string; admin1?: string }[] = json.results ?? [];
  return list.map(r => ({ name: r.name, sub: [r.admin1, r.country].filter(Boolean).join(', '), lat: +r.latitude.toFixed(3), lon: +r.longitude.toFixed(3) }));
}

export interface HourPoint { time: string; aqi: number; }

/** Hourly US AQI for the next 24 hours at a place (local time of that place). */
export async function fetchForecast(lat: number, lon: number, signal?: AbortSignal): Promise<HourPoint[]> {
  const url = `${URL_BASE}?latitude=${lat}&longitude=${lon}&current=us_aqi&hourly=us_aqi&forecast_days=2&timezone=auto`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Forecast service returned ${res.status}`);
  const j = await res.json();
  const times: string[] = j.hourly?.time ?? [];
  const vals: (number | null)[] = j.hourly?.us_aqi ?? [];
  const nowHour: string = (j.current?.time ?? times[0] ?? '').slice(0, 13);
  const start = Math.max(0, times.findIndex(t => t.slice(0, 13) >= nowHour));
  const out: HourPoint[] = [];
  for (let i = start; i < Math.min(times.length, start + 24); i++) if (vals[i] != null) out.push({ time: times[i], aqi: Math.round(vals[i] as number) });
  return out;
}
