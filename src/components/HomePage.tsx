import React from 'react';
import HeroSection from './HeroSection';
import { Ticker, HowItWorks, Features } from './home/sections';
import { LiveAir, Trust, Faq, FinalCta } from './home/sections2';
import type { Page } from './Header';

interface HomePageProps {
  onStart: () => void;
  onAqi: () => void;
  onNavigate: (p: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart, onAqi, onNavigate }) => (
  <div className="bg-[#020204] text-white selection:bg-cyan-500/30 font-sans overflow-x-clip relative">
    <HeroSection onStart={onStart} onAqi={onAqi} />
    <Ticker />
    <HowItWorks onNavigate={onNavigate} onStart={onStart} />
    <Features onNavigate={onNavigate} onStart={onStart} />
    <LiveAir onAqi={onAqi} />
    <Trust />
    <Faq />
    <FinalCta onStart={onStart} onAqi={onAqi} />
  </div>
);

export default HomePage;
