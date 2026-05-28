import React, { useState } from 'react';
import { Category, GameModes, useGameContext } from '../context/GameContext';
import { OnlinePlayerList } from './OnlinePlayerList';
import { v4 as uuidv4 } from 'uuid';

export const SetupScreen = () => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showGameModeInfo, setShowGameModeInfo] = useState(false);
  const {
    setTotalRounds,
    totalRounds,
    players,
    setPlayers,
    handleStartGame,
    setCategory,
    category,
    gameMode,
    setGameMode,
    mode,
    gameRoom,
    onlineUserId
    // setOnlineUserId,
  } = useGameContext();
  const handleNewPlayerNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPlayerName(e.target.value);
  };

  const newId = uuidv4();

  const handleAddPlayer = () => {
    if (newPlayerName.trim() !== '') {
      setPlayers([...players, { name: newPlayerName, score: 0, userId: newId }]);
      setNewPlayerName('');
    }
  };

  const handleRoundsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTotalRounds(parseInt(e.target.value));
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleSetGameMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    setGameMode(e.currentTarget.value as GameModes);
  };

  const isHost = gameRoom?.players?.find(player => player.userId === onlineUserId)?.isHost;

  return (
    <div className='flex flex-col w-full md:w-3/4 max-w-screen-sm pt-4 items-center justify-center overflow-y-scroll no-scrollbar'>
      <h1 className='mb-4 text-5xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent'>
        Preferences
      </h1>

      {/* Game Mode */}
      <div className='text-lg w-[96%] p-4 md:p-8 lg:p-8 m-auto rounded-xl bg-gray-100 overflow-y-auto no-scrollbar'>
        <div className="bg-white rounded-xl shadow-md p-4 w-full">
          <div role='tablist' className='inline-block'>
            <div className='flex items-center mb-2'>
              <button
                onClick={() => setShowGameModeInfo(!showGameModeInfo)}
                className='mr-1 w-5 h-5 bg-blue-600 text-white rounded-full text-xs hover:bg-blue-700 flex items-center justify-center font-bold transition-colors'
                title='Game Mode Information'
              >
                ?
              </button>
              <label className='mr-1 lg:mr-2 font-medium'>Game Mode: </label>
              <button
                title='Single Device'
                value={GameModes.SINGLE_DEVICE}
                role='tab'
                onClick={handleSetGameMode}
                className={`py-2 px-3 md:px-8 text-white rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 ${gameMode === GameModes.SINGLE_DEVICE
                  ? 'bg-blue-600 shadow-md scale-105 font-semibold'
                  : 'bg-gray-400 hover:bg-gray-500'
                  }`}
              >
                1 Device
              </button>
              <button
                title='Online'
                value={GameModes.ONLINE}
                role='tab'
                onClick={handleSetGameMode}
                className={`py-2 px-3 md:px-8 text-white rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 ${gameMode === GameModes.ONLINE
                  ? 'bg-blue-600 shadow-md scale-105 font-semibold'
                  : 'bg-gray-400 hover:bg-gray-500'
                  }`}
              >
                Online
              </button>
            </div>
            {showGameModeInfo && (
              <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm'>
                <div className='space-y-2'>
                  <div>
                    <div>
                      <span className='font-semibold text-blue-700'>General Rules:</span> Players take turn ranking which cards they prefer from most (1) to least (5). Other players guess the order that the target player ranked the cards. Players score points depending on how close their guess is to the target player's rankings. Only non-target players can score points for that turn.
                    </div>
                    <span className='font-semibold text-blue-700'>1 Device:</span> Play on a single device with players in person. The players that are not the target player, must agree as a group how the target player ranked the cards.
                  </div>
                  <div>
                    <span className='font-semibold text-blue-700'>Online:</span> Create or join a game room to play with friends on different devices. Non-target players must each guess the target player's rankings. The host can set the number of rounds, category, and start the game.
                  </div>
                </div>
              </div>
            )}
          </div>
          {(gameMode === GameModes.SINGLE_DEVICE || ((mode === 'create' || mode === 'ready'))) && (
            <div className='pt-2 flex justify-evenly'>
              {/* Category */}
              <span>
                <label htmlFor='category' className='font-medium mr-1 lg:mr-2'>Category:</label>
                <select
                  name='category'
                  value={category ?? ''}
                  onChange={(e) => handleCategoryChange(e.target.value as Category)}
                  className='bg-blue-600 text-white rounded-lg hover:bg-blue-700 p-2 cursor-pointer transition-colors'
                >
                  <option value='general'>General</option>
                  <option value='adult'>Adult</option>
                  <option value='culture'>Culture</option>
                  <option value='dating'>Dating</option>
                </select>
              </span>

              {/* Number of Rounds */}
              <span>
                <label htmlFor='rounds' className='mr-1 lg:mr-2 font-medium'>Rounds:</label>
                <select
                  value={totalRounds}
                  name='rounds'
                  onChange={handleRoundsChange}
                  className='bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 p-2 cursor-pointer transition-colors'
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </span>
            </div>
          )}
        </div>

        {gameMode === GameModes.SINGLE_DEVICE ? (
          <div className='flex flex-col items-center bg-white rounded-xl shadow-md lg:p-8 p-4 my-4 w-full'>
            <form onSubmit={(e) => { e.preventDefault(); handleAddPlayer(); }} className='flex justify-center items-center space-x-2 lg:mb-4 mb-2 w-full'>
              <input
                type='text'
                value={newPlayerName}
                onChange={handleNewPlayerNameChange}
                placeholder='Add a player'
                className='p-2.5 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                name='newPlayerName'
                id='newPlayerName'
                maxLength={20}
              />
              <button
                type='submit'
                className='px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all active:scale-95'
              >
                Add
              </button>
            </form>
            {players?.length > 0 && (
              <ul className='space-y-2 lg:mb-4 mb-2 w-full'>
                {players.map((player, index) => (
                  <li key={player.userId} className='p-2.5 rounded-lg flex-1 flex justify-center items-center bg-gray-100'>
                    <div className='flex flex-1 justify-center font-medium'>
                      {player.name}
                    </div>
                    <button
                      onClick={() => handleRemovePlayer(index)}
                      className='bg-red-500 hover:bg-red-600 rounded-lg px-3 text-white text-center h-8 transition-colors'
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <OnlinePlayerList />
        )}
        {(gameMode === GameModes.SINGLE_DEVICE || ((mode === 'create' || mode === 'ready') && isHost)) && (
          <div className='flex justify-center'>
            <button
              onClick={handleStartGame}
              disabled={players?.length < 2}
              className='mb-4 w-44 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 font-semibold transition-all disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-sm active:scale-95'
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
