import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

// Types
export type GameState =
  | 'setup'
  | 'targetRanking'
  | 'waitingForRankings'
  | 'groupPrediction'
  | 'review'
  | 'gameOver';

export type Category = 'general' | 'adult' | 'dating' | 'culture';

export interface Player {
  userId: string;
  name: string;
  score: number;
  rankings?: string[]; // online only. Rankings of target player's cards
  isHost?: boolean; //  online only. When a player is the host of a game room, this is set to true.
  isOnline?: boolean; //  online only. When a player joins or creates a game room, this is set to true
  isConnected?: boolean; //  online only. When a player disconnects, this is set to false
  roundScore?: number; // online only. Score for the current round
};

export type RoomData = { // will change
  code: string;
  players: Player[];
};

export enum GameModes {
  SINGLE_DEVICE = 'SINGLE_DEVICE',
  ONLINE = 'ONLINE',
}

export interface Game {
  currentRound: number;
  totalRounds: number;
  targetPlayerIndex: number;
  currentCards: string[];
  targetRankings: string[];
  groupPredictions: string[];
}

export interface GameRoom {
  code: string;
  players: Player[];
  host?: string;
  game: Game;
}

export type GameContextType = {
  currentCards: string[];
  setCurrentCards: React.Dispatch<React.SetStateAction<string[]>>;
  targetPlayerIndex: number;
  setTargetPlayerIndex: React.Dispatch<React.SetStateAction<number>>;
  targetRankings: string[];
  setTargetRankings: React.Dispatch<React.SetStateAction<string[]>>;
  groupPredictions: string[];
  setGroupPredictions: React.Dispatch<React.SetStateAction<string[]>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  gameMode: GameModes;
  setGameMode: React.Dispatch<React.SetStateAction<GameModes>>;
  setCategory: React.Dispatch<React.SetStateAction<Category>>;
  category: Category;
  gameState: GameState;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onlineUserId: string;
  setOnlineUserId: React.Dispatch<React.SetStateAction<string>>;
  totalRounds: number;
  setTotalRounds: React.Dispatch<React.SetStateAction<number>>;
  currentRound: number;
  setCurrentRound: React.Dispatch<React.SetStateAction<number>>;
  cardDeck: string[];
  setCardDeck: React.Dispatch<React.SetStateAction<string[]>>;
  handleResetGame: () => void;
  handleLeaveGame: () => void;
  handleUpdateScore: () => void;
  handleStartGame: () => void;
  roundScore: number;
  isGameOver: boolean;
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  roomCode: string;
  setRoomCode: (roomCode: string) => void;
  isConnecting: boolean;
  setIsConnecting: (isConnecting: boolean) => void;
  connectionError: string;
  setConnectionError: (error: string) => void;
  error: string;
  setError: (error: string) => void;
  mode: 'select' | 'create' | 'join' | 'ready';
  setMode: (mode: 'select' | 'create' | 'join' | 'ready') => void;
  gameRoom: GameRoom;
  setGameRoom: React.Dispatch<React.SetStateAction<GameRoom>>;
};

// Context
export const GameContext = createContext<GameContextType | null>(null);

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
