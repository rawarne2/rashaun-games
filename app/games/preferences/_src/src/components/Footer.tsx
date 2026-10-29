import { useGameContext } from '../context/GameContext';

export const Footer = () => {
  const { currentRound, totalRounds, players, targetPlayerIndex } =
    useGameContext();
  if (!players.length) {
    return null;
  }

  return (
    <div className='fixed bottom-0 left-0 bg-card/95 backdrop-blur-sm shadow-[0_-2px_12px_rgba(0,0,0,0.4)] px-2 md:px-3 lg:px-4 py-1.5 md:py-2 leading-none font-medium lg:text-lg text-sm flex justify-between items-center w-full overflow-x-scroll no-scrollbar min-h-8 lg:h-10'>
      <p className='font-bold pr-2 text-foreground whitespace-nowrap'>
        Round: {currentRound}/{totalRounds}
      </p>
      <div className='flex space-x-3'>
        {players.map((player, index) => (
          <div
            key={index}
            className={`whitespace-nowrap px-1.5 py-0.5 rounded-md transition-colors ${
              index === targetPlayerIndex
                ? 'font-semibold bg-brand/20 text-brand-soft'
                : 'text-muted-foreground'
            }`}
          >
            {player.name}: {player.score || 0}
          </div>
        ))}
      </div>
    </div>
  );
};
