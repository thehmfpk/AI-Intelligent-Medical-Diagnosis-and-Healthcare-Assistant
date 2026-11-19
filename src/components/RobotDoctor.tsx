import React from 'react';

/** Original modern robot-doctor illustration (SVG): reading a medical report on a tablet. Upper body, cropped by the bottom edge. */
const RobotDoctor: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 480 560" className={className} role="img" aria-label="Robot doctor reading a medical report">
    <defs>
      <linearGradient id="rd-shell" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stopColor="#ffffff" /><stop offset="0.6" stopColor="#eaf0f8" /><stop offset="1" stopColor="#aebbd0" />
      </linearGradient>
      <linearGradient id="rd-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f8fbff" /><stop offset="1" stopColor="#c4d0e2" />
      </linearGradient>
      <linearGradient id="rd-dark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2b3a55" /><stop offset="1" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="rd-eye" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8af4ff" /><stop offset="1" stopColor="#14b8e8" />
      </linearGradient>
      <radialGradient id="rd-visor" cx="0.5" cy="0.2" r="0.95">
        <stop offset="0" stopColor="#173456" /><stop offset="0.7" stopColor="#0a1426" /><stop offset="1" stopColor="#040812" />
      </radialGradient>
      <radialGradient id="rd-screenglow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#22d3ee" stopOpacity="0.45" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
      </radialGradient>
      <filter id="rd-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>

    {/* torso */}
    <path d="M30 560 C30 430 76 350 168 328 L312 328 C404 350 450 430 450 560 Z" fill="url(#rd-body)" />
    <path d="M168 328 C196 352 284 352 312 328 L312 344 C284 368 196 368 168 344 Z" fill="url(#rd-dark)" />
    {/* neck */}
    <rect x="212" y="268" width="56" height="66" rx="13" fill="url(#rd-dark)" />
    <path d="M212 288 H268 M212 304 H268" stroke="#22d3ee" strokeOpacity="0.6" strokeWidth="2.5" />
    {/* stethoscope draped on collar */}
    <path d="M190 336 C184 392 214 412 240 412 C268 412 296 392 290 336" fill="none" stroke="#9fb0c8" strokeWidth="6" strokeLinecap="round" />
    {/* shoulder pads */}
    <circle cx="88" cy="384" r="46" fill="url(#rd-dark)" /><circle cx="88" cy="384" r="46" fill="none" stroke="#22d3ee" strokeOpacity="0.55" strokeWidth="3" />
    <circle cx="392" cy="384" r="46" fill="url(#rd-dark)" /><circle cx="392" cy="384" r="46" fill="none" stroke="#22d3ee" strokeOpacity="0.55" strokeWidth="3" />
    <path d="M392 370 v28 M378 384 h28" stroke="#22d3ee" strokeWidth="7" strokeLinecap="round" filter="url(#rd-glow)" />
    <path d="M70 376 h36 M70 392 h26" stroke="#22d3ee" strokeOpacity="0.5" strokeWidth="3.5" strokeLinecap="round" />

    {/* arms */}
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M88 392 L94 516 L162 462" stroke="#aebbd0" strokeWidth="46" />
      <path d="M88 392 L94 516 L162 462" stroke="#f1f5fb" strokeWidth="38" />
      <path d="M392 392 L386 516 L318 462" stroke="#aebbd0" strokeWidth="46" />
      <path d="M392 392 L386 516 L318 462" stroke="#f1f5fb" strokeWidth="38" />
    </g>
    <circle cx="94" cy="516" r="24" fill="url(#rd-dark)" /><circle cx="386" cy="516" r="24" fill="url(#rd-dark)" />

    {/* screen glow onto chest */}
    <ellipse cx="240" cy="400" rx="150" ry="90" fill="url(#rd-screenglow)" />

    {/* medical report tablet */}
    <g transform="rotate(-3 240 470)">
      <rect x="164" y="378" width="152" height="210" rx="16" fill="#0a1220" stroke="#22d3ee" strokeOpacity="0.85" strokeWidth="3" />
      <rect x="173" y="387" width="134" height="200" rx="9" fill="#101c33" />
      <rect x="183" y="397" width="58" height="8" rx="4" fill="#22d3ee" />
      <rect x="183" y="410" width="36" height="5" rx="2.5" fill="#475a78" />
      <circle cx="289" cy="402" r="9" fill="#ef4444" /><path d="M289 397 v10 M284 402 h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="181" y="424" width="118" height="42" rx="7" fill="#0a1426" />
      <path className="hero-ecg" d="M185 446 H208 L214 431 L222 460 L228 446 H252 L258 439 L264 446 H295" fill="none" stroke="#22d3ee" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <g>
        <rect x="186" y="486" width="16" height="30" rx="3" fill="#22d3ee" />
        <rect x="208" y="476" width="16" height="40" rx="3" fill="#34d399" />
        <rect x="230" y="492" width="16" height="24" rx="3" fill="#fbbf24" />
        <rect x="252" y="470" width="16" height="46" rx="3" fill="#22d3ee" />
        <rect x="274" y="482" width="16" height="34" rx="3" fill="#34d399" />
      </g>
      <rect x="183" y="528" width="100" height="5" rx="2.5" fill="#475a78" />
      <rect x="183" y="541" width="76" height="5" rx="2.5" fill="#34506f" />
      <rect x="183" y="554" width="92" height="5" rx="2.5" fill="#34506f" />
    </g>

    {/* hands */}
    <rect x="138" y="438" width="50" height="50" rx="20" fill="url(#rd-dark)" />
    <rect x="292" y="438" width="50" height="50" rx="20" fill="url(#rd-dark)" />
    <rect x="172" y="444" width="26" height="13" rx="6.5" fill="#2b3a55" stroke="#22d3ee" strokeOpacity="0.5" />
    <rect x="282" y="444" width="26" height="13" rx="6.5" fill="#2b3a55" stroke="#22d3ee" strokeOpacity="0.5" />

    {/* head, tilted down to read */}
    <g transform="rotate(5 240 300)">
      <g className="rb-tilt" style={{ transformOrigin: '240px 300px' }}>
        <path d="M240 86 V62" stroke="#8a97b0" strokeWidth="5" strokeLinecap="round" />
        <circle cx="240" cy="55" r="7.5" fill="#22d3ee" filter="url(#rd-glow)" className="rb-pulse" />
        <rect x="130" y="150" width="24" height="62" rx="12" fill="url(#rd-dark)" /><rect x="136" y="162" width="12" height="38" rx="6" fill="#22d3ee" opacity="0.9" />
        <rect x="326" y="150" width="24" height="62" rx="12" fill="url(#rd-dark)" /><rect x="332" y="162" width="12" height="38" rx="6" fill="#22d3ee" opacity="0.9" />
        <rect x="148" y="84" width="184" height="182" rx="66" fill="url(#rd-shell)" />
        <path d="M172 108 C202 94 278 94 308 108" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
        <circle cx="240" cy="106" r="11" fill="#0e7490" /><path d="M240 99 v14 M233 106 h14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="166" y="128" width="148" height="100" rx="42" fill="url(#rd-visor)" stroke="#5ee7ff" strokeOpacity="0.5" strokeWidth="2.5" />
        <path d="M184 142 C210 134 270 134 296 142" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="5" strokeLinecap="round" />
        {/* focused eyes, reading left-right */}
        <g className="rb-read" filter="url(#rd-glow)">
          <path d="M190 170 H224 V180 A17 14 0 0 1 207 194 A17 14 0 0 1 190 180 Z" fill="url(#rd-eye)" />
          <path d="M256 170 H290 V180 A17 14 0 0 1 273 194 A17 14 0 0 1 256 180 Z" fill="url(#rd-eye)" />
        </g>
        <path d="M226 210 Q240 216 254 210" fill="none" stroke="#7df3ff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        <path d="M222 250 H258" stroke="#9fb0c8" strokeWidth="3" strokeLinecap="round" />
      </g>
    </g>
  </svg>
);

export default RobotDoctor;
