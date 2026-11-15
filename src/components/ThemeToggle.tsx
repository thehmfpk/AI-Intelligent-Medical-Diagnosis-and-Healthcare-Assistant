import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/useTheme';

/** Sun/moon button that switches between the dark and light theme. */
const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [theme, toggle] = useTheme();
  const isLight = theme === 'light';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Dark mode' : 'Light mode'}
      className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors ${className}`}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

export default ThemeToggle;
