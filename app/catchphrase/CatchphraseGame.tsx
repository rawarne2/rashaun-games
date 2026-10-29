"use client";

import {
  GameProvider,
  useGame,
} from "@/app/games/catchphrase/_src/src/context/GameContext";
import { CategorySelection } from "@/app/games/catchphrase/_src/src/components/CategorySelection";
import { StartCountdown } from "@/app/games/catchphrase/_src/src/components/StartCountdown";
import { GameScreen } from "@/app/games/catchphrase/_src/src/components/GameScreen";
import { GameOver } from "@/app/games/catchphrase/_src/src/components/GameOver";

const teamStyles = {
  1: { active: "border-brand bg-brand/15 text-brand-soft", label: "Team 1" },
  2: { active: "border-orange bg-orange/10 text-orange", label: "Team 2" },
} as const;

function GameContent() {
  const { gameState } = useGame();

  const teamCard = (team: 1 | 2, score: number) => {
    const isActive = gameState.currentTeam === team;
    return (
      <div
        className={`flex flex-1 flex-col items-center rounded-xl border-2 px-3 py-2 transition-colors sm:py-3 ${
          isActive ? teamStyles[team].active : "border-border bg-card text-muted-foreground"
        }`}
      >
        <span className="text-xs font-semibold uppercase tracking-wider sm:text-sm">
          {teamStyles[team].label}
        </span>
        <span className={`text-3xl font-extrabold sm:text-4xl ${isActive ? "" : "text-foreground"}`}>
          {score}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100dvh-3rem)]">
      <div className="mx-auto w-full max-w-xl px-4 pt-6 sm:pt-10">
        <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl">
          Catchphrase
        </h1>
        {gameState.gamePhase !== "category_selection" && (
          <div className="mt-4 flex gap-3">
            {teamCard(1, gameState.team1Score)}
            {teamCard(2, gameState.team2Score)}
          </div>
        )}
      </div>

      <main className="mx-auto w-full max-w-xl px-4 py-6 sm:py-8">
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
