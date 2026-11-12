import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { GameState, GameContextType, Category, Word } from '../types/game';
import { wordsByCategory } from '../data/words';
import { playWarningBeep, playEndBeep } from '../utils/sound';

const ROUND_TIME = 60; // make 60
const WARNING_TIME = 10;

const initialGameState: GameState = {
  selectedCategory: null,
  currentWord: null,
  gamePhase: 'category_selection',
  currentTeam: 1,
  timeRemaining: ROUND_TIME,
  team1Score: 0,
  team2Score: 0,
  startingTeam: 1,
  isWordVisible: true,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRemainingRef = useRef(ROUND_TIME);
  // Fresh copy per game. The shared word lists must stay intact for the next round.
  const deckRef = useRef<Word[]>([]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const drawWord = useCallback((category: Category): Word => {
    const deck = deckRef.current;
    if (deck.length === 0) {
      return { id: 0, word: 'Ran out of words', category };
    }
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck.splice(randomIndex, 1)[0];
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timeRemainingRef.current = ROUND_TIME;

    timerRef.current = setInterval(() => {
      const newTime = timeRemainingRef.current - 1;

      if (newTime <= 0) {
        timeRemainingRef.current = 0;
        clearTimer();
        playEndBeep();
        setGameState((prev) => ({
          ...prev,
          timeRemaining: 0,
          gamePhase: 'game_over',
        }));
        return;
      }

      timeRemainingRef.current = newTime;
      if (newTime <= WARNING_TIME) playWarningBeep();
      setGameState((prev) => ({
        ...prev,
        timeRemaining: newTime,
      }));
    }, 1000);
  }, [clearTimer]);

  const selectCategory = useCallback(
    (category: Category) => {
      deckRef.current = wordsByCategory[category].map((word) => ({ ...word }));
      const currentWord = drawWord(category);
      setGameState((prev) => ({
        ...initialGameState,
        selectedCategory: category,
        currentWord,
        currentTeam: prev.startingTeam,
        gamePhase: 'countdown',
        isWordVisible: false,
      }));
    },
    [drawWord]
  );

  const startPlaying = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: 'playing',
      isWordVisible: true,
    }));
    startTimer();
  }, [startTimer]);

  const quitGame = useCallback(() => {
    clearTimer();
    setGameState((prev) => ({
      ...initialGameState,
      startingTeam: prev.startingTeam,
    }));
  }, [clearTimer]);

  const nextWord = useCallback(
    (category: Category | null) => (category ? drawWord(category) : null),
    [drawWord]
  );

  const wordGuessed = useCallback(() => {
    const currentWord = nextWord(gameState.selectedCategory);
    setGameState((prev) => ({
      ...prev,
      [prev.currentTeam === 1 ? 'team1Score' : 'team2Score']:
        prev.currentTeam === 1 ? prev.team1Score + 1 : prev.team2Score + 1,
      currentTeam: prev.currentTeam === 1 ? 2 : 1,
      currentWord,
      isWordVisible: true,
    }));
  }, [gameState.selectedCategory, nextWord]);

  const passWord = useCallback(() => {
    const currentWord = nextWord(gameState.selectedCategory);
    setGameState((prev) => {
      const scoreKey = prev.currentTeam === 1 ? 'team2Score' : 'team1Score';
      const opposingScore = prev.currentTeam === 1 ? prev.team2Score : prev.team1Score;
      return {
        ...prev,
        [scoreKey]: opposingScore + 0.5,
        currentWord,
        isWordVisible: true,
      };
    });
  }, [gameState.selectedCategory, nextWord]);

  const reportViolation = useCallback(() => {
    const currentWord = nextWord(gameState.selectedCategory);
    setGameState((prev) => ({
      ...prev,
      [prev.currentTeam === 1 ? 'team2Score' : 'team1Score']:
        prev.currentTeam === 1 ? prev.team2Score + 1 : prev.team1Score + 1,
      currentTeam: prev.currentTeam === 1 ? 2 : 1,
      currentWord,
      isWordVisible: true,
    }));
  }, [gameState.selectedCategory, nextWord]);

  const readyForNextTurn = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: 'playing',
      isWordVisible: true,
    }));
  }, []);

  const endGame = useCallback(() => {
    clearTimer();
    setGameState((prev) => ({
      ...initialGameState,
      startingTeam: prev.startingTeam === 1 ? 2 : 1,
    }));
  }, [clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  const value: GameContextType = {
    gameState,
    selectCategory,
    startGame: readyForNextTurn,
    wordGuessed,
    passWord,
    reportViolation,
    readyForNextTurn,
    endGame,
    quitGame,
    startPlaying,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
