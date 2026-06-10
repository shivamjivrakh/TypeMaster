import { useEffect } from 'react';
import { useTypingStore } from './store/useTypingStore';
import { getRandomParagraph } from './utils/paragraphs';
import { Header } from './components/Header';
import { StatsPanel } from './components/StatsPanel';
import { ParagraphDisplay } from './components/ParagraphDisplay';
import { KeyboardOverlay } from './components/KeyboardOverlay';
import { CompletionModal } from './components/CompletionModal';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const { initTest, tickTimer, status } = useTypingStore();

  // Load a random paragraph on mount
  useEffect(() => {
    initTest(getRandomParagraph());
  }, [initTest]);

  // Handle timer tick interval
  useEffect(() => {
    let timerId: any = null;
    if (status === 'typing') {
      timerId = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [status, tickTimer]);

  const handleNewParagraph = () => {
    const randomText = getRandomParagraph();
    initTest(randomText);
  };

  // Keyboard shortcut listener (Ctrl+N) to load a new paragraph
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'n' && e.ctrlKey) {
        e.preventDefault();
        handleNewParagraph();
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [initTest]);

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col justify-between select-none bg-radial-grid relative pb-12 overflow-hidden">
      {/* Premium background floating orbs */}
      <div className="absolute top-1/4 left-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-[-100px] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none animate-float-reverse" />

      <div>
        {/* Header Branding */}
        <Header />

        {/* Live Metrics */}
        <StatsPanel />

        {/* Interactive Typing Panel */}
        <ParagraphDisplay />

        {/* Reactive Mechanical Keyboard */}
        <KeyboardOverlay />

        {/* Global CTA Options */}
        <div className="w-full max-w-6xl mx-auto px-4 py-6 flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewParagraph}
            className="flex items-center gap-2 py-3 px-6 rounded-xl font-mono font-semibold text-sm bg-gradient-to-r from-indigo-500/15 to-purple-600/15 hover:from-indigo-500/25 hover:to-purple-600/25 border border-indigo-500/30 hover:border-indigo-400/50 text-indigo-300 hover:text-white cursor-pointer shadow-lg shadow-indigo-500/5 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Random Text (Ctrl+N)</span>
          </motion.button>
        </div>
      </div>

      {/* Completion Modal */}
      <CompletionModal onNewParagraph={handleNewParagraph} />

      {/* Footer metadata */}
      <footer className="w-full max-w-6xl mx-auto text-center px-4 pt-12 text-[10px] font-mono text-slate-600">
        <p>// TypeMaster efficiency engine. Crafted for developer touch-typing. Optimized for fast frames and zero layout jitter.</p>
      </footer>
    </div>
  );
}

export default App;
