import { useGame } from '../context/GameContext';

export function Timer() {
  const { gameState } = useGame();

  return (
    <div
      className={`text-5xl font-extrabold tabular-nums sm:text-6xl
      ${gameState.timeRemaining <= 10 ? 'text-danger-soft' : 'text-foreground'}`}
    >
      {gameState.timeRemaining}s
    </div>
  );
}
