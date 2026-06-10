import { Keyboard, Shield, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-6xl mx-auto px-4 pt-6 pb-2">
      <div className="glass-panel rounded-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-slate-800/60 relative overflow-hidden">
        {/* Glow backdrop inside header */}
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-400/20 flex items-center justify-center">
            <Keyboard className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent m-0 tracking-tight leading-none">
                TypeMaster
              </h1>
              <span className="bg-indigo-950/60 text-indigo-400 text-[10px] font-semibold font-mono px-2 py-0.5 rounded-md border border-indigo-800/35 uppercase tracking-wider">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Premium Keyboard Efficiency Console
            </p>
          </div>
        </div>

        {/* Shortcuts & Status */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Developer Mode:</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-950/40 border border-slate-800/50 px-3 py-1.5 rounded-lg text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-sans shadow shadow-black">Esc</kbd>
              <span>Restart</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-sans shadow shadow-black">Ctrl</kbd>
              <span>+</span>
              <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-sans shadow shadow-black">N</kbd>
              <span>New Text</span>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-purple-950/30 border border-purple-900/40 text-purple-400 px-3 py-1.5 rounded-lg text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>WPM Tracker</span>
          </div>
        </div>
      </div>
    </header>
  );
};
