import { useGame } from '../context/GameContext';
import { Timer } from './Timer';

export function GameScreen() {
  const { gameState, wordGuessed, passWord, reportViolation, quitGame } =
    useGame();

  return (
    <div className='relative p-6 max-w-md mx-auto'>
      <button
        onClick={quitGame}
        className='absolute top-2 right-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold py-1 px-3 rounded-md'
      >
        Quit
      </button>

      <div className='text-center mb-8'>
        <h3 className='text-2xl text-gray-600 mb-2'>
          Category: {gameState.selectedCategory}
        </h3>
        <Timer />
        <div className='text-gray-500 mb-4 text-4xl'>
          Team {gameState.currentTeam}'s Turn
        </div>
      </div>

      {gameState.isWordVisible && (
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8 text-center'>
          <h2 className='text-4xl font-bold text-gray-800'>
            {gameState.currentWord?.word}
          </h2>
        </div>
      )}

      <div className='grid gap-4'>
        <button
          onClick={wordGuessed}
          className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg'
        >
          Correct!
        </button>
        <button
          onClick={passWord}
          className='bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg'
        >
          Skip (-0.5)
        </button>
        <button
          onClick={reportViolation}
          className='bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg'
        >
          Said Word/Rhyme!
        </button>
      </div>
    </div>
  );
}
