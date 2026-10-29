import { useGame } from '../context/GameContext';

export function GameOver() {
  const { gameState, endGame } = useGame();

  const winner =
    gameState.team1Score > gameState.team2Score
      ? 1
      : gameState.team2Score > gameState.team1Score
      ? 2
      : 'Tie';

  return (
    <div className='rounded-2xl border border-border bg-card p-6 text-center shadow-lg shadow-black/20 sm:p-8'>
      <h2 className='mb-2 text-3xl font-extrabold'>Game Over!</h2>
      <p className={`mb-8 text-2xl font-bold ${winner === 'Tie' ? 'text-muted-foreground' : 'text-orange'}`}>
        {winner === 'Tie' ? "It's a tie!" : `Team ${winner} wins!`}
      </p>

      <button
        onClick={endGame}
        className='w-full rounded-xl bg-orange px-8 py-4 text-lg font-bold text-orange-foreground transition-colors hover:bg-orange-hover active:scale-[0.98] sm:w-auto'
      >
        Play Again
      </button>
    </div>
  );
}
