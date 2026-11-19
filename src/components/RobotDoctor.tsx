import React from 'react';

/** Original robot-doctor illustration (SVG). Upper body, meant to be cropped by the bottom edge. */
const RobotDoctor: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 420 540" className={className} role="img" aria-label="Robot doctor">
    <defs>
      <linearGradient id="rd-shell" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stopColor="#ffffff" /><stop offset="0.6" stopColor="#eef2f9" /><stop offset="1" stopColor="#b6c3d8" />
      </linearGradient>
      <linearGradient id="rd-coat" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d3dcea" />
      </linearGradient>
      <linearGradient id="rd-scrub" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#34e0c4" /><stop offset="1" stopColor="#0d9488" />
      </linearGradient>
      <linearGradient id="rd-ear" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#cbd5e1" /><stop offset="1" stopColor="#7c8aa5" />
      </linearGradient>
      <linearGradient id="rd-eye" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7df3ff" /><stop offset="1" stopColor="#1ea7ff" />
      </linearGradient>
      <radialGradient id="rd-visor" cx="0.5" cy="0.25" r="0.9">
        <stop offset="0" stopColor="#1a3a66" /><stop offset="0.7" stopColor="#0a1530" /><stop offset="1" stopColor="#050a18" />
      </radialGradient>
      <filter id="rd-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>

    {/* coat / shoulders */}
    <path d="M0 540 C0 412 52 340 150 316 L210 394 L270 316 C368 340 420 412 420 540 Z" fill="url(#rd-coat)" />
    <path d="M92 366 C78 430 70 490 66 540 M328 366 C342 430 350 490 354 540" fill="none" stroke="#c3cfe0" strokeWidth="2.5" />
    {/* scrubs */}
    <path d="M150 316 L210 394 L270 316 L252 304 L210 348 L168 304 Z" fill="url(#rd-scrub)" />
    <path d="M168 304 L210 348 L252 304 L210 270 Z" fill="#0b6b63" opacity="0.7" />
    {/* lapels */}
    <path d="M150 316 L210 394 L198 412 L128 332 Z" fill="#dbe3ef" /><path d="M270 316 L210 394 L222 412 L292 332 Z" fill="#dbe3ef" />
    <path d="M210 394 V540" stroke="#c3cfe0" strokeWidth="2" />

    {/* neck */}
    <rect x="184" y="242" width="52" height="60" rx="12" fill="#1e293b" />
    <path d="M184 262 H236 M184 278 H236" stroke="#22d3ee" strokeOpacity="0.55" strokeWidth="2.5" />

    {/* stethoscope */}
    <path d="M170 308 C148 382 156 452 206 468 C254 480 284 444 270 412" fill="none" stroke="#1b2538" strokeWidth="6.5" strokeLinecap="round" />
    <path d="M250 308 C258 340 268 374 270 396" fill="none" stroke="#1b2538" strokeWidth="6.5" strokeLinecap="round" />
    <circle cx="270" cy="410" r="17" fill="url(#rd-ear)" stroke="#1b2538" strokeWidth="5" />
    <circle cx="270" cy="410" r="5.5" fill="#22d3ee" filter="url(#rd-glow)" className="rb-pulse" />

    {/* ID badge */}
    <rect x="62" y="408" width="96" height="62" rx="9" fill="#fff" stroke="#c3cfe0" strokeWidth="2" />
    <path d="M62 417 a9 9 0 0 1 9 -9 h78 a9 9 0 0 1 9 9 v7 h-96 Z" fill="#0d9488" />
    <path d="M80 411 v10 M75 416 h10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    <text x="110" y="448" textAnchor="middle" fontSize="15" fontWeight="800" fill="#0f172a" fontFamily="Inter, system-ui, sans-serif">DR.HMF</text>
    <text x="110" y="461" textAnchor="middle" fontSize="7.5" fontWeight="700" letterSpacing="1.5" fill="#64748b" fontFamily="Inter, system-ui, sans-serif">AI DOCTOR</text>
    {/* pocket + pens */}
    <rect x="296" y="424" width="54" height="40" rx="6" fill="#f3f6fb" stroke="#c3cfe0" strokeWidth="2" />
    <rect x="308" y="410" width="5" height="26" rx="2.5" fill="#3b82f6" /><rect x="320" y="414" width="5" height="22" rx="2.5" fill="#ef4444" />

    {/* head */}
    <g className="rb-tilt" style={{ transformOrigin: '210px 300px' }}>
      <path d="M210 72 V46" stroke="#8a97b0" strokeWidth="5" strokeLinecap="round" />
      <circle cx="210" cy="38" r="9" fill="#ff6ab0" filter="url(#rd-glow)" className="rb-pulse" />
      {/* ear modules */}
      <rect x="94" y="138" width="28" height="68" rx="14" fill="url(#rd-ear)" /><rect x="100" y="150" width="14" height="44" rx="7" fill="#22d3ee" opacity="0.9" />
      <rect x="298" y="138" width="28" height="68" rx="14" fill="url(#rd-ear)" /><rect x="306" y="150" width="14" height="44" rx="7" fill="#22d3ee" opacity="0.9" />
      {/* shell */}
      <rect x="116" y="72" width="188" height="180" rx="72" fill="url(#rd-shell)" />
      <path d="M138 96 C166 80 254 80 282 96" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      {/* forehead emblem */}
      <circle cx="210" cy="94" r="13" fill="#14b8a6" /><path d="M210 86 v16 M202 94 h16" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      {/* visor */}
      <rect x="136" y="116" width="148" height="104" rx="46" fill="url(#rd-visor)" stroke="#5ee7ff" strokeOpacity="0.55" strokeWidth="2.5" />
      <path d="M156 130 C180 122 240 122 264 130" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="5" strokeLinecap="round" />
      {/* eyes */}
      <g filter="url(#rd-glow)" className="rb-blink">
        <rect x="165" y="142" width="32" height="42" rx="16" fill="url(#rd-eye)" />
        <rect x="223" y="142" width="32" height="42" rx="16" fill="url(#rd-eye)" />
      </g>
      <circle cx="176" cy="154" r="5" fill="#fff" opacity="0.95" /><circle cx="234" cy="154" r="5" fill="#fff" opacity="0.95" />
      {/* cheeks + smile */}
      <ellipse cx="156" cy="198" rx="10" ry="5" fill="#ff7ab6" opacity="0.7" /><ellipse cx="264" cy="198" rx="10" ry="5" fill="#ff7ab6" opacity="0.7" />
      <path d="M190 197 Q210 215 230 197" fill="none" stroke="#7df3ff" strokeWidth="5" strokeLinecap="round" filter="url(#rd-glow)" />
      <path d="M188 238 H232" stroke="#a9b6cc" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

export default RobotDoctor;
