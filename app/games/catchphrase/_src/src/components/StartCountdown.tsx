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
    <div className='rounded-2xl border border-border bg-card p-6 text-center shadow-lg shadow-black/20 sm:p-8'>
      <div className='mb-6 flex items-center justify-between gap-3'>
        <span className='rounded-full bg-raised px-3 py-1 text-sm font-semibold text-muted-foreground'>
          {gameState.selectedCategory}
        </span>
        <button
          onClick={quitGame}
          className='rounded-md border border-line-strong bg-raised px-3 py-1 text-sm font-semibold text-foreground transition-colors hover:bg-raised-hover'
        >
          Quit
        </button>
      </div>

      <h2 className='text-2xl font-bold'>Get Ready!</h2>
      <p className='mt-1 text-lg text-muted-foreground'>
        Team {gameState.currentTeam}&apos;s turn
      </p>

      <div className='my-6 text-8xl font-extrabold tabular-nums text-orange sm:text-9xl'>{secondsLeft}</div>
    </div>
  );
}
