import React, { useCallback, useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import cardDecks from '../data/cardDecks.json'; // TODO: needs optimization
import { Category, GameContext, GameModes, GameRoom, GameState, Player } from './GameContext';
import { io, Socket } from 'socket.io-client';

// TODO: use all callbacks instead of useState functions directly. useState functions shouldn't even be exported.
// is gameRoom not needed since there is a socket.rooms?
export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [category, setCategory] = useState<Category>(() => {
    return (localStorage.getItem('category') as Category) || 'general';
  });
  const [gameState, setGameState] = useState<GameState>(() => {
    return (localStorage.getItem('gameState') as GameState) || 'setup';
  });
  const [gameMode, setGameMode] = useState<GameModes>(() => {
    return (localStorage.getItem('gameMode') as GameModes) || 'SINGLE_DEVICE';
  });
  const [players, setPlayers] = useState<Player[]>(() => {
    return JSON.parse(localStorage.getItem('players') || '[]');
  });
  const [currentRound, setCurrentRound] = useState<number>(() => {
    return parseInt(localStorage.getItem('currentRound') || '1', 10);
  });
  const [totalRounds, setTotalRounds] = useState<number>(() => {
    return parseInt(localStorage.getItem('totalRounds') || '3', 10);
  });
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number>(() => {
    return parseInt(localStorage.getItem('targetPlayerIndex') || '0', 10);
  });
  const [currentCards, setCurrentCards] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('currentCards') || '[]');
  });
  const [targetRankings, setTargetRankings] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('targetRankings') || '[]');
  });
  const [groupPredictions, setGroupPredictions] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('groupPredictions') || '[]');
  });
  const [cardDeck, setCardDeck] = useState<string[]>(() => {
    return cardDecks[
      (localStorage.getItem('category') as Category) || 'general'
    ];
  });
  const [onlineUserId, setOnlineUserId] = useState<string>(() => {  // set to '' when resetting game?
    return localStorage.getItem('onlineUserId') || '';
  });

  // Create a ref to track the current onlineUserId
  const onlineUserIdRef = useRef<string>(onlineUserId);

  // Update the ref whenever onlineUserId changes
  useEffect(() => {
    onlineUserIdRef.current = onlineUserId;
  }, [onlineUserId]);

  // Ref for current room players so player-left handler can derive who left (stale closure safe)
  const roomPlayersRef = useRef<Player[]>([]);

  const [gameRoom, setGameRoom] = useState<GameRoom>(() => {
    const saved = localStorage.getItem('gameRoom');
    return saved ? JSON.parse(saved) : {
      game: {
        currentRound: 1,
        totalRounds: 5,
        targetPlayerIndex: 0,
      }
    };
  });

  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomCode, setRoomCode] = useState<string>(() => {
    return localStorage.getItem('roomCode') || '';
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [mode, setMode] = useState<'select' | 'create' | 'join' | 'ready'>('select');

  const serverUrl = import.meta.env.VITE_WEBSOCKET_SERVER_URL || 'http://localhost:3000';
  const isProduction = import.meta.env.VITE_IS_PRODUCTION || false;
  const port = import.meta.env.VITE_PORT || 3000;

  // Persist state to localStorage on change
  useEffect(() => {
    localStorage.setItem('category', category);
  }, [category]);

  useEffect(() => {
    const deck = cardDecks[category];
    const deckCopy = [...deck];
    const shuffledDeck = shuffleCards(deckCopy);
    setCardDeck(shuffledDeck);
  }, [category]);

  useEffect(() => {
    localStorage.setItem('gameState', gameState);
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('gameMode', gameMode);
  }, [gameMode]);

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('currentRound', currentRound.toString());
  }, [currentRound]);

  useEffect(() => {
    localStorage.setItem('totalRounds', totalRounds.toString());
  }, [totalRounds]);

  useEffect(() => {
    localStorage.setItem('targetPlayerIndex', targetPlayerIndex.toString());
  }, [targetPlayerIndex]);

  useEffect(() => {
    localStorage.setItem('currentCards', JSON.stringify(currentCards));
  }, [currentCards]);

  useEffect(() => {
    localStorage.setItem('targetRankings', JSON.stringify(targetRankings));
  }, [targetRankings]);

  useEffect(() => {
    localStorage.setItem('groupPredictions', JSON.stringify(groupPredictions));
  }, [groupPredictions]);

  useEffect(() => {
    localStorage.setItem('onlineUserId', onlineUserId || '');
  }, [onlineUserId]);

  useEffect(() => {
    localStorage.setItem('gameRoom', JSON.stringify(gameRoom));
  }, [gameRoom]);

  useEffect(() => {
    localStorage.setItem('roomCode', roomCode || '');
  }, [roomCode]);

  useEffect(() => {
    roomPlayersRef.current = gameRoom?.players ?? players;
  }, [gameRoom, players]);

  useEffect(() => {
    if (currentRound > totalRounds) {
      setGameState('gameOver');
    }
  }, [currentRound, totalRounds]);

  useEffect(() => {
    // Only create socket connection when in online mode
    if (gameMode !== GameModes.ONLINE) {
      // Disconnect existing socket if switching away from online mode
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Create socket connection for online mode
    const newSocket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      withCredentials: isProduction,
      secure: isProduction,
      rejectUnauthorized: isProduction,
      transports: ['websocket', 'polling'],
      port: port,
    });

    // Set up socket listeners
    const handleConnect = () => {
      setIsConnecting(false);
      console.log('connected to server');
      setError('');
    };
    setSocket(newSocket);

    const handleDisconnect = () => {
      console.log('disconnected from server');
      setIsConnecting(true);
      setError('Disconnected from server');
    };

    const handleRoomCreated = ({ roomCode }: { roomCode: string }) => {
      console.log('room created', roomCode);
      setRoomCode(roomCode);
      setGameRoom(prev => ({
        ...prev,
        code: roomCode
      }));
      setMode('create');
      setError('');
    };


    const handlePlayerJoined = (updatedPlayers: Player[]) => {
      console.log('player joined', updatedPlayers);
      setPlayers(updatedPlayers);
      setMode('ready');
      setError('');
      setGameRoom({
        ...gameRoom,
        players: updatedPlayers
      });
    };

    const handlePlayerLeft = (updatedPlayers: Player[]) => {
      const previousPlayers = roomPlayersRef.current;
      const leftPlayer = previousPlayers.find(
        (p) => !updatedPlayers.some((u) => u.userId === p.userId)
      );
      const isCurrentUser = leftPlayer?.userId === onlineUserIdRef.current;
      toast(
        isCurrentUser
          ? 'The host has removed you from the game room'
          : `${leftPlayer?.name ?? 'A player'} has left the game`,
        { duration: 5000 }
      );
      console.log('player left', updatedPlayers);

      setPlayers(updatedPlayers);
      setGameRoom((prev) => ({
        ...prev,
        players: updatedPlayers,
        game: {
          ...prev.game,
          currentRound: 1,
          totalRounds: prev.game?.totalRounds ?? 3,
          targetPlayerIndex: 0,
          currentCards: [],
          targetRankings: [],
          groupPredictions: [],
        },
      }));
      setGameState('setup');
      setCurrentRound(1);
      setTargetPlayerIndex(0);
      setCurrentCards([]);
      setTargetRankings([]);
      setGroupPredictions([]);

      // If this client was the one removed, return them to the online setup screen and clear join state
      if (isCurrentUser) {
        setMode('select');
        setRoomCode('');
        setPlayers([]);
        setGameRoom((prev) => ({
          ...prev,
          code: '',
          players: [],
        }));
        setError('');
      } else {
        setMode('ready');
      }
    };

    const handleError = (errorMessage: Error) => {
      console.error('error', errorMessage);
      setError(String(errorMessage));
    };
    const handleOnlineGameStarted = (gameRoom: GameRoom) => {
      // Use the ref to access the current onlineUserId value
      const currentOnlineUserId = onlineUserIdRef.current;

      if (!currentOnlineUserId) {
        console.error('onlineUserId not found');
        return;
      }
      if (!gameRoom) {
        console.error('gameRoom not found');
        return;
      }

      // Store the entire gameRoom object as the data source
      setGameRoom(gameRoom);

      if (gameRoom.game?.targetPlayerIndex !== undefined &&
        gameRoom.players?.[gameRoom.game.targetPlayerIndex]?.userId === currentOnlineUserId) {
        setGameState('targetRanking');
      } else {
        setGameState('groupPrediction');
      }

      // Update individual state from gameRoom for backward compatibility
      setCurrentCards(gameRoom?.game?.currentCards || []);
      setCurrentRound(gameRoom?.game?.currentRound || 1);
      setTargetPlayerIndex(gameRoom?.game?.targetPlayerIndex || 0);
      setTotalRounds(gameRoom?.game?.totalRounds || 5);
      setPlayers(gameRoom?.players || []);
    };

    const handleIncrementTurn = (gameRoom: GameRoom) => {
      console.log('increment round', gameRoom);
      setGameRoom(gameRoom);
      setCurrentCards(gameRoom.game.currentCards);
      setCurrentRound(gameRoom.game.currentRound);
      setTargetPlayerIndex(gameRoom.game.targetPlayerIndex);
      setPlayers(gameRoom.players);
      setTargetRankings([]);
      setGroupPredictions([]);

      if (gameRoom.game?.targetPlayerIndex !== undefined &&
        gameRoom.players?.[gameRoom.game.targetPlayerIndex]?.userId === onlineUserIdRef.current) {
        setGameState('targetRanking');
      } else {
        setGameState('groupPrediction');
      }
    };


    const handleRankingsSubmitted = (gameRoom: GameRoom) => {
      setGameRoom(gameRoom);
      setTargetRankings(gameRoom.game?.targetRankings);
      setPlayers(gameRoom?.players);
    };

    const handleScoreUpdated = (score: number) => {
      console.log('score updated', score);
    };

    const handleRoomDeleted = () => {
      console.log('room deleted');
    };

    const handleGameReset = (updatedGameRoom: GameRoom) => {
      console.log('game reset', updatedGameRoom);
      setGameRoom(updatedGameRoom);
      setPlayers(updatedGameRoom.players || []);
      setCurrentRound(updatedGameRoom.game?.currentRound || 1);
      setTargetPlayerIndex(updatedGameRoom.game?.targetPlayerIndex || 0);
      setCurrentCards(updatedGameRoom.game?.currentCards || []);
      setTargetRankings(updatedGameRoom.game?.targetRankings || []);
      setGroupPredictions(updatedGameRoom.game?.groupPredictions || []);
      setGameState('setup');
      setMode('ready');
    };

    const handleGameOver = () => {
      console.log('game over');
    };

    const handleMessage = (message: string) => {
      console.log('message', message);
      // alert(message);
    };

    // Attach listeners
    newSocket.on('connect_error', (err) => {
      console.log('Connection error: ', err);
    });
    newSocket.on('error', handleError);
    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('room-created', handleRoomCreated);
    newSocket.on('player-joined', handlePlayerJoined);
    newSocket.on('player-left', handlePlayerLeft);
    newSocket.on('game-started', handleOnlineGameStarted);
    newSocket.on('increment-turn', handleIncrementTurn);
    newSocket.on('connect_error', handleError);
    newSocket.on('rankings-submitted', handleRankingsSubmitted);
    newSocket.on('score-updated', handleScoreUpdated);
    newSocket.on('room-deleted', handleRoomDeleted);
    newSocket.on('game-reset', handleGameReset);
    newSocket.on('game-over', handleGameOver);
    newSocket.on('message', handleMessage);

    // Cleanup function
    return () => {
      newSocket.removeAllListeners();
      // Disconnect socket
      console.log('cleanup', roomCode, onlineUserIdRef.current, newSocket.connected);
      newSocket.disconnect();
    };
  }, [serverUrl, setPlayers, gameMode]);



  // Use `useCallback` to optimize updater functions
  const updateCategory = useCallback(
    (newCategory: Category) => setCategory(newCategory),
    []
  );
  const updateGameState = useCallback(
    (newGameState: GameState) => setGameState(newGameState),
    []
  );
  const updatePlayers = useCallback(
    // TODO: use instead of setPlayers or remove this
    (newPlayers: Player[]) => setPlayers(newPlayers),
    []
  );
  const updateCurrentRound = useCallback(
    (round: number) => setCurrentRound(round),
    []
  );
  const updateTotalRounds = useCallback(
    (rounds: number) => setTotalRounds(rounds),
    []
  );
  const updateTargetPlayerIndex = useCallback(
    (index: number) => setTargetPlayerIndex(index),
    []
  );
  const updateCurrentCards = useCallback(
    (cards: string[]) => setCurrentCards(cards),
    []
  );
  const updateTargetRankings = useCallback(
    (rankings: string[]) => setTargetRankings(rankings),
    []
  );
  const updateGroupPredictions = useCallback(
    (predictions: string[]) => setGroupPredictions(predictions),
    []
  );

  // Resets core game state back to defaults (shared by handleResetGame and handleLeaveGame)
  const resetGameState = () => {
    setGameState('setup');
    setCurrentRound(1);
    setTargetPlayerIndex(0);
    setCurrentCards([]);
    setTargetRankings([]);
    setGroupPredictions([]);
  };

  // host ends the game and resets the game state for all players
  // goes to setup screen with players still in the game room
  const handleResetGame = () => {
    if (gameMode === GameModes.ONLINE) {
      // Emit reset-game to server; server broadcasts 'game-reset' to all players including host.
      // Do NOT reset locally - let handleGameReset (triggered by server's event) be the single
      // source of truth so targetPlayerIndex and players stay in sync for host and everyone else.
      socket?.emit('reset-game', roomCode);
      setMode('ready');
      setGameState('setup');
      return;
    }
    resetGameState();
    // Keep players in the list, but reset their scores
    setPlayers(prev => prev.map(player => ({ ...player, score: 0 })));
  };

  // Online only: resets the game state for the current player and removes them from the room
  // Goes to setup screen; other players remain in the game room
  // Backend handles: removing the player from the room, setting a new host if needed,
  // and ending the game if fewer than 2 players remain
  const handleLeaveGame = () => {
    if (gameMode === GameModes.ONLINE && socket?.connected) {
      // Emit same payload as OnlinePlayerList so backend can identify who left
      socket.emit('leave-room', { roomCode, userId: onlineUserId });
      // Delay clearing state so the server receives the emit and can broadcast
      // player-left to others before our socket disconnects (gameMode change tears down socket)
      setTimeout(() => {
        setOnlineUserId('');
        setRoomCode('');
        setGameRoom({
          code: '',
          players: [],
          game: {
            currentRound: 1,
            totalRounds: 3,
            targetPlayerIndex: 0,
            currentCards: [],
            targetRankings: [],
            groupPredictions: [],
          }
        });
        // Stay in online mode so the user lands on the online setup screen (create/join)
        setMode('select');
        resetGameState();
        setPlayers([]);
      }, 400);
      return;
    }
    resetGameState();
    setPlayers([]);
  };

  const calculateRoundScore = () => {
    let total = 20; // max score. deduct points for distance from correct answer

    if (groupPredictions.length === 0) {
      return 0;
    }

    targetRankings.forEach((cardText, index) => {
      const predictionIndex = groupPredictions.indexOf(cardText);

      total -= Math.abs(predictionIndex - index);
    });
    return total;
  };

  const roundScore = calculateRoundScore();
  const isGameOver =
    currentRound === totalRounds && (targetPlayerIndex + 1 === players.length || targetPlayerIndex + 1 === gameRoom?.players?.length);

  const getNextCards = () => {

    const turnsFromPreviousRounds = (currentRound - 1) * players.length;
    const turnsInCurrentRound = targetPlayerIndex;
    const currentTurns = turnsFromPreviousRounds + turnsInCurrentRound + 1;
    return cardDeck.slice(currentTurns * 5, currentTurns * 5 + 5);
  };

  const handleUpdateScore = () => { // some event needs to be emitted
    // Update scores for non-target players after reviewing the group prediction results
    const nextCards = getNextCards();

    if (gameMode === GameModes.ONLINE) {
      console.log('next-turn', !!roomCode, roomCode, gameRoom.code, nextCards) // or use gameRoom.code
      socket?.emit('next-turn', roomCode, nextCards);
      // socket?.emit('update-score', roomCode, gameRoom);
      // if (isGameOver) {
      //   setGameState('gameOver');
      // } else {
      //   const newGameRoom = { ...gameRoom };
      //   if (newGameRoom.game) {
      //     newGameRoom.game = {
      //       ...newGameRoom.game,
      //       currentRound: (newGameRoom.game.currentRound ?? 0) + 1,
      //       currentCards: nextCards,
      //       targetRankings: [],
      //       groupPredictions: [],
      //       // targetPlayerIndex: 0,
      //       // totalRounds: totalRounds,
      //     };
      //   }

      //   newGameRoom.players = players;
      //   // go to next round
      //   if (targetPlayerIndex + 1 === players.length) {
      //     // setCurrentRound(currentRound + 1);
      //     // setTargetPlayerIndex(0);
      //     if (newGameRoom.game) {
      //       newGameRoom.game.currentRound = currentRound + 1;
      //       newGameRoom.game.targetPlayerIndex = 0;
      //     }
      //   } else { // go to the next target player
      //     // setTargetPlayerIndex(targetPlayerIndex + 1);
      //     if (newGameRoom.game) {
      //       newGameRoom.game.targetPlayerIndex = targetPlayerIndex + 1;
      //     }
      //   }

      //   setCurrentCards(nextCards);
      //   setTargetRankings([]);
      //   setGroupPredictions([]);
      //   setGameRoom({
      //     ...newGameRoom,
      //     code: newGameRoom.code ?? '',
      //     players: newGameRoom.players ?? [],
      //     host: newGameRoom.host ?? '',
      //     game: newGameRoom.game
      //   });
      // }
    } else {

      const playersWithUpdatedScore = players.map((player, idx) => ({
        ...player,
        score:
          idx === targetPlayerIndex ? player.score : player.score + roundScore,
      }));
      setPlayers(playersWithUpdatedScore);

      if (isGameOver) {
        setGameState('gameOver');
      } else {
        setCurrentCards(nextCards);
        setTargetRankings([]);
        setGroupPredictions([]);
        setGameState('targetRanking');
        // go to next round
        if (targetPlayerIndex + 1 === players.length) {
          setCurrentRound(currentRound + 1);
          setTargetPlayerIndex(0);
        } else {
          setTargetPlayerIndex(targetPlayerIndex + 1);
        }
      }
    }
  };

  // Fisher-Yates (Knuth) Shuffle
  const shuffleCards = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomNum = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomNum]] = [shuffled[randomNum], shuffled[i]];
    }
    return shuffled;
  };

  // TODO: when a player presses "start game", that player becomes the host(if necessary) and the rest of the players are notified
  // post event when gameState changes
  const handleStartGame = () => {
    // 2 players or more are required to play the game.
    // TODO: figure out the best max player limit
    if (players.length >= 2) {
      // shuffle the card deck and grab enough for the game
      const deck = cardDecks[category];
      const deckCopy = [...deck];
      const shuffledDeck = shuffleCards(deckCopy);
      const currentGameDeck = shuffledDeck.slice(0, players.length * 5 * totalRounds);
      setCardDeck(currentGameDeck);
      const currentCards = currentGameDeck.slice(0, 5)
      setCurrentCards(currentCards);
      if (gameMode === GameModes.ONLINE) {
        socket?.emit('start-game', roomCode, totalRounds, currentCards);
      } else {
        setGameState('targetRanking');
      }

      // post some event to setGameState to 'targetRanking'
    } else {
      alert('Please add at least 2 players');
    }
  };


  // Provides the game context with organized state and handler functions
  const value = {
    // Game state properties
    gameState,
    setGameState,
    gameMode,
    setGameMode,
    category,
    setCategory,

    // Player-related properties
    players,
    setPlayers,
    onlineUserId,
    setOnlineUserId,

    // Round-related properties
    currentRound,
    setCurrentRound,
    totalRounds,
    setTotalRounds,

    // Card-related properties
    cardDeck,
    setCardDeck,
    currentCards,
    setCurrentCards,

    // Ranking and prediction properties
    targetPlayerIndex,
    setTargetPlayerIndex,
    targetRankings,
    setTargetRankings,
    groupPredictions,
    setGroupPredictions,

    // Score and game status properties
    roundScore,
    isGameOver,

    // Handler functions
    handleResetGame,
    handleLeaveGame,
    handleUpdateScore,
    handleStartGame,

    // Update functions
    updateGameState,
    updateCategory,
    updatePlayers,
    updateCurrentRound,
    updateTotalRounds,
    updateTargetPlayerIndex,
    updateCurrentCards,
    updateTargetRankings,
    updateGroupPredictions,

    // Online player list properties
    socket,
    setSocket,
    roomCode,
    setRoomCode,
    isConnecting,
    setIsConnecting,
    error,
    setError,
    mode,
    setMode,
    gameRoom,
    setGameRoom,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
