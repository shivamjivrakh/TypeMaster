import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypingStore } from '../store/useTypingStore';
import { Trophy, RefreshCw, ChevronRight, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompletionModalProps {
  onNewParagraph: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({ onNewParagraph }) => {
  const {
    status,
    wpm,
    cpm,
    accuracy,
    elapsedTime,
    mistakes,
    correctChars,
    maxStreak,
    resetTest,
    wpmHistory,
  } = useTypingStore();

  const isOpen = status === 'completed';

  // Confetti effect on completion
  useEffect(() => {
    if (isOpen) {
      // Primary burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#10b981'],
      });

      // Side bursts
      const duration = 1.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a855f7', '#6366f1'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a855f7', '#10b981'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  }, [isOpen]);

  // Global keydown listeners for shortcuts when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onNewParagraph();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        resetTest();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNewParagraph, resetTest]);

  // Performance rating based on WPM
  const getRating = (wpmValue: number) => {
    if (wpmValue < 30) return { title: 'Novice Scribe 📜', desc: 'Keep practicing! Focus on accuracy first.', color: 'text-slate-400' };
    if (wpmValue < 50) return { title: 'Keyboard Warrior ⚔️', desc: 'Solid speed. Work on muscle memory for keys.', color: 'text-amber-400' };
    if (wpmValue < 80) return { title: 'Code Ninja 🥷', desc: 'Very fast! You represent professional typing efficiency.', color: 'text-indigo-400' };
    if (wpmValue < 100) return { title: 'Typing Wizard 🧙', desc: 'Amazing! Outstanding velocity and coordination.', color: 'text-emerald-400' };
    return { title: 'Supercharged Cyborg 🤖', desc: 'Unbelievable speed! You have surpassed human limitations.', color: 'text-fuchsia-400' };
  };

  const rating = getRating(wpm);

  // SVG Sparkline calculation for WPM History
  const drawSparkline = () => {
    if (wpmHistory.length < 2) return null;

    const width = 360;
    const height = 64;
    const maxVal = Math.max(...wpmHistory.map(h => h.wpm), 80);
    const minVal = Math.min(...wpmHistory.map(h => h.wpm), 20);
    const range = maxVal - minVal || 1;

    const points = wpmHistory.map((item, index) => {
      const x = (index / (wpmHistory.length - 1)) * width;
      const y = height - 5 - ((item.wpm - minVal) / range) * (height - 10);
      return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;
    const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;

    return { pathData, areaData, width, height };
  };

  const chart = drawSparkline();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetTest}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal box */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="glass-panel w-full max-w-lg rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Glowing borders */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            <div className="absolute -left-16 -top-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header Icon & Title */}
            <div className="flex flex-col items-center text-center gap-2 mb-6">
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-4 rounded-full shadow-lg shadow-indigo-500/25 border border-indigo-400/20 mb-2">
                <Trophy className="w-8 h-8 text-white animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-200 via-white to-emerald-200 bg-clip-text text-transparent">
                Typing Test Completed!
              </h2>
              <span className={`text-sm font-semibold uppercase tracking-wider font-mono ${rating.color}`}>
                {rating.title}
              </span>
              <p className="text-xs text-slate-400 max-w-sm">
                "{rating.desc}"
              </p>
            </div>

            {/* Grid statistics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-slate-500">// SPEED</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-mono text-white">{wpm}</span>
                  <span className="text-xs text-slate-400">WPM</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">{cpm} CPM</span>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-slate-500">// ACCURACY</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-mono text-emerald-400">{accuracy}%</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">{correctChars} correct</span>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-slate-500">// MISTAKES</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-2xl font-bold font-mono ${mistakes > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {mistakes}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">Best Streak: {maxStreak}</span>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-slate-500">// ELAPSED TIME</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-mono text-white">{elapsedTime}s</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">Time Limit: None</span>
              </div>
            </div>

            {/* Sparkline chart */}
            {chart && (
              <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  <span>WPM Progression Chart</span>
                </div>
                <div className="flex items-center justify-center pt-2">
                  <svg width="100%" height={chart.height} viewBox={`0 0 ${chart.width} ${chart.height}`} className="overflow-visible">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Fill Area */}
                    <path d={chart.areaData} fill="url(#chartGradient)" />
                    {/* Sparkline */}
                    <path
                      d={chart.pathData}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={resetTest}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-sm font-mono text-slate-300 hover:text-white transition-all cursor-pointer group shadow"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                <span>Retry (Esc)</span>
              </button>

              <button
                onClick={onNewParagraph}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-750 text-sm font-mono font-semibold text-white transition-all cursor-pointer shadow-lg shadow-indigo-500/15"
              >
                <span>New Text</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[9px] bg-white/20 px-1 py-0.5 rounded text-white font-sans font-normal">Enter</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
