import React from 'react';
import type { Form } from '../lib/medicineGuide';

interface Props { form: Form; color: string; size?: number; }

/** Original illustration of the kind of medicine (tablet, syrup, inhaler...). Not a photo of a branded product. */
const MedicineImage: React.FC<Props> = ({ form, color, size = 84 }) => {
  const c = color;
  const body = (() => {
    switch (form) {
      case 'tablet':
        return (<g><ellipse cx="38" cy="50" rx="24" ry="14" fill="#fff" stroke={c} strokeWidth="3" transform="rotate(-20 38 50)" /><path d="M24 56 L52 44" stroke={c} strokeWidth="2.5" /><circle cx="64" cy="62" r="11" fill={c} opacity=".85" /><circle cx="64" cy="62" r="11" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".6" /></g>);
      case 'capsule':
        return (<g transform="rotate(-35 48 48)"><rect x="18" y="36" width="60" height="24" rx="12" fill="#fff" stroke={c} strokeWidth="3" /><path d="M48 36 H66 A12 12 0 0 1 66 60 H48 Z" fill={c} /><rect x="24" y="41" width="18" height="4" rx="2" fill={c} opacity=".25" /></g>);
      case 'syrup':
        return (<g><rect x="36" y="14" width="24" height="10" rx="3" fill={c} /><path d="M38 24 H58 V32 C66 38 70 44 70 54 V78 A6 6 0 0 1 64 84 H32 A6 6 0 0 1 26 78 V54 C26 44 30 38 38 32 Z" fill="#fff" stroke={c} strokeWidth="3" /><path d="M28 56 H68 V78 A4 4 0 0 1 64 82 H32 A4 4 0 0 1 28 78 Z" fill={c} opacity=".75" /><rect x="34" y="62" width="28" height="12" rx="2" fill="#fff" opacity=".85" /></g>);
      case 'cream':
        return (<g><path d="M24 36 H72 L66 80 H30 Z" fill="#fff" stroke={c} strokeWidth="3" /><rect x="28" y="22" width="40" height="14" rx="3" fill={c} /><rect x="34" y="48" width="28" height="6" rx="2" fill={c} opacity=".7" /><rect x="38" y="58" width="20" height="5" rx="2" fill={c} opacity=".35" /></g>);
      case 'drops':
        return (<g><rect x="38" y="10" width="20" height="14" rx="3" fill={c} /><path d="M40 24 H56 V34 L60 80 A4 4 0 0 1 56 84 H40 A4 4 0 0 1 36 80 L40 34 Z" fill="#fff" stroke={c} strokeWidth="3" /><path d="M48 44 C54 52 56 58 48 64 C40 58 42 52 48 44 Z" fill={c} /></g>);
      case 'spray':
        return (<g><rect x="32" y="40" width="30" height="44" rx="6" fill="#fff" stroke={c} strokeWidth="3" /><rect x="38" y="26" width="18" height="14" fill={c} /><path d="M56 28 H70 V34 H56" fill={c} /><circle cx="76" cy="31" r="1.8" fill={c} /><circle cx="82" cy="26" r="1.8" fill={c} /><circle cx="82" cy="36" r="1.8" fill={c} /><rect x="38" y="52" width="18" height="14" rx="2" fill={c} opacity=".4" /></g>);
      case 'inhaler':
        return (<g><rect x="30" y="14" width="26" height="46" rx="5" fill="#fff" stroke={c} strokeWidth="3" /><path d="M24 60 H70 V70 A8 8 0 0 1 62 78 H24 Z" fill={c} /><rect x="36" y="24" width="14" height="10" rx="2" fill={c} opacity=".5" /></g>);
      case 'injection':
        return (<g transform="rotate(-40 48 48)"><rect x="24" y="40" width="40" height="16" rx="3" fill="#fff" stroke={c} strokeWidth="3" /><rect x="30" y="44" width="22" height="8" fill={c} opacity=".7" /><rect x="64" y="46" width="10" height="4" fill={c} /><path d="M74 48 H88" stroke={c} strokeWidth="2.5" /><rect x="14" y="36" width="6" height="24" rx="2" fill={c} /><rect x="8" y="46" width="6" height="4" fill={c} /></g>);
      case 'sachet':
        return (<g><path d="M22 24 H74 V74 H22 Z" fill="#fff" stroke={c} strokeWidth="3" /><path d="M22 24 L26 20 L30 24 L34 20 L38 24 L42 20 L46 24 L50 20 L54 24 L58 20 L62 24 L66 20 L70 24 L74 24" fill="none" stroke={c} strokeWidth="2" /><circle cx="48" cy="50" r="12" fill={c} opacity=".8" /><path d="M42 50 H54 M48 44 V56" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></g>);
      case 'device':
        return (<g><rect x="20" y="30" width="56" height="38" rx="8" fill="#fff" stroke={c} strokeWidth="3" /><circle cx="48" cy="49" r="10" fill={c} opacity=".8" /><rect x="28" y="38" width="10" height="4" rx="2" fill={c} /></g>);
      case 'procedure':
        return (<g><rect x="22" y="20" width="52" height="56" rx="8" fill="#fff" stroke={c} strokeWidth="3" /><path d="M48 32 V64 M32 48 H64" stroke={c} strokeWidth="8" strokeLinecap="round" /></g>);
      default: // care
        return (<g><path d="M48 78 C20 58 18 34 34 28 C42 25 47 30 48 34 C49 30 54 25 62 28 C78 34 76 58 48 78 Z" fill="#fff" stroke={c} strokeWidth="3" /><path d="M36 48 H44 L48 40 L54 58 L58 48 H62" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></g>);
    }
  })();
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} role="img" aria-label={`${form} illustration`}>
      <circle cx="48" cy="48" r="46" fill={c} opacity=".12" />
      {body}
    </svg>
  );
};

export default MedicineImage;
