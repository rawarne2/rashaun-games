import { useGame } from '../context/GameContext';
import { Timer } from './Timer';

export function GameScreen() {
  const { gameState, wordGuessed, passWord, reportViolation, quitGame } =
    useGame();

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-3'>
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

      <div className='text-center'>
        <Timer />
        <p className='mt-1 text-lg font-semibold text-muted-foreground'>
          Team {gameState.currentTeam}&apos;s turn
        </p>
      </div>

      {gameState.isWordVisible && (
        <div className='flex min-h-36 items-center justify-center rounded-2xl border-2 border-orange/60 bg-card px-6 py-8 text-center shadow-lg shadow-black/30'>
          <h2 className='break-words text-4xl font-extrabold text-foreground sm:text-5xl'>
            {gameState.currentWord?.word}
          </h2>
        </div>
      )}

      <div className='grid grid-cols-2 gap-3'>
        <button
          onClick={wordGuessed}
          className='col-span-2 rounded-xl bg-success px-6 py-5 text-xl font-bold text-white transition-colors hover:bg-success-hover active:scale-[0.98]'
        >
          Correct!
        </button>
        <button
          onClick={passWord}
          className='rounded-xl border border-line-strong bg-raised px-4 py-4 font-bold text-foreground transition-colors hover:bg-raised-hover active:scale-[0.98]'
        >
          Skip <span className='font-medium text-muted-foreground'>(-0.5)</span>
        </button>
        <button
          onClick={reportViolation}
          className='rounded-xl bg-danger px-4 py-4 font-bold text-white transition-colors hover:bg-danger-hover active:scale-[0.98]'
        >
          Said Word/Rhyme
        </button>
      </div>
    </div>
  );
}
