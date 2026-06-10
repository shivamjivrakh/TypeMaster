import React, { useEffect, useState } from 'react';
import { useTypingStore } from '../store/useTypingStore';

interface KeyConfig {
  code: string;
  label: string;
  width: string;
}

export const KeyboardOverlay: React.FC = () => {
  const { status } = useTypingStore();
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't track if text test completed
      if (status === 'completed') return;

      const code = e.code.toLowerCase();
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.add(code);
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code.toLowerCase();
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [status]);

  // Keyboard Rows layout using standard e.code values
  const row1: KeyConfig[] = [
    { code: 'keyq', label: 'Q', width: 'w-8 sm:w-11' },
    { code: 'keyw', label: 'W', width: 'w-8 sm:w-11' },
    { code: 'keye', label: 'E', width: 'w-8 sm:w-11' },
    { code: 'keyr', label: 'R', width: 'w-8 sm:w-11' },
    { code: 'keyt', label: 'T', width: 'w-8 sm:w-11' },
    { code: 'keyy', label: 'Y', width: 'w-8 sm:w-11' },
    { code: 'keyu', label: 'U', width: 'w-8 sm:w-11' },
    { code: 'keyi', label: 'I', width: 'w-8 sm:w-11' },
    { code: 'keyo', label: 'O', width: 'w-8 sm:w-11' },
    { code: 'keyp', label: 'P', width: 'w-8 sm:w-11' },
    { code: 'bracketleft', label: '{', width: 'w-8 sm:w-11' },
    { code: 'bracketright', label: '}', width: 'w-8 sm:w-11' },
    { code: 'backspace', label: '⌫', width: 'flex-1 min-w-[36px]' },
  ];

  const row2: KeyConfig[] = [
    { code: 'capslock', label: 'Caps', width: 'w-10 sm:w-14' },
    { code: 'keya', label: 'A', width: 'w-8 sm:w-11' },
    { code: 'keys', label: 'S', width: 'w-8 sm:w-11' },
    { code: 'keyd', label: 'D', width: 'w-8 sm:w-11' },
    { code: 'keyf', label: 'F', width: 'w-8 sm:w-11' },
    { code: 'keyg', label: 'G', width: 'w-8 sm:w-11' },
    { code: 'keyh', label: 'H', width: 'w-8 sm:w-11' },
    { code: 'keyj', label: 'J', width: 'w-8 sm:w-11' },
    { code: 'keyk', label: 'K', width: 'w-8 sm:w-11' },
    { code: 'keyl', label: 'L', width: 'w-8 sm:w-11' },
    { code: 'semicolon', label: ';', width: 'w-8 sm:w-11' },
    { code: 'quote', label: '"', width: 'w-8 sm:w-11' },
    { code: 'enter', label: 'Enter ↵', width: 'flex-1 min-w-[50px]' },
  ];

  const row3: KeyConfig[] = [
    { code: 'shiftleft', label: 'Shift', width: 'w-12 sm:w-18' },
    { code: 'keyz', label: 'Z', width: 'w-8 sm:w-11' },
    { code: 'keyx', label: 'X', width: 'w-8 sm:w-11' },
    { code: 'keyc', label: 'C', width: 'w-8 sm:w-11' },
    { code: 'keyv', label: 'V', width: 'w-8 sm:w-11' },
    { code: 'keyb', label: 'B', width: 'w-8 sm:w-11' },
    { code: 'keyn', label: 'N', width: 'w-8 sm:w-11' },
    { code: 'keym', label: 'M', width: 'w-8 sm:w-11' },
    { code: 'comma', label: '<', width: 'w-8 sm:w-11' },
    { code: 'period', label: '>', width: 'w-8 sm:w-11' },
    { code: 'slash', label: '?', width: 'w-8 sm:w-11' },
    { code: 'shiftright', label: 'Shift', width: 'flex-1 min-w-[40px]' },
  ];

  const row4: KeyConfig[] = [
    { code: 'controlleft', label: 'Ctrl', width: 'w-10 sm:w-14' },
    { code: 'metaleft', label: '❖', width: 'w-8 sm:w-11' },
    { code: 'altleft', label: 'Alt', width: 'w-8 sm:w-11' },
    { code: 'space', label: '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯', width: 'w-36 sm:w-80 flex-grow max-w-[420px]' },
    { code: 'altright', label: 'Alt', width: 'w-8 sm:w-11' },
    { code: 'controlright', label: 'Ctrl', width: 'w-10 sm:w-14' },
  ];

  const renderKey = ({ code, label, width }: KeyConfig) => {
    const isPressed = pressedKeys.has(code);

    return (
      <div
        key={code}
        className={`h-8 sm:h-11 ${width} flex items-center justify-center text-[10px] sm:text-xs font-mono font-medium rounded-lg border transition-all duration-75 select-none ${isPressed
            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)] scale-[0.96] translate-y-[1px]'
            : 'bg-slate-900/40 text-slate-400 border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]'
          }`}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 hidden md:block">
      <div className="glass-panel rounded-2xl p-5 border border-slate-800/60 shadow-lg flex flex-col gap-2.5 items-center relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-80 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2 mb-1.5 border-b border-slate-850 pb-2">
          <span> Reactive Keymap Visualizer</span>
          <span>Mechanical layout</span>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-1.5 w-full items-stretch max-w-[660px]">
          <div className="flex gap-1.5 justify-center">{row1.map(renderKey)}</div>
          <div className="flex gap-1.5 justify-center">{row2.map(renderKey)}</div>
          <div className="flex gap-1.5 justify-center">{row3.map(renderKey)}</div>
          <div className="flex gap-1.5 justify-center">{row4.map(renderKey)}</div>
        </div>
      </div>
    </div>
  );
};
