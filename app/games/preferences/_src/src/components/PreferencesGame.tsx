import React, { useState, useRef, useEffect } from 'react';
import { SetupScreen } from './SetupScreen';
import { ReviewScreen } from './ReviewScreen';
import { GameOverScreen } from './GameOverScreen';
import { GameModes, useGameContext } from '../context/GameContext';
import { CardRankingScreen } from './CardRankingScreen';
import { WaitingForRankingsScreen } from './WaitingForRankingsScreen';
import { ResetGameButton } from './ResetGameButton';
import { LeaveGameButton } from './LeaveGameButton';

const PreferencesGame: React.FC = () => {
  const { gameState, gameMode, gameRoom, onlineUserId } = useGameContext();
  const isHost = gameMode !== GameModes.ONLINE || gameRoom?.players?.find(p => p.userId === onlineUserId)?.isHost;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown menu when gameState changes (e.g. new game starts)
  useEffect(() => {
    setMenuOpen(false);
  }, [gameState]);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Render the appropriate screen based on game state
  return (
    <div className='flex flex-col w-full flex-1 relative items-center justify-start'>
      {gameState === 'setup' && <SetupScreen />}
      {gameState !== 'setup' && (
        <>
          {/* Desktop: show buttons directly */}
          <div className='hidden lg:flex flex-row justify-end w-full absolute z-10'>
            {isHost && <ResetGameButton className='m-2' />}
            {gameMode === GameModes.ONLINE && <LeaveGameButton className='m-2' />}
          </div>

          {/* Mobile/Tablet: hamburger dropdown menu */}
          <div className='lg:hidden absolute right-2 top-2 z-10' ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className='p-2 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-gray-100 text-gray-700 shadow-md transition-colors'
              aria-label='Game menu'
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
            {menuOpen && (
              <div className='absolute right-0 mt-1 flex flex-col bg-white rounded-lg shadow-lg border border-gray-100 min-w-[130px] overflow-hidden'>
                {isHost && <ResetGameButton className='p-2 !rounded-none !rounded-t' />}
                {gameMode === GameModes.ONLINE && (
                  <LeaveGameButton className='p-2 !rounded-none !rounded-b' />
                )}
              </div>
            )}
          </div>
        </>
      )}
      {(gameState === 'targetRanking' || gameState === 'groupPrediction') && (
        <CardRankingScreen />
      )}
      {gameState === 'waitingForRankings' && (
        <WaitingForRankingsScreen />
      )}
      {gameState === 'review' && <ReviewScreen />}
      {gameState === 'gameOver' && <GameOverScreen />}
    </div>
  );
};

export default PreferencesGame;
