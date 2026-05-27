import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useGameContext } from '../context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';


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

  return (
    <div className='bg-white rounded-xl shadow-md lg:p-8 p-4 my-4 w-full'>
      <h2 className='text-2xl font-bold text-blue-600 text-center mb-4'>
        Game Room Setup
      </h2>

      {isConnecting && (
        <p className='text-blue-500 text-center'>Connecting to server...</p>
      )}

      {!isConnecting && mode === 'select' && (
        <div className='space-y-4'>
          <button
            onClick={handleCreateRoom}
            className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 active:scale-[0.98]'
          >
            Create New Room
          </button>
          <button
            onClick={handleJoinRoom}
            className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 active:scale-[0.98]'
          >
            Join Room
          </button>
          {connectionError && <p className='text-red-500 text-sm mt-2'>{connectionError}</p>}
        </div>
      )}

      {!isConnecting && mode === 'join' && (
        <div className='space-y-2'>
          <button
            onClick={handleBack}
            className='text-blue-500 hover:text-blue-600 flex items-center'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 pr-1'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            Back
          </button>
          <form onSubmit={(e) => { e.preventDefault(); handleJoinRoom(); }} className='space-y-4'>
            <input
              type='text'
              placeholder='Enter Room Code'
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.toUpperCase());
                setError('');
              }}
              className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
              maxLength={10}
            />
            <input
              type='text'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
              maxLength={20}
            />
            <button
              type='submit'
              className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
              disabled={!inputCode || inputCode.length !== 10 || !name.trim()}
            >
              Join Game
            </button>
          </form>
          {error && hasAttemptedToJoin && <p className='text-red-500 text-sm mt-2'>{error}</p>}
        </div>
      )}

      {!isConnecting && (mode === 'create' || mode === 'ready') && (
        <div className='space-y-2'>
          <button
            onClick={handleBack}
            className='text-blue-500 hover:text-blue-600 flex items-center'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 pr-1'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            Back
          </button>
          <div className='bg-blue-50 border border-blue-200 p-4 rounded-lg w-full flex items-center justify-center space-x-2'>
            <label className='font-semibold'>Room Code:</label>
            <span className='text-xl font-mono font-bold text-blue-600'>
              {roomCode}
            </span>
            <div className='flex items-center pl-4'>
              <CopyToClipboard text={roomCode} onCopy={() => toast.success('Room code copied to clipboard!')}>
                <button
                  className="hover:bg-blue-300 rounded transition-colors"
                  title="Copy room code"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </CopyToClipboard>
            </div>
          </div>

          {!isNameSubmitted && (mode !== 'ready' || !players?.length) ? (
            <form onSubmit={(e) => { e.preventDefault(); handleNameSubmit(); }} className='space-y-4'>
              <div>
                <input
                  type='text'
                  placeholder='Enter your name'
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                  maxLength={20}
                />
                <button
                  type="submit"
                  className='mt-2 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
                  disabled={!name.trim()}
                >
                  Create Game
                </button>
              </div>
              {error && name.trim() && <p className='text-red-500 text-sm mt-2'>{error}</p>}
            </form>
          ) : (
            <div className='space-y-4'>
              <div>
                <h3 className='text-xl font-semibold mb-2'>
                  Players in Room
                </h3>
                <ul className='space-y-2 lg:mb-4 mb-2 w-full'>
                  {players?.map((player) => (
                    <li
                      key={player.userId}
                      className={`relative p-2.5 rounded-lg flex justify-center items-center ${player.name === name ? 'bg-blue-100' : 'bg-gray-100'}`}
                    >
                      <div className='flex-1 text-center font-medium'>{player.name}</div>
                      {isHost && player.userId !== onlineUserId && (
                        <button
                          onClick={() => handleRemovePlayer(player.userId)}
                          className='absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 rounded-lg px-2 text-white text-center h-6 transition-colors'
                        >
                          X
                        </button>
                      )}
                    </li>
                  ))}
                  {players?.length === 0 && (
                    <p className=' text-sm'>No players in the room yet.</p>
                  )}
                </ul>
              </div>
              <button
                onClick={handleBack}
                className='w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors'
              >
                Leave Room
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
