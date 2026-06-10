import React, { useRef, useEffect, useState } from 'react';
import { useTypingStore } from '../store/useTypingStore';
import { RefreshCw, Play, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ParagraphDisplay: React.FC = () => {
  const {
    paragraph,
    typedText,
    status,
    typeChar,
    backspace,
    resetTest,
  } = useTypingStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Focus input on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      setIsFocused(true);
    }
  }, [paragraph]);

  const handleContainerClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      setIsFocused(true);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (status === 'completed') return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      backspace();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      typeChar(e.key);
    }
  };

  // Render individual character with proper coloring and active caret
  const renderChar = (char: string, index: number) => {
    const isTyped = index < typedText.length;
    const isActive = index === typedText.length;
    const isCorrect = isTyped && typedText[index] === char;

    let charClass = 'transition-colors duration-100 font-mono tracking-wide text-lg sm:text-xl md:text-2xl select-none ';
    
    if (isActive) {
      // Current active character being typed
      charClass += 'text-indigo-400 bg-indigo-950/40 rounded border-l-2 border-indigo-400 animate-caret-blink px-[1px] font-bold';
    } else if (isTyped) {
      if (isCorrect) {
        charClass += 'text-emerald-400';
      } else {
        // Red color for incorrect characters, showing whitespace errors as red underdots/boxes
        charClass += char === ' ' 
          ? 'text-rose-500 bg-rose-950/35 border-b-2 border-rose-500 rounded px-[2px]' 
          : 'text-rose-500 bg-rose-950/20 border-b border-rose-500 rounded';
      }
    } else {
      // Untyped remaining characters
      charClass += 'text-slate-500';
    }

    return (
      <span key={index} className={charClass}>
        {char === ' ' && !isCorrect && isTyped ? '␣' : char}
      </span>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2">
      {/* Hidden textarea to capture keystrokes */}
      <textarea
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="opacity-0 absolute -z-50 w-0 h-0 pointer-events-none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      <div 
        onClick={handleContainerClick}
        className="glass-panel hover:border-slate-700/80 transition-all duration-300 rounded-3xl p-6 md:p-8 shadow-2xl relative min-h-[260px] flex flex-col justify-between cursor-text overflow-hidden select-none border border-slate-800/80"
      >
        {/* Glow orb inside display */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Text Paragraph */}
        <div className="relative z-10 leading-relaxed md:leading-loose text-left break-words px-2">
          {paragraph.split('').map((char, index) => renderChar(char, index))}
        </div>

        {/* Info & CTA Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded text-slate-400">
              <Play className="w-3.5 h-3.5 text-indigo-400" />
              <span>Status:</span>
              <span className={`font-semibold capitalize ${
                status === 'typing' ? 'text-indigo-400' :
                status === 'completed' ? 'text-emerald-400' : 'text-slate-400'
              }`}>{status}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetTest();
                textareaRef.current?.focus();
              }}
              className="flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restart (Esc)</span>
            </button>
          </div>
        </div>

        {/* Focus Overlay Warning */}
        <AnimatePresence>
          {!isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-[4px] z-20 flex flex-col items-center justify-center text-center p-6 gap-3"
            >
              <div className="p-3 bg-indigo-950/60 border border-indigo-500/35 text-indigo-400 rounded-2xl animate-bounce">
                <Keyboard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Focus Lost</h3>
              <p className="text-sm text-slate-400 max-w-xs leading-normal">
                Click anywhere on the dashboard or press a key to re-focus and continue typing.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
