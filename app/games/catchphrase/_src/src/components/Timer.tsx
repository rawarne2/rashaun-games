import { useGame } from '../context/GameContext';

export function Timer() {
  const { gameState } = useGame();

  return (
    <div
      className={`text-4xl font-bold mb-4 
      ${gameState.timeRemaining <= 10 ? 'text-red-500' : 'text-gray-800'}`}
    >
      {gameState.timeRemaining}s
    </div>
  );
}
