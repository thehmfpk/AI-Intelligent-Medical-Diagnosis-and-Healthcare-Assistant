import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RefreshCw, LocateFixed, Wind, AlertTriangle, MapPin } from 'lucide-react';
import { CITIES, BANDS, bandFor, fetchReadings, Reading } from '../lib/aqi';

interface Row { name: string; ur: string; lat: number; lon: number; r: Reading | null }

const icon = (aqi: number | null, active: boolean) => {
  const b = aqi == null ? null : bandFor(aqi);
  return L.divIcon({
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    html: `<div style="width:${active ? 46 : 38}px;height:${active ? 46 : 38}px;border-radius:50%;background:${b ? b.color : '#64748b'};color:${b ? b.text : '#fff'};display:flex;align-items:center;justify-content:center;font:800 ${active ? 15 : 13}px Arial;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.45);margin:${active ? 0 : 4}px">${aqi ?? '–'}</div>`,
  });
};

const AqiMapPage: React.FC = () => {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const me = useRef<L.Marker | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [sel, setSel] = useState<string>('Lahore');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState<Date | null>(null);
  const [mine, setMine] = useState<{ lat: number; lon: number; r: Reading | null } | null>(null);
  const [geoErr, setGeoErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const rs = await fetchReadings(CITIES);
      setRows(CITIES.map((c, i) => ({ ...c, r: rs[i] ?? null })));
      setUpdated(new Date());
    } catch {
      setError('Could not load live air-quality data. Check your internet connection and try again.');
    } finally { setLoading(false); }
  }, []);

  // create the map once
  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { center: [30.4, 70.5], zoom: 5, minZoom: 4, scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(m);
    m.on('focus', () => m.scrollWheelZoom.enable());
    m.on('blur', () => m.scrollWheelZoom.disable());
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    load();
    return () => { m.remove(); map.current = null; };
  }, [load]);

  // refresh the data every 10 minutes
  useEffect(() => { const t = setInterval(load, 600000); return () => clearInterval(t); }, [load]);

  // draw markers
  useEffect(() => {
    if (!layer.current) return;
    layer.current.clearLayers();
    rows.forEach(r => {
      const mk = L.marker([r.lat, r.lon], { icon: icon(r.r?.aqi ?? null, r.name === sel), title: `${r.name}: ${r.r?.aqi ?? 'no data'}`, keyboard: true });
      mk.on('click', () => setSel(r.name));
      mk.addTo(layer.current!);
    });
  }, [rows, sel]);

  const current = rows.find(r => r.name === sel);
  const sorted = useMemo(() => [...rows].sort((a, b) => (b.r?.aqi ?? -1) - (a.r?.aqi ?? -1)), [rows]);
  const focus = (r: Row) => { setSel(r.name); map.current?.flyTo([r.lat, r.lon], 8, { duration: 0.8 }); };

  const locate = () => {
    setGeoErr('');
    if (!navigator.geolocation) { setGeoErr('Location is not available in this browser.'); return; }
    navigator.geolocation.getCurrentPosition(async p => {
      const lat = +p.coords.latitude.toFixed(3), lon = +p.coords.longitude.toFixed(3);
      let r: Reading | null = null;
      try { r = (await fetchReadings([{ lat, lon }]))[0]; } catch { /* shown as no data */ }
      setMine({ lat, lon, r });
      if (map.current) {
        me.current?.remove();
        me.current = L.marker([lat, lon], { icon: icon(r?.aqi ?? null, true), title: 'Your location' }).addTo(map.current);
        map.current.flyTo([lat, lon], 9, { duration: 0.8 });
      }
    }, () => setGeoErr('Could not get your location. Please allow location access.'), { timeout: 10000 });
  };

  const shown = mine?.r && sel === '__me' ? null : current;
  const band = shown?.r ? bandFor(shown.r.aqi) : null;
  const myBand = mine?.r ? bandFor(mine.r.aqi) : null;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#020204] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500 flex items-center justify-center"><Wind className="text-black" size={22} /></div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase">Live <span className="text-cyan-400">AQI</span> Map</h2>
            </div>
            <p className="text-zinc-400 max-w-2xl">Air quality across Pakistan right now, with health advice for each level. Tap a marker or a city.</p>
            <p className="font-urdu text-zinc-500 mt-1" dir="rtl">پاکستان میں ہوا کا معیار (لائیو)، ہر سطح کے لیے صحت کا مشورہ۔</p>
          </div>
          <div className="flex gap-2">
            <button onClick={locate} className="px-4 py-3 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 flex items-center gap-2 cursor-pointer"><LocateFixed size={14} />My location</button>
            <button onClick={load} disabled={loading} className="px-5 py-3 rounded-xl bg-cyan-500 text-black text-xs font-black uppercase tracking-widest hover:bg-white disabled:opacity-60 flex items-center gap-2 cursor-pointer"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} />Refresh</button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200 flex gap-2" role="alert"><AlertTriangle size={16} className="shrink-0 mt-0.5" />{error}</div>}
        {geoErr && <p className="mb-3 text-amber-300 text-xs" role="alert">{geoErr}</p>}

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10">
              <div ref={el} className="w-full h-[460px] md:h-[560px] bg-zinc-900" aria-label="Map of air quality in Pakistan" />
              {loading && rows.length === 0 && <div className="absolute inset-0 z-[500] flex items-center justify-center bg-black/40 text-sm text-white">Loading live air quality…</div>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="AQI colour legend">
              {BANDS.map((b, i) => (
                <span key={b.en} className="inline-flex items-center gap-2 text-[11px] text-zinc-300">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ background: b.color }} />{i === 0 ? '0' : BANDS[i - 1].max + 1}{b.max === Infinity ? '+' : `–${b.max}`} {b.en}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">US AQI scale. Data: Open-Meteo air-quality model (CAMS), a modelled estimate that can differ from a ground monitor.{updated ? ` Updated ${updated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}.` : ''}</p>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28">
            {shown && (
              <section className="rounded-3xl border border-white/10 bg-zinc-950/50 p-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-1"><MapPin size={11} />Selected</p>
                <h3 className="text-2xl font-black">{shown.name} <span className="font-urdu text-zinc-400 text-lg">{shown.ur}</span></h3>
                {shown.r && band ? (
                  <>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center" style={{ background: band.color, color: band.text }}>
                        <span className="text-3xl font-black leading-none">{shown.r.aqi}</span><span className="text-[9px] font-mono uppercase">US AQI</span>
                      </div>
                      <div><p className="font-black">{band.en}</p><p className="font-urdu text-zinc-400">{band.ur}</p></div>
                    </div>
                    <p className="text-sm text-zinc-300 mt-4 leading-snug">{band.advice.en}</p>
                    <p className="font-urdu text-sm text-zinc-400 mt-1 leading-relaxed" dir="rtl">{band.advice.ur}</p>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                      <div className="rounded-xl bg-white/[0.04] p-2"><p className="text-[10px] font-mono text-zinc-500">PM2.5</p><p className="font-bold">{shown.r.pm25 != null ? Math.round(shown.r.pm25) : '–'} <span className="text-[10px] text-zinc-500">µg/m³</span></p></div>
                      <div className="rounded-xl bg-white/[0.04] p-2"><p className="text-[10px] font-mono text-zinc-500">PM10</p><p className="font-bold">{shown.r.pm10 != null ? Math.round(shown.r.pm10) : '–'} <span className="text-[10px] text-zinc-500">µg/m³</span></p></div>
                    </div>
                  </>
                ) : <p className="text-sm text-zinc-500 mt-3">{loading ? 'Loading…' : 'No data for this place right now.'}</p>}
              </section>
            )}

            {mine && (
              <section className="rounded-3xl border border-cyan-500/30 bg-cyan-500/[0.05] p-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 mb-1">Your location</p>
                {mine.r && myBand ? (<><p className="font-black text-xl">AQI {mine.r.aqi} · {myBand.en}</p><p className="text-sm text-zinc-300 mt-1">{myBand.advice.en}</p></>) : <p className="text-sm text-zinc-400">No data for your location right now.</p>}
              </section>
            )}

            <section className="rounded-3xl border border-white/10 bg-zinc-950/40 p-5">
              <h3 className="font-black uppercase tracking-tight text-sm mb-3">Cities, worst first</h3>
              <ul className="max-h-80 overflow-y-auto -mr-2 pr-2 space-y-1.5">
                {sorted.map(r => {
                  const b = r.r ? bandFor(r.r.aqi) : null;
                  return (
                    <li key={r.name}>
                      <button onClick={() => focus(r)} aria-pressed={r.name === sel} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left cursor-pointer transition-colors ${r.name === sel ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/5 hover:bg-white/5'}`}>
                        <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{ background: b?.color ?? '#64748b', color: b?.text ?? '#fff' }}>{r.r?.aqi ?? '–'}</span>
                        <span className="min-w-0"><span className="block text-sm font-semibold truncate">{r.name}</span><span className="block text-[11px] text-zinc-500 truncate">{b?.en ?? 'No data'}</span></span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>
        </div>

        <p className="text-[11px] text-zinc-600 text-center mt-8 max-w-3xl mx-auto">Air-quality advice is general information, not medical advice. If breathing becomes difficult, seek medical help.</p>
      </div>
    </div>
  );
};

export default AqiMapPage;
