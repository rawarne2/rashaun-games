import { useEffect } from 'react';
import { GameModes, useGameContext } from '../context/GameContext';
import { Footer } from './Footer';
import { ResultCard } from './ResultCard';

export const ReviewScreen = () => {
  const {
    targetRankings,
    groupPredictions,
    roundScore,
    handleUpdateScore,
    isGameOver,
    players,
    targetPlayerIndex,
    gameMode,
    gameRoom,
    setTargetRankings,
    currentRound
  } = useGameContext();

  useEffect(() => {
    if (gameRoom?.game?.targetRankings && gameMode === GameModes.ONLINE) {
      setTargetRankings(gameRoom?.game?.targetRankings)
    }
  }, [gameRoom?.game?.targetRankings, setTargetRankings, gameMode]);

  const playerName = players[targetPlayerIndex].name;

  const diffsArray: number[] = [];
  groupPredictions.forEach((cardText, index) => {
    const predictionIndex = targetRankings.indexOf(cardText);
    diffsArray.push(Math.abs(predictionIndex - index));
  });


  return (
    <div className='flex flex-col lg:text-xl w-full items-center md:justify-center lg:px-0 box-border h-[80vh] md:h-[100dvh] md:pb-24'>
      <h1 className='lg:text-3xl text-xl md:text-2xl font-bold mb-2 lg:mt-4'>
        Scores for {players[targetPlayerIndex].name}'s Turn
      </h1>
      <div className='flex flex-col w-full'>
        <div className='flex lg:flex-col items-center justify-center mx-auto'>
          <div className='px-1 md:px-2'>
            <h2 className='font-semibold mb-1 lg:mb-2 text-lg lg:text-xl underline underline-offset-4 text-center'>
              {playerName}
            </h2>
            <div className='lg:grid lg:grid-cols-5 lg:gap-4 flex flex-col gap-1 md:gap-1.5 justify-evenly'>
              {targetRankings.map((card, index) => (
                <ResultCard
                  key={index}
                  text={card}
                  rank={index + 1}
                  showRank={true}
                  variant="default"
                  size="medium"
                />
              ))}
            </div>
          </div>

          <div className='lg:mt-4 p-1 md:p-2 lg:h-auto overflow-x-auto lg:overflow-y-auto no-scrollbar'>
            {gameMode === GameModes.SINGLE_DEVICE && (
              <h2 className='font-semibold mb-1 lg:mb-2 text-lg lg:text-xl underline underline-offset-4 text-center'>
                Group
              </h2>
            )}
            {gameMode === GameModes.SINGLE_DEVICE ? (
              <div className='lg:grid lg:grid-cols-5 lg:gap-4 flex flex-col gap-1 md:gap-1.5 justify-evenly'>
                {groupPredictions.map((card, index) => {
                  const score = 4 - diffsArray[index];
                  const variant = diffsArray[index] === 0
                    ? 'success'
                    : diffsArray[index] < 3
                      ? 'warning'
                      : 'error';

                  return (
                    <ResultCard
                      key={index}
                      text={card}
                      score={score}
                      showScore={true}
                      variant={variant}
                      size="medium"
                    />
                  );
                })}
              </div>
            ) : (
              <div className='flex lg:max-h-[60vh] pb-2 lg:pb-0 lg:flex-col'>
                {gameRoom?.players?.filter((_, index) => index !== targetPlayerIndex).map((player) => (
                  <div className='flex flex-col min-w-max justify-center items-center ml-1 lg:mx-0 bg-white rounded-xl shadow-md p-2 lg:mb-4' key={player.userId}>
                    <div className='flex flex-col sm:grid sm:grid-cols-2 justify-center items-center w-full border-b border-gray-200 pb-1 mb-1'>
                      <h3 className='font-semibold text-base lg:text-xl text-center'>
                        {player.name}
                      </h3>
                      <p className='font-medium text-base lg:text-xl text-center leading-none'>
                        Score: {player.roundScore || 0}/20
                      </p>
                    </div>
                    <div className='lg:grid lg:grid-cols-5 lg:gap-4 flex flex-col gap-1 md:gap-1.5 justify-evenly'>
                      {targetRankings.map((_, cardIndex) => {
                        const diff = Math.abs(targetRankings.indexOf(player.rankings?.[cardIndex] || '') - cardIndex);
                        const score = 4 - diff;
                        const variant = diff === 0
                          ? 'success'
                          : diff < 3
                            ? 'warning'
                            : 'error';

                        return (
                          <ResultCard
                            key={cardIndex}
                            text={player.rankings?.[cardIndex] || ''}
                            score={score}
                            showScore={true}
                            variant={variant}
                            size="medium"
                          />
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-row py-3 md:pb-4 justify-evenly bottom-8 lg:bottom-10 left-0 fixed w-full bg-white/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.08)]'>
          {gameMode === GameModes.SINGLE_DEVICE && (
            <p className='text-xl lg:text-2xl font-semibold flex items-center'>
              Score: {roundScore}/20
            </p>
          )}
          <button
            onClick={handleUpdateScore}
            className='px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm active:scale-95'
          >
            {isGameOver ? 'End Game' : currentRound < players.length ? 'Next Player' : 'Next Round'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

