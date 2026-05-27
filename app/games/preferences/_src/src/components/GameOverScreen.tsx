import { GameModes, useGameContext } from '../context/GameContext';

export const GameOverScreen = () => {
  const { players, handleResetGame, gameMode, gameRoom, onlineUserId } = useGameContext();
  const isHost = gameMode !== GameModes.ONLINE || gameRoom?.players?.find(p => p.userId === onlineUserId)?.isHost;
  const winner = [...players].sort((a, b) => b.score - a.score)[0];
  const isTie = players.filter((p) => p.score === winner.score).length > 1;

  return (
    <div className='flex flex-col items-center p-4 lg:text-xl'>
      <h2 className='lg:text-3xl text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>Game Over!</h2>

      {isTie ? (
        <p className='text-2xl lg:mb-4 font-semibold'>It's a tie!</p>
      ) : (
        <p className='text-2xl mb-4 font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent bg-white rounded-xl shadow-md p-4'>
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
                className={`flex justify-between items-center p-3 rounded-lg ${index === 0 ? 'bg-amber-50 ring-2 ring-amber-400 font-semibold' : 'bg-gray-100'}`}
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
          className='mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-semibold transition-all shadow-sm active:scale-95'
        >
          End Game
        </button>
      )}
    </div>
  );
};
