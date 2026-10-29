import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useGameContext } from '../context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { btnBack, btnDanger, btnPrimary, btnRemove, btnSecondary, input, listItem, panel, panelTitle } from './ui';


export const OnlinePlayerList: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isNameSubmitted, setIsNameSubmitted] = useState<boolean>(false);
  const hasAttemptedToJoin = Boolean(inputCode.trim() || name.trim());

  const { players, setPlayers, socket, roomCode, setRoomCode, isConnecting, connectionError, error, setError, mode, setMode, onlineUserId, setOnlineUserId, gameRoom } = useGameContext(); // currentOnlineuserId.

  const sessionUserId = useMemo(() => uuidv4(), []);

  // Handle room creation
  const handleCreateRoom = useCallback(() => {
    setError('');
    if (socket && socket.connected) {
      socket.emit('create-room');
    }
  }, [socket, setError]);

  // Handle room joining
  const handleJoinRoom = useCallback(() => {
    if (mode === 'select') {
      setMode('join');
      return;
    }

    if (socket && socket.connected && inputCode.length === 10 && name.trim()) {
      setError('');
      socket.emit('join-room', { roomCode: inputCode, userId: sessionUserId, name: name.trim() });
      setRoomCode(inputCode);
      setIsNameSubmitted(true);
      setOnlineUserId(sessionUserId);
    } else if (!name.trim()) {
      setError('Please enter your name');
    } else if (inputCode.length !== 10) {
      setError('Invalid room code');
    } else {
      setError('Please enter your name and room code');
    }
  }, [mode, socket, inputCode, name, setMode, sessionUserId, setRoomCode, setOnlineUserId, setError]);

  const handleNameSubmit = useCallback(
    () => {
      if (
        socket &&
        socket.connected &&
        name.trim() &&
        name.length <= 20
      ) {
        setError('');
        socket.emit('join-room', {
          roomCode,
          name: name.trim(),
          userId: sessionUserId,
        });

        setIsNameSubmitted(true);
        setOnlineUserId(sessionUserId);
      } else if (!name.trim()) {
        setError('Please enter your name');
      }
    },
    [socket, roomCode, name, setError, setOnlineUserId, sessionUserId]
  );

  // Handle leaving room
  const handleBack = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit('leave-room', { roomCode, userId: onlineUserId });
    }
    setMode('select');
    setRoomCode('');
    setInputCode('');
    setName('');
    setIsNameSubmitted(false);
    setPlayers([]);
    setError('');
  }, [socket, roomCode, setPlayers, setError, setMode, setRoomCode, onlineUserId]);

  // Clear join inputs whenever we're on the select screen (e.g. after being removed by host)
  useEffect(() => {
    if (mode === 'select') {
      setInputCode('');
      setName('');
      setIsNameSubmitted(false);
    }
  }, [mode]);

  useEffect(() => {
    setError('');
  }, [mode, setError]);

  const isHost = gameRoom?.players?.find((player) => player.userId === onlineUserId)?.isHost;

  // Host-only: remove a player from the room
  const handleRemovePlayer = useCallback(
    (userId: string) => {
      if (!isHost) return;
      if (socket && socket.connected && roomCode) {
        socket.emit('leave-room', { roomCode, userId });
      }
    },
    [isHost, socket, roomCode]
  );

  const backButton = (
    <button onClick={handleBack} className={btnBack}>
      <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor' aria-hidden>
        <path
          fillRule='evenodd'
          d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
          clipRule='evenodd'
        />
      </svg>
      Back
    </button>
  );

  return (
    <section className={`${panel} space-y-4`}>
      <h2 className={panelTitle}>Game Room</h2>

      {isConnecting && (
        <p className='text-center text-brand-soft'>Connecting to server...</p>
      )}

      {!isConnecting && mode === 'select' && (
        <div className='grid gap-3 sm:grid-cols-2'>
          <button onClick={handleCreateRoom} className={`${btnPrimary} w-full py-3`}>
            Create New Room
          </button>
          <button onClick={handleJoinRoom} className={`${btnSecondary} w-full py-3`}>
            Join Room
          </button>
          {connectionError && <p className='text-sm text-danger-soft sm:col-span-2'>{connectionError}</p>}
        </div>
      )}

      {!isConnecting && mode === 'join' && (
        <div className='space-y-4'>
          {backButton}
          <form onSubmit={(e) => { e.preventDefault(); handleJoinRoom(); }} className='space-y-3'>
            <input
              type='text'
              placeholder='Room code'
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.toUpperCase());
                setError('');
              }}
              className={`${input} font-mono tracking-widest uppercase`}
              maxLength={10}
            />
            <input
              type='text'
              placeholder='Your name'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className={input}
              maxLength={20}
            />
            <button
              type='submit'
              className={`${btnPrimary} w-full py-3`}
              disabled={!inputCode || inputCode.length !== 10 || !name.trim()}
            >
              Join Game
            </button>
          </form>
          {error && hasAttemptedToJoin && <p className='text-sm text-danger-soft'>{error}</p>}
        </div>
      )}

      {!isConnecting && (mode === 'create' || mode === 'ready') && (
        <div className='space-y-4'>
          {backButton}
          <div className='flex w-full items-center justify-center gap-3 rounded-lg border border-brand/40 bg-brand/10 px-4 py-3'>
            <span className='text-sm font-semibold text-muted-foreground'>Room Code</span>
            <span className='font-mono text-xl font-bold tracking-wider text-orange'>
              {roomCode}
            </span>
            <CopyToClipboard text={roomCode} onCopy={() => toast.success('Room code copied to clipboard!')}>
              <button
                className='rounded-md p-1.5 text-brand-soft transition-colors hover:bg-brand/20 hover:text-foreground'
                title='Copy room code'
                aria-label='Copy room code'
              >
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3' />
                </svg>
              </button>
            </CopyToClipboard>
          </div>

          {!isNameSubmitted && (mode !== 'ready' || !players?.length) ? (
            <form onSubmit={(e) => { e.preventDefault(); handleNameSubmit(); }} className='space-y-3'>
              <input
                type='text'
                placeholder='Your name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className={input}
                maxLength={20}
              />
              <button
                type='submit'
                className={`${btnPrimary} w-full py-3`}
                disabled={!name.trim()}
              >
                Create Game
              </button>
              {error && name.trim() && <p className='text-sm text-danger-soft'>{error}</p>}
            </form>
          ) : (
            <div className='space-y-4'>
              <div>
                <div className='mb-2 flex items-baseline justify-between'>
                  <h3 className='font-semibold text-foreground'>Players in Room</h3>
                  <span className='text-sm text-muted-foreground'>{players?.length ?? 0} joined</span>
                </div>
                <ul className='space-y-2'>
                  {players?.map((player) => (
                    <li
                      key={player.userId}
                      className={`${listItem} ${player.userId === onlineUserId ? '!border-brand/60 !bg-brand/15' : ''}`}
                    >
                      <span className='flex-1 truncate'>
                        {player.name}
                        {player.userId === onlineUserId && <span className='ml-2 text-sm font-normal text-brand-soft'>(you)</span>}
                      </span>
                      {isHost && player.userId !== onlineUserId && (
                        <button
                          onClick={() => handleRemovePlayer(player.userId)}
                          className={btnRemove}
                          aria-label={`Remove ${player.name}`}
                          title='Remove player'
                        >
                          <svg aria-hidden viewBox='0 0 20 20' fill='currentColor' className='h-4 w-4'>
                            <path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
                          </svg>
                        </button>
                      )}
                    </li>
                  ))}
                  {players?.length === 0 && (
                    <p className='text-sm text-muted-foreground'>No players in the room yet.</p>
                  )}
                </ul>
              </div>
              <button onClick={handleBack} className={`${btnDanger} w-full`}>
                Leave Room
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
