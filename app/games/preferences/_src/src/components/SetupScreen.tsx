import React, { useState } from 'react';
import { Category, GameModes, useGameContext } from '../context/GameContext';
import { OnlinePlayerList } from './OnlinePlayerList';
import { v4 as uuidv4 } from 'uuid';
import { btnPrimary, btnRemove, btnSuccess, fieldLabel, input, listItem, panel, panelTitle, segment, segmented, select } from './ui';

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

  const chevron = (
    <svg aria-hidden viewBox='0 0 20 20' fill='currentColor' className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'>
      <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clipRule='evenodd' />
    </svg>
  );

  const showSettings = gameMode === GameModes.SINGLE_DEVICE || mode === 'create' || mode === 'ready';
  const showStart = gameMode === GameModes.SINGLE_DEVICE || ((mode === 'create' || mode === 'ready') && isHost);

  return (
    <div className='flex w-full max-w-screen-sm flex-col items-center gap-4 overflow-y-scroll no-scrollbar px-4 pt-6 pb-10 md:pt-10'>
      <h1 className='mb-2 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground'>
        Preferences
      </h1>

      {/* Game Mode + settings */}
      <section className={`${panel} space-y-4`}>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <span className={panelTitle}>Game mode</span>
            <button
              onClick={() => setShowGameModeInfo(!showGameModeInfo)}
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${showGameModeInfo ? 'bg-brand text-white' : 'bg-brand/20 text-brand-soft hover:bg-brand/30'}`}
              title='Game Mode Information'
              aria-expanded={showGameModeInfo}
            >
              ?
            </button>
          </div>
          <div role='tablist' className={segmented}>
            <button
              title='Single Device'
              value={GameModes.SINGLE_DEVICE}
              role='tab'
              aria-selected={gameMode === GameModes.SINGLE_DEVICE}
              onClick={handleSetGameMode}
              className={segment(gameMode === GameModes.SINGLE_DEVICE)}
            >
              1 Device
            </button>
            <button
              title='Online'
              value={GameModes.ONLINE}
              role='tab'
              aria-selected={gameMode === GameModes.ONLINE}
              onClick={handleSetGameMode}
              className={segment(gameMode === GameModes.ONLINE)}
            >
              Online
            </button>
          </div>
        </div>

        {showGameModeInfo && (
          <div className='space-y-2 rounded-lg border border-brand/40 bg-brand/10 p-3 text-sm leading-relaxed'>
            <p>
              <span className='font-semibold text-brand-soft'>General Rules:</span> Players take turn ranking which cards they prefer from most (1) to least (5). Other players guess the order that the target player ranked the cards. Players score points depending on how close their guess is to the target player's rankings. Only non-target players can score points for that turn.
            </p>
            <p>
              <span className='font-semibold text-brand-soft'>1 Device:</span> Play on a single device with players in person. The players that are not the target player, must agree as a group how the target player ranked the cards.
            </p>
            <p>
              <span className='font-semibold text-brand-soft'>Online:</span> Create or join a game room to play with friends on different devices. Non-target players must each guess the target player's rankings. The host can set the number of rounds, category, and start the game.
            </p>
          </div>
        )}

        {showSettings && (
          <div className='grid grid-cols-2 gap-3 border-t border-border pt-4 md:gap-4'>
            <div>
              <label htmlFor='category' className={fieldLabel}>Category</label>
              <div className='relative'>
                <select
                  id='category'
                  name='category'
                  value={category ?? ''}
                  onChange={(e) => handleCategoryChange(e.target.value as Category)}
                  className={select}
                >
                  <option value='general'>General</option>
                  <option value='adult'>Adult</option>
                  <option value='culture'>Culture</option>
                  <option value='dating'>Dating</option>
                </select>
                {chevron}
              </div>
            </div>

            <div>
              <label htmlFor='rounds' className={fieldLabel}>Rounds</label>
              <div className='relative'>
                <select
                  id='rounds'
                  value={totalRounds}
                  name='rounds'
                  onChange={handleRoundsChange}
                  className={select}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                {chevron}
              </div>
            </div>
          </div>
        )}
      </section>

      {gameMode === GameModes.SINGLE_DEVICE ? (
        <section className={`${panel} space-y-4`}>
          <div className='flex items-baseline justify-between'>
            <h2 className={panelTitle}>Players</h2>
            <span className='text-sm text-muted-foreground'>{players.length < 2 ? 'Add at least 2' : `${players.length} playing`}</span>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleAddPlayer(); }} className='flex items-center gap-2'>
            <input
              type='text'
              value={newPlayerName}
              onChange={handleNewPlayerNameChange}
              placeholder='Player name'
              className={input}
              name='newPlayerName'
              id='newPlayerName'
              maxLength={20}
            />
            <button type='submit' disabled={!newPlayerName.trim()} className={`${btnPrimary} shrink-0 px-5`}>
              Add
            </button>
          </form>
          {players?.length > 0 && (
            <ul className='space-y-2'>
              {players.map((player, index) => (
                <li key={player.userId} className={listItem}>
                  <span className='flex-1 truncate'>{player.name}</span>
                  <button
                    onClick={() => handleRemovePlayer(index)}
                    className={btnRemove}
                    aria-label={`Remove ${player.name}`}
                    title='Remove player'
                  >
                    <svg aria-hidden viewBox='0 0 20 20' fill='currentColor' className='h-4 w-4'>
                      <path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <OnlinePlayerList />
      )}

      {showStart && (
        <button
          onClick={handleStartGame}
          disabled={players?.length < 2}
          className={`${btnSuccess} mt-2 w-full py-3 text-lg sm:w-60`}
        >
          Start Game
        </button>
      )}
    </div>
  );
};
