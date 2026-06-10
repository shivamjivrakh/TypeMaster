import React from 'react';
import { motion } from 'framer-motion';
import { useTypingStore } from '../store/useTypingStore';
import { Zap, Target, Flame, Timer, CheckCircle, AlertCircle, Type, BookOpen } from 'lucide-react';

export const StatsPanel: React.FC = () => {
  const {
    wpm,
    cpm,
    accuracy,
    elapsedTime,
    streak,
    maxStreak,
    mistakes,
    correctChars,
    incorrectChars,
    paragraph,
    typedText,
  } = useTypingStore();

  // Words calculation
  const totalWords = paragraph ? paragraph.trim().split(/\s+/).length : 0;
  const typedWords = typedText ? typedText.trim().split(/\s+/).filter(Boolean).length : 0;
  const remainingWords = Math.max(0, totalWords - typedWords);

  // Formatting time as MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Progress percentage
  const progress = paragraph ? Math.min(100, Math.round((typedText.length / paragraph.length) * 100)) : 0;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  } as const;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 flex flex-col gap-6">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Speed Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4 }}
          className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-lg border border-slate-800/60 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400"> SPEED</span>
            <div className="p-2 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                {wpm}
              </span>
              <span className="text-sm text-indigo-400 font-semibold uppercase">Wpm</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 font-mono flex items-center justify-between">
              <span>Characters:</span>
              <span className="text-slate-300 font-semibold">{cpm} CPM</span>
            </div>
          </div>
        </motion.div>

        {/* Accuracy Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4 }}
          transition={{ delay: 0.05 }}
          className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-lg border border-slate-800/60 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400"> ACCURACY</span>
            <div className="p-2 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-lg">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold font-mono tracking-tight bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                  {accuracy}
                </span>
                <span className="text-sm text-emerald-400 font-semibold">%</span>
              </div>
              {/* Micro Circular Progress */}
              <div className="relative w-10 h-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className="text-emerald-400"
                    strokeWidth="3.5"
                    strokeDasharray={`${accuracy}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-2 font-mono flex items-center justify-between">
              <span>Mistakes:</span>
              <span className={`font-semibold ${mistakes > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                {mistakes}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Streak Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4 }}
          transition={{ delay: 0.1 }}
          className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-lg border border-slate-800/60 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400"> STREAK</span>
            <div className="p-2 bg-amber-950/40 border border-amber-500/20 text-amber-400 rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono tracking-tight bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                {streak}
              </span>
              <span className="text-sm text-amber-400 font-semibold uppercase">Keys</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 font-mono flex items-center justify-between">
              <span>Best Streak:</span>
              <span className="text-amber-400 font-semibold">{maxStreak} keys</span>
            </div>
          </div>
        </motion.div>

        {/* Timer Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4 }}
          transition={{ delay: 0.15 }}
          className="glass-panel glass-panel-hover rounded-2xl p-5 shadow-lg border border-slate-800/60 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400"> TIMER</span>
            <div className="p-2 bg-purple-950/40 border border-purple-500/20 text-purple-400 rounded-lg">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {formatTime(elapsedTime)}
              </span>
            </div>
            {/* Animated Progress Indicator */}
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-3 overflow-hidden border border-slate-700/30">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Secondary Dashboard Widget Bar */}
      <div className="glass-panel rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between border border-slate-850 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Correct Chars: <span className="text-slate-200 font-semibold">{correctChars}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Incorrect Chars: <span className="text-slate-200 font-semibold">{incorrectChars}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Remaining Words: <span className="text-slate-200 font-semibold">{remainingWords}</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-indigo-400 bg-indigo-950/30 border border-indigo-900/30 rounded px-2.5 py-1">
          <Type className="w-3.5 h-3.5" />
          <span>Progress: {progress}%</span>
        </div>
      </div>
    </div>
  );
};
