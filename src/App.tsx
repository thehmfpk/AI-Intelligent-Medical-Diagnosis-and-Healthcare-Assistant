import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header, { Page } from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AnalysisPage from './components/AnalysisPage';
import ResultPage from './components/ResultPage';
import MedicationPage from './components/MedicationPage';
import ContactPage from './components/ContactPage';
import ChatAssistant from './components/ChatAssistant';
import AqiMapPage from './components/AqiMapPage';
import PredictionAnimation from './components/PredictionAnimation';
import { rankDiseases, RankedDisease } from './lib/predictor';
import { medicalEncyclopedia, DiseaseInfo } from './data/medicalData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [ranking, setRanking] = useState<RankedDisease[]>([]);
  const [pending, setPending] = useState<string[] | null>(null);
  const [predictedDisease, setPredictedDisease] = useState<string>('');
  const [selectedDiseaseInfo, setSelectedDiseaseInfo] = useState<DiseaseInfo | null>(null);
  const [history, setHistory] = useState<{ disease: string, date: string, symptoms: number }[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dr_hmf_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  // Persistence of scroll position on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleStartAnalysis = () => {
    setCurrentPage('analysis');
  };

  // Starts the "doctor typing" animation; the result is computed when it ends.
  const handleAnalyze = (picked: string[]) => {
    if (picked.length === 0) return;
    setPending(picked);
  };

  const finishPrediction = () => {
    if (!pending) return;
    const ranked = rankDiseases(pending);
    const best = ranked[0]?.disease ?? '';
    const newEntry = { disease: best, date: new Date().toISOString(), symptoms: pending.length };
    const updatedHistory = [newEntry, ...history].slice(0, 5);
    setHistory(updatedHistory);
    try { localStorage.setItem('dr_hmf_history', JSON.stringify(updatedHistory)); } catch { /* ignore */ }
    setSymptoms(pending);
    setRanking(ranked);
    setPredictedDisease(best);
    setPending(null);
    setCurrentPage('result');
  };

  // const handleCheckMedication = (disease: string) => {
  //   const info = medicalEncyclopedia[disease] || medicalEncyclopedia[Object.keys(medicalEncyclopedia)[0]];
  //   setSelectedDiseaseInfo(info);
  //   setCurrentPage('medication');
  // };

  const handleCheckMedication = (disease: string) => {
    const key = Object.keys(medicalEncyclopedia).find(
      k => k.toLowerCase() === disease.toLowerCase()
    );

    const info =
      medicalEncyclopedia[key || Object.keys(medicalEncyclopedia)[0]];

    setSelectedDiseaseInfo({ ...info }); // important: force new object
    setCurrentPage('medication');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500 selection:text-black font-sans antialiased overflow-x-hidden">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HomePage onStart={handleStartAnalysis} onAqi={() => setCurrentPage('aqi')} />
            </motion.div>
          )}

          {currentPage === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <AnalysisPage
                onAnalyze={handleAnalyze}
                onOpenChat={() => setCurrentPage('chat')}
              />
            </motion.div>
          )}

          {currentPage === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ChatAssistant onAnalyze={handleAnalyze} />
            </motion.div>
          )}

          {currentPage === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              <ResultPage
                symptoms={symptoms}
                ranking={ranking}
                onRerun={handleAnalyze}
                onCheckMedication={handleCheckMedication}
                onNewCheckup={() => setCurrentPage('analysis')}
                history={history}
              />
            </motion.div>
          )}

          {currentPage === 'medication' && selectedDiseaseInfo && (
            <motion.div
              key="medication"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <MedicationPage
                info={selectedDiseaseInfo}
                symptoms={symptoms}
                onBack={() => setCurrentPage('result')}
                history={history}
              />
            </motion.div>
          )}

          {currentPage === 'aqi' && (
            <motion.div key="aqi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <AqiMapPage onStartCheckup={handleStartAnalysis} />
            </motion.div>
          )}

          {currentPage === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ContactPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {pending && <PredictionAnimation symptomCount={pending.length} onDone={finishPrediction} />}
      </AnimatePresence>

      <Footer setCurrentPage={setCurrentPage} />

      {/* Global CSS for Print and Scrollbars */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; padding: 0 !important; margin: 0 !important; }
          #med-report { border: none !important; box-shadow: none !important; border-radius: 0 !important; padding: 0 !important; }
          .bg-slate-950, .bg-[#050505], .bg-[#0a0a0a], .bg-zinc-900\/40, .bg-white\/\[0.02\] { background: white !important; }
          .text-white, .text-gray-400, .text-gray-500, .text-gray-600, .text-gray-700 { color: black !important; }
          .border-white\/5, .border-cyan-500\/10 { border-color: #ddd !important; }
          h2, h3, h4, h1 { color: black !important; text-decoration-color: black !important; }
          .decoration-cyan-500 { text-decoration-color: black !important; }
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: #1a1a1a #050505;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #050505;
        }

        ::-webkit-scrollbar-thumb {
          background: #1a1a1a;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #22d3ee;
        }
      `}} />
    </div>
  );
}
