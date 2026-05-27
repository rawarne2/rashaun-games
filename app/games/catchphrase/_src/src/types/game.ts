export interface Word {
    id: number;
    word: string;
    category: Category;
}

export type Category = 'Sports' | 'Movies & TV' | 'Places' | 'Fun and Games' | 'People';

export interface GameState {
    selectedCategory: Category | null;
    currentWord: Word | null;
    gamePhase: 'category_selection' | 'countdown' | 'playing' | 'game_over';
    currentTeam: 1 | 2;
    timeRemaining: number;
    team1Score: number;
    team2Score: number;
    startingTeam: 1 | 2;
    isWordVisible: boolean;
}

export interface GameContextType {
    gameState: GameState;
    selectCategory: (category: Category) => void;
    startGame: () => void;
    wordGuessed: () => void;
    passWord: () => void;
    reportViolation: () => void;
    readyForNextTurn: () => void;
    endGame: () => void;
    quitGame: () => void;
    startPlaying: () => void;
}