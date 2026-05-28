"use client";

import {
  GameProvider,
  useGame,
} from "@/app/games/catchphrase/_src/src/context/GameContext";
import { CategorySelection } from "@/app/games/catchphrase/_src/src/components/CategorySelection";
import { StartCountdown } from "@/app/games/catchphrase/_src/src/components/StartCountdown";
import { GameScreen } from "@/app/games/catchphrase/_src/src/components/GameScreen";
import { GameOver } from "@/app/games/catchphrase/_src/src/components/GameOver";

function GameContent() {
  const { gameState } = useGame();

  const getTeamColor = (activeTeam: 1 | 2, teamBoard: 1 | 2) => {
    if (activeTeam === teamBoard) {
      return teamBoard === 1
        ? "text-blue-500 underline font-bold"
        : "text-red-500 underline font-bold";
    } else {
      return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-4 px-6">
          <h1 className="text-5xl font-bold text-gray-800 text-center">
            Catchphrase
          </h1>
          {gameState.gamePhase !== "category_selection" && (
            <div className="flex justify-between mt-2 text-4xl">
              <span className={`${getTeamColor(gameState.currentTeam, 1)}`}>
                Team 1: {gameState.team1Score}
              </span>
              <span className={`${getTeamColor(gameState.currentTeam, 2)}`}>
                Team 2: {gameState.team2Score}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-6">
        {gameState.gamePhase === "category_selection" && <CategorySelection />}
        {gameState.gamePhase === "countdown" && <StartCountdown />}
        {gameState.gamePhase === "playing" && <GameScreen />}
        {gameState.gamePhase === "game_over" && <GameOver />}
      </main>
    </div>
  );
}

export function CatchphraseGame() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
