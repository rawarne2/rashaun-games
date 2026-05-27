import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

const COUNTDOWN_SECONDS = 5;

export function StartCountdown() {
  const { gameState, startPlaying, quitGame } = useGame();
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    setSecondsLeft(COUNTDOWN_SECONDS);
  }, [gameState.selectedCategory]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    if (secondsLeft === 1) {
      const timeout = setTimeout(() => startPlaying(), 1000);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timeout);
  }, [secondsLeft, startPlaying]);

  return (
    <div className='p-6 max-w-md mx-auto text-center'>
      <h2 className='text-2xl font-bold text-gray-800 mb-2'>Get Ready!</h2>
      <p className='text-gray-600 mb-2'>Category: {gameState.selectedCategory}</p>
      <p className='text-gray-500 mb-8 text-4xl'>
        Team {gameState.currentTeam}'s Turn
      </p>

      <div className='text-8xl font-bold text-blue-500 mb-8'>{secondsLeft}</div>

      <p className='text-gray-500 mb-8'>Game starts in {secondsLeft}...</p>

      <button
        onClick={quitGame}
        className='bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg w-full'
      >
        Quit
      </button>
    </div>
  );
}
