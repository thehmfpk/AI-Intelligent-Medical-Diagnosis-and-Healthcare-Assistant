import React from 'react';

/** Original robot-doctor illustration (SVG). Upper body, meant to be cropped by the bottom edge. */
const RobotDoctor: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 400 520" className={className} role="img" aria-label="Robot doctor">
    <defs>
      <linearGradient id="rd-metal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" /><stop offset="0.55" stopColor="#e2e8f0" /><stop offset="1" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="rd-coat" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient id="rd-scrub" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2dd4bf" /><stop offset="1" stopColor="#0d9488" />
      </linearGradient>
      <radialGradient id="rd-visor" cx="0.5" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#12304f" /><stop offset="1" stopColor="#050b18" />
      </radialGradient>
      <filter id="rd-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>

    {/* torso: lab coat */}
    <path d="M18 520 C18 396 70 322 148 304 L200 376 L252 304 C330 322 382 396 382 520 Z" fill="url(#rd-coat)" />
    {/* scrubs v-neck */}
    <path d="M150 304 L200 376 L250 304 L236 296 L200 332 L164 296 Z" fill="url(#rd-scrub)" />
    <path d="M164 296 L200 332 L236 296 L200 262 Z" fill="#0f766e" opacity="0.55" />
    {/* lapel shading */}
    <path d="M148 304 L200 376 L190 392 L132 318 Z" fill="#cbd5e1" opacity="0.7" />
    <path d="M252 304 L200 376 L210 392 L268 318 Z" fill="#cbd5e1" opacity="0.7" />
    <path d="M200 376 L200 520" stroke="#cbd5e1" strokeWidth="2" />

    {/* neck */}
    <rect x="172" y="246" width="56" height="52" rx="10" fill="#334155" />
    <path d="M172 262 H228 M172 276 H228" stroke="#64748b" strokeWidth="3" />

    {/* stethoscope */}
    <path d="M158 300 C140 372 150 436 196 452 C236 464 266 430 254 398" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
    <path d="M242 300 C246 336 254 360 254 384" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
    <circle cx="254" cy="396" r="15" fill="#94a3b8" stroke="#1e293b" strokeWidth="5" />
    <circle cx="254" cy="396" r="5" fill="#22d3ee" filter="url(#rd-glow)" className="rb-pulse" />

    {/* pocket with red cross */}
    <rect x="292" y="414" width="52" height="38" rx="6" fill="#f1f5f9" stroke="#cbd5e1" />
    <path d="M318 422 v22 M307 433 h22" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
    <rect x="62" y="420" width="40" height="8" rx="4" fill="#cbd5e1" /><rect x="62" y="436" width="28" height="8" rx="4" fill="#cbd5e1" />

    {/* head (tilts gently) */}
    <g className="rb-tilt" style={{ transformOrigin: '200px 290px' }}>
      {/* antenna */}
      <path d="M200 84 V52" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
      <circle cx="200" cy="44" r="9" fill="#22d3ee" filter="url(#rd-glow)" className="rb-pulse" />
      {/* ears */}
      <circle cx="104" cy="170" r="20" fill="#94a3b8" /><circle cx="104" cy="170" r="9" fill="#22d3ee" opacity="0.85" />
      <circle cx="296" cy="170" r="20" fill="#94a3b8" /><circle cx="296" cy="170" r="9" fill="#22d3ee" opacity="0.85" />
      {/* skull */}
      <rect x="112" y="80" width="176" height="180" rx="68" fill="url(#rd-metal)" />
      <path d="M130 100 C150 88 250 88 270 100" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      {/* head mirror band */}
      <rect x="114" y="112" width="172" height="12" fill="#1e293b" />
      <circle cx="200" cy="118" r="20" fill="#e2e8f0" stroke="#475569" strokeWidth="4" />
      <circle cx="200" cy="118" r="11" fill="#bae6fd" /><path d="M193 112 l8 -3" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      {/* visor */}
      <rect x="130" y="138" width="140" height="92" rx="40" fill="url(#rd-visor)" stroke="#22d3ee" strokeOpacity="0.55" strokeWidth="2.5" />
      {/* eyes */}
      <g filter="url(#rd-glow)" className="rb-blink">
        <rect x="156" y="160" width="30" height="36" rx="14" fill="#22d3ee" />
        <rect x="214" y="160" width="30" height="36" rx="14" fill="#22d3ee" />
      </g>
      <circle cx="165" cy="170" r="4" fill="#fff" opacity="0.9" /><circle cx="223" cy="170" r="4" fill="#fff" opacity="0.9" />
      {/* smile */}
      <path d="M182 210 Q200 224 218 210" fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" filter="url(#rd-glow)" />
      {/* chin vent */}
      <path d="M176 244 H224" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

export default RobotDoctor;
