import { create } from 'zustand';

interface WpmHistoryItem {
  time: number;
  wpm: number;
}

interface TypingState {
  paragraph: string;
  typedText: string;
  status: 'idle' | 'typing' | 'completed';
  startTime: number | null;
  elapsedTime: number;
  mistakes: number;
  streak: number;
  maxStreak: number;
  correctChars: number;
  incorrectChars: number;
  wpm: number;
  cpm: number;
  accuracy: number;
  wpmHistory: WpmHistoryItem[];
  
  // Actions
  initTest: (paragraph: string) => void;
  typeChar: (char: string) => void;
  backspace: () => void;
  tickTimer: () => void;
  resetTest: () => void;
}

const calculateStats = (typed: string, target: string) => {
  let correct = 0;
  let incorrect = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) {
      correct++;
    } else {
      incorrect++;
    }
  }
  return { correct, incorrect };
};

const calculateStreak = (typed: string, target: string): number => {
  let currentStreak = 0;
  for (let i = typed.length - 1; i >= 0; i--) {
    if (typed[i] === target[i]) {
      currentStreak++;
    } else {
      break;
    }
  }
  return currentStreak;
};

export const useTypingStore = create<TypingState>((set, get) => ({
  paragraph: '',
  typedText: '',
  status: 'idle',
  startTime: null,
  elapsedTime: 0,
  mistakes: 0,
  streak: 0,
  maxStreak: 0,
  correctChars: 0,
  incorrectChars: 0,
  wpm: 0,
  cpm: 0,
  accuracy: 100,
  wpmHistory: [],

  initTest: (paragraph: string) => {
    set({
      paragraph,
      typedText: '',
      status: 'idle',
      startTime: null,
      elapsedTime: 0,
      mistakes: 0,
      streak: 0,
      maxStreak: 0,
      correctChars: 0,
      incorrectChars: 0,
      wpm: 0,
      cpm: 0,
      accuracy: 100,
      wpmHistory: [],
    });
  },

  typeChar: (char: string) => {
    const { status, typedText, paragraph, mistakes, streak, maxStreak, elapsedTime } = get();
    
    if (status === 'completed' || typedText.length >= paragraph.length) {
      return;
    }

    const isFirstChar = status === 'idle';
    const currentPos = typedText.length;
    const targetChar = paragraph[currentPos];
    const isCorrect = char === targetChar;

    const nextTypedText = typedText + char;
    const nextMistakes = isCorrect ? mistakes : mistakes + 1;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const nextMaxStreak = Math.max(maxStreak, nextStreak);
    const { correct, incorrect } = calculateStats(nextTypedText, paragraph);
    
    const minutes = Math.max(1, elapsedTime) / 60;
    const nextWpm = Math.round((correct / 5) / minutes);
    const nextCpm = Math.round(correct / minutes);
    const nextAccuracy = Math.round((correct / nextTypedText.length) * 100);

    const isCompleted = nextTypedText.length === paragraph.length;

    set({
      typedText: nextTypedText,
      status: isCompleted ? 'completed' : 'typing',
      startTime: isFirstChar ? Date.now() : get().startTime,
      mistakes: nextMistakes,
      streak: nextStreak,
      maxStreak: nextMaxStreak,
      correctChars: correct,
      incorrectChars: incorrect,
      wpm: nextWpm,
      cpm: nextCpm,
      accuracy: nextAccuracy,
    });
  },

  backspace: () => {
    const { status, typedText, paragraph, elapsedTime } = get();

    if (status === 'completed' || typedText.length === 0) {
      return;
    }

    const nextTypedText = typedText.slice(0, -1);
    const { correct, incorrect } = calculateStats(nextTypedText, paragraph);
    const nextStreak = calculateStreak(nextTypedText, paragraph);
    
    const minutes = Math.max(1, elapsedTime) / 60;
    const nextWpm = Math.round((correct / 5) / minutes);
    const nextCpm = Math.round(correct / minutes);
    const nextAccuracy = nextTypedText.length === 0 ? 100 : Math.round((correct / nextTypedText.length) * 100);

    set({
      typedText: nextTypedText,
      streak: nextStreak,
      correctChars: correct,
      incorrectChars: incorrect,
      wpm: nextWpm,
      cpm: nextCpm,
      accuracy: nextAccuracy,
    });
  },

  tickTimer: () => {
    const { status, elapsedTime, typedText, paragraph, wpmHistory } = get();

    if (status !== 'typing') {
      return;
    }

    const nextElapsedTime = elapsedTime + 1;
    const { correct } = calculateStats(typedText, paragraph);
    const minutes = Math.max(1, nextElapsedTime) / 60;
    const nextWpm = Math.round((correct / 5) / minutes);
    const nextCpm = Math.round(correct / minutes);
    const nextWpmHistory = [...wpmHistory, { time: nextElapsedTime, wpm: nextWpm }];

    set({
      elapsedTime: nextElapsedTime,
      wpm: nextWpm,
      cpm: nextCpm,
      wpmHistory: nextWpmHistory,
    });
  },

  resetTest: () => {
    const { paragraph } = get();
    get().initTest(paragraph);
  },
}));
