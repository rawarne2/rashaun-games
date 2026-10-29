import { GameModes, useGameContext } from '../context/GameContext';

export const GameOverScreen = () => {
  const { players, handleResetGame, gameMode, gameRoom, onlineUserId } = useGameContext();
  const isHost = gameMode !== GameModes.ONLINE || gameRoom?.players?.find(p => p.userId === onlineUserId)?.isHost;
  const winner = [...players].sort((a, b) => b.score - a.score)[0];
  const isTie = players.filter((p) => p.score === winner.score).length > 1;

  return (
    <div className='flex flex-col items-center p-4 lg:text-xl'>
      <h2 className='lg:text-3xl text-2xl font-bold mb-6 text-foreground'>Game Over!</h2>

      {isTie ? (
        <p className='text-2xl lg:mb-4 font-semibold'>It's a tie!</p>
      ) : (
        <p className='text-2xl mb-4 font-semibold text-orange bg-card ring-1 ring-border rounded-xl shadow-md shadow-black/30 p-4'>
          Winner: {winner.name}!
        </p>
      )}

      <div className='w-full max-w-md'>
        <h3 className='text-xl font-semibold mb-2'>Final Scores:</h3>
        <ul className='space-y-2'>
          {[...players]
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg ${index === 0 ? 'bg-orange/10 ring-2 ring-orange font-semibold' : 'bg-card border border-border'}`}
              >
                <span>{player.name}</span>
                <span className='pl-4'>{player.score} points</span>
              </li>
            ))}
        </ul>
      </div>

      {isHost && (
        <button
          onClick={handleResetGame}
          className='mt-6 px-6 py-2.5 bg-brand text-white rounded-lg hover:bg-brand-hover font-semibold transition-all shadow-sm active:scale-95'
        >
          End Game
        </button>
      )}
    </div>
  );
};
