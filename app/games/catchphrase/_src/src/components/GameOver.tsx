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
    <div className='p-6 max-w-md mx-auto text-center'>
      <h2 className='text-3xl font-bold mb-8'>Game Over!</h2>

      <div className='mb-8 grid grid-cols-2 gap-8'>
        <div>
          <h3 className='text-xl font-bold mb-2'>Team 1</h3>
          <p className='text-3xl'>{gameState.team1Score}</p>
        </div>
        <div>
          <h3 className='text-xl font-bold mb-2'>Team 2</h3>
          <p className='text-3xl'>{gameState.team2Score}</p>
        </div>
      </div>

      {winner !== 'Tie' && (
        <h3 className='text-2xl font-bold mb-8 text-green-600'>
          Team {winner} Wins!
        </h3>
      )}

      <button
        onClick={endGame}
        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg'
      >
        Play Again
      </button>
    </div>
  );
}
