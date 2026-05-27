import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
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
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  // const [currentCategoryWords, setCurrentCategoryWords] = useState<Word[]>([]); // fix?
  const getRandomWord = useCallback((category: Category): Word => {
    const categoryWords = wordsByCategory[category];
    const randomIndex = Math.floor(Math.random() * categoryWords.length);
    const currentWord = categoryWords.splice(randomIndex, 1);
    if (currentWord.length === 0) {
      currentWord[0] = {
        id: 0,
        word: 'Ran out of words',
        category: 'Sports',
      };
    }
    // setCurrentCategoryWords(categoryWords);
    return currentWord[0];
  }, []);

  const startTimer = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);

    const interval = setInterval(() => {
      setGameState((prev) => {
        const newTime = prev.timeRemaining - 1;

        if (newTime <= 0) {
          clearInterval(interval);
          playEndBeep();
          return {
            ...prev,
            timeRemaining: 0,
            gamePhase: 'game_over',
          };
        }

        if (newTime <= WARNING_TIME) {
          playWarningBeep();
        }

        return {
          ...prev,
          timeRemaining: newTime,
        };
      });
    }, 1000);

    setTimerInterval(interval);
  }, []);

  const selectCategory = useCallback(
    (category: Category) => {
      setGameState((prev) => ({
        ...initialGameState,
        selectedCategory: category,
        currentWord: getRandomWord(category),
        currentTeam: prev.startingTeam,
        gamePhase: 'playing',
      }));
      startTimer();
    },
    [getRandomWord, startTimer]
  );

  const wordGuessed = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      [prev.currentTeam === 1 ? 'team1Score' : 'team2Score']:
        prev.currentTeam === 1 ? prev.team1Score + 1 : prev.team2Score + 1,
      currentTeam: prev.currentTeam === 1 ? 2 : 1,
      currentWord: prev.selectedCategory
        ? getRandomWord(prev.selectedCategory)
        : null,
      isWordVisible: true,
    }));
  }, [getRandomWord]);

  const passWord = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      [prev.currentTeam === 1 ? 'team2Score' : 'team1Score']:
        prev.currentTeam === 1 ? prev.team2Score + 0.5 : prev.team1Score + 0.5,
      currentWord: prev.selectedCategory
        ? getRandomWord(prev.selectedCategory)
        : null,
      isWordVisible: true,
    }));
  }, [getRandomWord]);

  const reportViolation = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      [prev.currentTeam === 1 ? 'team2Score' : 'team1Score']:
        prev.currentTeam === 1 ? prev.team2Score + 1 : prev.team1Score + 1,
      currentTeam: prev.currentTeam === 1 ? 2 : 1,
      currentWord: prev.selectedCategory
        ? getRandomWord(prev.selectedCategory)
        : null,
      isWordVisible: true,
    }));
  }, [getRandomWord]);

  const readyForNextTurn = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: 'playing',
      isWordVisible: true,
    }));
  }, []);

  const endGame = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);
    setGameState((prev) => ({
      ...initialGameState,
      startingTeam: prev.startingTeam === 1 ? 2 : 1,
    }));
  }, [timerInterval]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const value: GameContextType = {
    gameState,
    selectCategory,
    startGame: readyForNextTurn,
    wordGuessed,
    passWord,
    reportViolation,
    readyForNextTurn,
    endGame,
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
