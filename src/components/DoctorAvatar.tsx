import React, { useEffect, useRef, useState } from 'react';

interface Props {
  /** Mouth animates while true. */
  speaking?: boolean;
  /** Hands on the keyboard (used by the prediction animation). */
  typing?: boolean;
  size?: number;
  className?: string;
}

/**
 * An original illustrated young doctor. The pupils follow the pointer
 * so the doctor always seems to be looking at the patient; with no pointer
 * movement (phones) the gaze stays straight ahead.
 */
const DoctorAvatar: React.FC<Props> = ({ speaking = false, typing = false, size = 220, className = '' }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.32);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 260);
      setLook({ x: (dx / d) * 3.2 * k, y: (dy / d) * 2.4 * k });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 240 280"
      width={size}
      height={(size * 280) / 240}
      className={className}
      role="img"
      aria-label="Animated young doctor looking at you"
    >
      <defs>
        <linearGradient id="dc-coat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbe7ee" />
        </linearGradient>
        <linearGradient id="dc-scrub" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>

      <g className="doc-breathe">
        {/* torso / white coat */}
        <path d="M28 280 C28 214 62 190 120 188 C178 190 212 214 212 280 Z" fill="url(#dc-coat)" stroke="#9fb4c0" strokeWidth="1.5" />
        {/* scrub top */}
        <path d="M92 190 L120 236 L148 190 C138 186 102 186 92 190 Z" fill="url(#dc-scrub)" />
        {/* lapels */}
        <path d="M92 190 L112 244 L84 280 L60 280 L70 214 Z" fill="#eef4f7" stroke="#9fb4c0" strokeWidth="1.2" />
        <path d="M148 190 L128 244 L156 280 L180 280 L170 214 Z" fill="#eef4f7" stroke="#9fb4c0" strokeWidth="1.2" />
        {/* stethoscope */}
        <path d="M96 192 C84 226 92 252 120 252 C148 252 156 226 144 192" fill="none" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="120" cy="254" r="7" fill="#64748b" stroke="#334155" strokeWidth="2" />
        {/* name badge */}
        <rect x="150" y="226" width="34" height="18" rx="3" fill="#fff" stroke="#9fb4c0" />
        <rect x="154" y="231" width="20" height="3" rx="1.5" fill="#06b6d4" />
        <rect x="154" y="237" width="12" height="2.4" rx="1.2" fill="#94a3b8" />
        {/* cross on pocket */}
        <g transform="translate(60 236)"><rect x="-2" y="-7" width="4" height="14" fill="#ef4444" /><rect x="-7" y="-2" width="14" height="4" fill="#ef4444" /></g>

        {/* neck */}
        <path d="M105 168 L105 192 C112 200 128 200 135 192 L135 168 Z" fill="#e0ac86" />

        <g className="doc-nod">
          {/* hair back */}
          <path d="M62 112 C58 56 96 36 124 38 C160 40 184 66 178 116 C176 96 164 80 120 78 C84 78 66 92 62 112 Z" fill="#1f2937" />
          {/* ears */}
          <ellipse cx="66" cy="118" rx="7" ry="11" fill="#e8b693" />
          <ellipse cx="174" cy="118" rx="7" ry="11" fill="#e8b693" />
          {/* face */}
          <path d="M68 108 C68 70 92 56 120 56 C148 56 172 70 172 108 C172 146 150 172 120 172 C90 172 68 146 68 108 Z" fill="#f0c3a2" />
          {/* hair front */}
          <path d="M66 106 C60 60 92 40 124 42 C158 44 180 68 174 108 C168 90 152 72 126 70 C100 68 76 80 66 106 Z" fill="#111827" />
          <path d="M96 62 C112 50 140 52 154 66" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
          {/* brows */}
          <path d="M86 100 C92 95 102 95 108 99" fill="none" stroke="#111827" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M132 99 C138 95 148 95 154 100" fill="none" stroke="#111827" strokeWidth="3.2" strokeLinecap="round" />
          {/* eyes */}
          <g className="doc-blink">
            <ellipse cx="97" cy="116" rx="10" ry="8" fill="#fff" />
            <ellipse cx="143" cy="116" rx="10" ry="8" fill="#fff" />
            <circle cx={97 + look.x} cy={116 + look.y} r="4.6" fill="#3b2a1e" />
            <circle cx={143 + look.x} cy={116 + look.y} r="4.6" fill="#3b2a1e" />
            <circle cx={98.6 + look.x} cy={114.4 + look.y} r="1.4" fill="#fff" />
            <circle cx={144.6 + look.x} cy={114.4 + look.y} r="1.4" fill="#fff" />
          </g>
          {/* glasses */}
          <g fill="none" stroke="#0e7490" strokeWidth="2.2" opacity="0.9">
            <rect x="82" y="104" width="30" height="24" rx="9" />
            <rect x="128" y="104" width="30" height="24" rx="9" />
            <path d="M112 114 H128" />
          </g>
          {/* nose */}
          <path d="M120 120 C117 134 116 140 121 142" fill="none" stroke="#c98f6a" strokeWidth="2" strokeLinecap="round" />
          {/* mouth */}
          {speaking ? (
            <ellipse className="doc-talk" cx="120" cy="153" rx="10" ry="5.5" fill="#7f1d1d" />
          ) : (
            <path d="M108 151 C115 160 125 160 132 151" fill="none" stroke="#9a3412" strokeWidth="3" strokeLinecap="round" />
          )}
          {/* light stubble-free cheeks */}
          <circle cx="86" cy="142" r="7" fill="#f4a8a0" opacity="0.3" />
          <circle cx="154" cy="142" r="7" fill="#f4a8a0" opacity="0.3" />
        </g>

        {typing && (
          <g>
            <ellipse className="doc-type-l" cx="84" cy="268" rx="13" ry="8" fill="#f0c3a2" />
            <ellipse className="doc-type-r" cx="156" cy="268" rx="13" ry="8" fill="#f0c3a2" />
          </g>
        )}
      </g>
    </svg>
  );
};

export default DoctorAvatar;
