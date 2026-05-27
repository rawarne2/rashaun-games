import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Typography, Space, Statistic, Button, Modal, Select, Divider, Row, Col } from 'antd';
import { motion } from 'motion/react';
import { TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './App.css';

const { Title } = Typography;
const { Option } = Select;

interface GridItem {
  id: number;
  value: string;
  color?: string;
  image?: string;
}

interface Score {
  rounds: number;
  time: number;
  timestamp: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'idle' | 'playing' | 'showing' | 'lost';

type AnimateProps = {
  scale?: number | number[];
  x?: number | number[];
  y?: number | number[];
  opacity?: number | number[];
  borderColor?: string | string[];
  rotateY?: number;
}

interface TransitionProps {
  duration?: number;
  ease?: string | number[];
  delay?: number;
  opacity?: { delay: number; duration: number };
}

// Configuration
const DIFFICULTY_CONFIG = {
  easy: { size: 4, types: ['number'] },
  medium: { size: 5, types: ['number', 'color'] },
  hard: { size: 6, types: ['number', 'color', 'image'] },
};

const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#6A0DAD', // Purple
  '#FF9F1C', // Orange
  '#2EC4B6', // Turquoise
  '#E71D36', // Bright Red
  '#011627', // Navy Blue
  '#41EAD4', // Mint
  '#FDCA40', // Yellow
  '#FB5607', // Deep Orange
  '#8338EC', // Violet
  '#3A86FF', // Azure Blue
  '#06D6A0', // Seafoam
  '#EF476F', // Pink
  '#0077B6', // Ocean Blue
];

// GameSquare Component
interface GameSquareProps {
  item: GridItem;
  size: number;
  isRevealed: boolean;
  isSequenceItem: boolean;
  isPlaying: boolean;
  isShowing: boolean;
  isLastClickCorrect: boolean;
  isWrong: boolean;
  showContent: boolean;
  onClick: (id: number) => void;
  windowDimensions: { width: number; height: number };
}

const GameSquare: React.FC<GameSquareProps> = ({
  item,
  size,
  isRevealed,
  isSequenceItem,
  isPlaying,
  isShowing,
  isLastClickCorrect,
  isWrong,
  showContent,
  onClick,
  windowDimensions
}) => {
  // Preload image if it exists
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (item.image) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => {
        console.error(`Failed to load image: ${item.image}`);
        setImageError(true);
        setImageLoaded(false);
      };
      img.src = item.image;
    }
  }, [item.image]);

  // Determine animation and border styles
  let animateProps: AnimateProps = {};
  let transitionProps: TransitionProps = { duration: 0.1, ease: 'easeInOut' };

  if (isLastClickCorrect || (isRevealed && isPlaying)) {
    animateProps = {
      scale: [1, 1.05, 1],
      borderColor: 'var(--color-success)',
      opacity: 1,
    };
    transitionProps = {
      duration: 0.5,
      ease: 'easeInOut',
    };
  } else if (isSequenceItem && isShowing) {
    animateProps = {
      scale: [1, 1.05, 1],
      borderColor: 'var(--color-primary)',
      opacity: 1,
    };
    transitionProps = {
      duration: 0.5,
      ease: 'easeInOut',
    };
  } else if (isWrong) {
    animateProps = {
      x: [0, -5, 5, -5, 5, 0],
      borderColor: 'var(--color-error)'
    };
    transitionProps = {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    };
  }
  else if (isFocused && isPlaying) {
    animateProps = {
      scale: 1.05,
      borderColor: 'var(--color-primary)',
      opacity: 1
    };
  }
  else { // idle or not playing
    animateProps = {
      scale: 1,
      borderColor: 'var(--color-neutral)',
      opacity: 1
    };
  }

  return (
    <motion.div
      role="button"
      tabIndex={isPlaying ? 0 : -1}
      onClick={() => isPlaying && onClick(item.id)}
      onKeyDown={(e) => isPlaying && (e.key === 'Enter' || e.key === ' ') && onClick(item.id) && setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="square-container"
      style={{
        width: `calc(${windowDimensions.width < windowDimensions.height ? '80vw' : '80vh'} / ${size})`,
        height: `calc(${windowDimensions.width < windowDimensions.height ? '80vw' : '80vh'} / ${size})`,
        maxWidth: `calc(420px / ${size})`,
        maxHeight: `calc(420px / ${size})`,
        cursor: isPlaying ? 'pointer' : 'not-allowed',
      }}
      animate={animateProps}
      transition={transitionProps}
      aria-label={`Grid item ${item.id}, ${showContent ? 'showing ' + item.value : 'hidden'}`}
      aria-disabled={!isPlaying}
      aria-pressed={isRevealed}
    >
      <motion.div
        className="square-front"
        style={{
          backgroundColor: showContent && item.color ? item.color : 'var(--color-background)',
          color: showContent && (item.color || (item.image && !imageError)) ? 'transparent' : '',
          fontSize: `calc(24px * 4 / ${size})`,
        }}
        initial={{ rotateY: 180 }}
        animate={{
          rotateY: showContent ? 0 : 180,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
          // Add slight delay if image hasn't loaded yet
          delay: (item.image && !imageLoaded && !imageError && showContent) ? 0.1 : 0
        }}
      >
        {item.value}
        {/* Image overlay div with its own opacity */}
        {item.image && !imageError && (
          <div
            className="square-image-overlay"
            style={{
              backgroundImage: `url(${item.image})`,
              opacity: showContent ? 1 : 0,
            }}
          />
        )}
      </motion.div>

      <motion.div
        className="square-back"
        initial={{ rotateY: 0 }}
        animate={{
          rotateY: showContent ? 180 : 0
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut'
        }}
      />
    </motion.div>
  );
};

// GameControls Component
interface GameControlsProps {
  difficulty: Difficulty;
  gameState: GameState;
  hintUsed: boolean;
  onStart: () => void;
  onHint: () => void;
  onShowLeaderboard: () => void;
  onDifficultyChange: (value: Difficulty) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  gameState,
  hintUsed,
  onStart,
  onHint,
  onShowLeaderboard,
  onDifficultyChange
}) => {
  return (
    <Space className="game-controls">
      <div className="game-controls__group">
        <Select
          value={difficulty}
          onChange={onDifficultyChange}
          style={{ width: 136 }}
          disabled={gameState !== 'idle' && gameState !== 'lost'}
          aria-label="Select difficulty"
          className="game-controls__select game-controls__button"
        >
          <Option value="easy">Easy (4x4)</Option>
          <Option value="medium">Medium (5x5)</Option>
          <Option value="hard">Hard (6x6)</Option>
        </Select>
        <Button
          onClick={onShowLeaderboard}
          aria-label="Show leaderboard"
          className="game-controls__button"
        >
          Leaderboard
        </Button>
      </div>
      <div className="game-controls__group">
        <Button
          type={!hintUsed && gameState === 'playing' ? "primary" : "default"}
          onClick={onHint}
          disabled={hintUsed || gameState !== 'playing'}
          aria-label="Use hint"
          aria-disabled={hintUsed || gameState !== 'playing'}
          shape='round'
          className="game-controls__button game-controls__button--hint"
        >
          Hint
        </Button>
        <Button
          type="primary"
          onClick={onStart}
          disabled={gameState !== 'idle' && gameState !== 'lost'}
          aria-label="Start game"
          aria-disabled={gameState !== 'idle' && gameState !== 'lost'}
          shape='round'
          className="game-controls__button game-controls__button--start"
        >
          Start
        </Button>
      </div>
    </Space>
  );
};

// LeaderboardModal Component
interface LeaderboardModalProps {
  open: boolean;
  onClose: () => void;
  leaderboard: Record<Difficulty, Score[]>;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  open,
  onClose,
  leaderboard
}) => {
  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      className="game-modal"
      closeIcon={<span className="close-icon" role="button" aria-label="Close">×</span>}
      maskClosable={true}
      keyboard={true}
    >
      <div className="game-modal-container" role="dialog" aria-labelledby="leaderboard-title">
        <Title level={3} id="leaderboard-title" className="leaderboard-title">
          <TrophyOutlined style={{ fontSize: '24px', color: 'var(--color-primary)', marginRight: 'var(--spacing-sm)' }} aria-hidden="true" />Leaderboard
        </Title>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
          <div key={diff} style={{ marginBottom: 'var(--spacing-md)' }}>
            <Title level={5} style={{ marginBottom: 'var(--spacing-sm)' }}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</Title>
            {leaderboard[diff].length > 0 ? (
              <div className="leaderboard-scores">
                {leaderboard[diff].map((score, index) => (
                  <Row key={index} className={`leaderboard-score`} align="stretch">
                    <Col span={4}>
                      <div className="score-rank">{index + 1}</div>
                    </Col>
                    <Col span={10}>
                      <div className="score-rounds-time">
                        <TrophyOutlined style={{ marginRight: 'var(--spacing-xs)', color: 'var(--color-primary)', fontSize: '16px' }} aria-hidden="true" />
                        {score.rounds}
                      </div>
                    </Col>
                    <Col span={10}>
                      <div className="score-rounds-time">
                        <ClockCircleOutlined style={{ marginRight: 'var(--spacing-xs)', color: 'var(--color-secondary)', fontSize: '16px' }} aria-hidden="true" />
                        {score.time}s
                      </div>
                    </Col>
                  </Row>
                ))}
              </div>
            ) : (
              <div className="no-scores">No scores yet</div>
            )}
          </div>
        ))}

        <div className="game-over-button-container">
          <Button
            type="primary"
            onClick={onClose}
            className="game-over-button"
            aria-label="Close leaderboard"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// GameOverModal Component
interface GameOverModalProps {
  open: boolean;
  onClose: () => void;
  rounds: number;
  elapsedTime: number;
  difficulty: Difficulty;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  open,
  onClose,
  rounds,
  elapsedTime,
  difficulty
}) => {
  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      className="game-modal"
      closeIcon={<span className="close-icon" role="button" aria-label="Close">×</span>}
      maskClosable={true}
      keyboard={true}
    >
      <div className="game-modal-container" role="dialog" aria-labelledby="game-over-title">
        <Title level={3} id="game-over-title" className="game-over-title">
          Game Over!
        </Title>

        <Divider>
          <TrophyOutlined style={{ fontSize: '24px', color: 'var(--color-primary)' }} aria-hidden="true" />
        </Divider>

        <Title level={4}>Your Results</Title>
        <Title level={5} style={{ marginBottom: 'var(--spacing-md)' }}>
          Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Title>

        <Row gutter={[24, 24]} justify="space-around" align="middle">
          <Col span={12}>
            <div className="game-over-stats">
              <div className="stats-title" style={{ fontSize: '20px', marginBottom: 'var(--spacing-sm)' }}>
                <TrophyOutlined style={{ marginRight: 'var(--spacing-sm)', color: 'var(--color-primary)', fontSize: '22px' }} aria-hidden="true" />
                Rounds
              </div>
              <div className="stats-value" style={{ fontSize: '28px' }}>
                {rounds}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="game-over-stats">
              <div className="stats-title" style={{ fontSize: '20px', marginBottom: 'var(--spacing-sm)' }}>
                <ClockCircleOutlined style={{ marginRight: 'var(--spacing-sm)', color: 'var(--color-secondary)', fontSize: '22px' }} aria-hidden="true" />
                Time
              </div>
              <div className="stats-value" style={{ fontSize: '28px' }}>
                {`${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')}`}
              </div>
            </div>
          </Col>
        </Row>

        <div className="game-over-button-container">
          <Button
            type="primary"
            onClick={onClose}
            className="game-over-button"
            aria-label="Close game over dialog"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [hintUsed, setHintUsed] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState<Record<Difficulty, Score[]>>({
    easy: [], medium: [], hard: [],
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeRef = useRef<number>(0);
  const displayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [errorSquare, setErrorSquare] = useState<number | null>(null);
  const [displaySequence, setDisplaySequence] = useState<number[]>([]);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('memoryGameLeaderboard');
      if (saved) {
        setLeaderboard(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load leaderboard from localStorage:', error);
      // Continue with default empty leaderboard
    }

    // Make sure to clear intervals when component unmounts
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (displayTimerRef.current) clearInterval(displayTimerRef.current);
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Memoize grid initialization based on difficulty
  const initializeGrid = useCallback((diff: Difficulty) => {
    const size = DIFFICULTY_CONFIG[diff].size;
    const types = DIFFICULTY_CONFIG[diff].types;
    const items: GridItem[] = [];
    for (let i = 0; i < size * size; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      let value = '';
      let color = '';
      let image = '';
      if (type === 'number') value = (i + 1).toString();
      else if (type === 'color') color = COLORS[Math.floor(Math.random() * COLORS.length)];
      else if (type === 'image') image = `https://picsum.photos/seed/${i}/100`;
      items.push({ id: i, value, color, image });
    }
    return items;
  }, []);

  // Initialize grid on first mount
  useEffect(() => {
    setGrid(initializeGrid('easy'));
  }, [initializeGrid]);

  // Update grid when difficulty changes while in idle state
  useEffect(() => {
    if (gameState === 'idle') {
      setGrid(initializeGrid(difficulty));
    }
  }, [difficulty, gameState, initializeGrid]);

  // Timer effect with optimized rendering
  useEffect(() => {
    if (startTime && (gameState === 'playing' || gameState === 'showing')) {
      // Stop any existing timer
      if (timerRef.current) clearInterval(timerRef.current);
      if (displayTimerRef.current) clearInterval(displayTimerRef.current);

      // Use ref to track time without causing re-renders
      timerRef.current = setInterval(() => {
        timeRef.current = Math.floor((Date.now() - startTime) / 1000);
      }, 100);

      // Only update the state (and trigger re-render) once per second
      displayTimerRef.current = setInterval(() => {
        setElapsedTime(timeRef.current);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (displayTimerRef.current) clearInterval(displayTimerRef.current);
    };
  }, [startTime, gameState]);

  // Start game
  const startGame = useCallback(() => {
    setGrid(initializeGrid(difficulty));
    setSequence([Math.floor(Math.random() * DIFFICULTY_CONFIG[difficulty].size ** 2)]);
    setUserInput([]);
    setRevealed(new Set());
    setGameState('showing');
    setHintUsed(false);
    timeRef.current = 0;
    setElapsedTime(0);
    setStartTime(Date.now());
    setErrorSquare(null);
    setDisplaySequence([]);
  }, [difficulty, initializeGrid]);

  // Show sequence
  useEffect(() => {
    if (gameState === 'showing') {
      // Clear revealed set to make sure previous clicks are hidden
      setRevealed(new Set());

      // Start showing sequence one by one using Framer Motion's staggered animations
      // We'll use the displaySequence state to control which items to reveal
      const sequenceTimeout = setTimeout(() => {
        for (let i = 0; i < sequence.length; i++) {
          setTimeout(() => {
            setDisplaySequence(prev => [...prev, sequence[i]]);

            // Hide the item after 1 second
            setTimeout(() => {
              setDisplaySequence(prev => prev.filter(id => id !== sequence[i]));
            }, 1000);

            // Move to next game state when sequence is complete
            if (i === sequence.length - 1) {
              setTimeout(() => {
                setGameState('playing');
              }, 1500);
            }
          }, i * 1500);
        }
      }, 500);

      return () => {
        clearTimeout(sequenceTimeout);
      };
    } else if (gameState === 'idle') {
      // Reset revealed items when starting a new game
      setRevealed(new Set());
    }
  }, [gameState, sequence]);

  // Handle user click
  const handleClick = useCallback((id: number) => {
    if (gameState !== 'playing' || userInput.length >= sequence.length) return;

    // Add to revealed set so content is displayed
    setRevealed(prev => new Set([...prev, id]));

    const expected = sequence[userInput.length];
    const newInput = [...userInput, id];
    setUserInput(newInput);

    if (id !== expected) {
      setErrorSquare(id);
      setGameState('lost');
      setRevealed(new Set([id, expected]));
      const time = timeRef.current;
      const score: Score = { rounds: sequence.length - 1, time, timestamp: Date.now() };
      setTimeout(() => {
        setShowGameOverModal(true);
      }, 1000);
      setLeaderboard(prev => {
        const updated = [...prev[difficulty], score]
          .sort((a, b) => b.rounds - a.rounds || a.time - b.time)
          .slice(0, 3);
        const newLeaderboard = { ...prev, [difficulty]: updated };
        try {
          localStorage.setItem('memoryGameLeaderboard', JSON.stringify(newLeaderboard));
        } catch (error) {
          console.error('Failed to save leaderboard to localStorage:', error);
        }
        return newLeaderboard;
      });
    } else if (newInput.length === sequence.length) {
      setUserInput([]);

      // Clear revealed squares after a short delay
      setTimeout(() => {
        setRevealed(new Set());
      }, 500);

      // Start next round after animation completes
      setTimeout(() => {
        const size = DIFFICULTY_CONFIG[difficulty].size ** 2;
        const nextId = Math.floor(Math.random() * size);
        setSequence([...sequence, nextId === sequence[sequence.length - 1] ? (nextId + 1) % size : nextId]);
        setGameState('showing');
      }, 1000);
    } else {
      // For correct clicks, clear the revealed square after a short delay
      setTimeout(() => {
        setRevealed(prev => {
          const updated = new Set(prev);
          updated.delete(id);
          return updated;
        });
      }, 500);
    }
  }, [gameState, userInput, sequence, difficulty]);

  // Hint feature
  const useHint = useCallback(() => {
    if (!hintUsed && gameState === 'playing') {
      setHintUsed(true);
      setRevealed(new Set(sequence));
      setTimeout(() => setRevealed(new Set()), 2000);
    }
  }, [hintUsed, gameState, sequence]);

  // Reset board without starting the game
  const resetBoard = () => {
    setGrid(initializeGrid(difficulty));
    setSequence([]);
    setUserInput([]);
    setRevealed(new Set());
    setHintUsed(false);
    timeRef.current = 0;
    setElapsedTime(0);
    setGameState('idle');
    setErrorSquare(null);
    setDisplaySequence([]);

    // Clear any running timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (displayTimerRef.current) clearInterval(displayTimerRef.current);
  };

  // Memoize current grid size
  const gridSize = useMemo(() => DIFFICULTY_CONFIG[difficulty].size, [difficulty]);

  // Memoize game status text for screen readers
  const gameStatusText = useMemo(() => {
    if (gameState === 'idle') return 'Game ready to start';
    if (gameState === 'showing') return `Showing sequence round ${sequence.length}`;
    if (gameState === 'playing') return `Your turn, round ${sequence.length}`;
    if (gameState === 'lost') return `Game over! You reached round ${sequence.length - 1}`;
    return '';
  }, [gameState, sequence.length]);

  // Format time for display with useMemo to avoid unnecessary recalculations
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [elapsedTime]);

  // Memoized grid rendering
  const gridItems = useMemo(() => {
    const size = DIFFICULTY_CONFIG[difficulty].size;

    return grid.map(item => {
      const isRevealed = revealed.has(item.id);
      const isSequenceItem = displaySequence.includes(item.id);
      const isPlaying = gameState === 'playing';
      const isShowing = gameState === 'showing';
      const isLastClickCorrect = sequence[userInput.length - 1] === item.id && userInput.length > 0 && isPlaying;
      const isWrong = item.id === errorSquare;

      // Only show content if revealed or part of displaying sequence
      const showContent = (isRevealed && (isPlaying || gameState === 'lost')) ||
        (isSequenceItem && isShowing) ||
        (gameState === 'lost' && (sequence.includes(item.id) || item.id === errorSquare));

      return (
        <GameSquare
          key={item.id}
          item={item}
          size={size}
          isRevealed={isRevealed}
          isSequenceItem={isSequenceItem}
          isPlaying={isPlaying}
          isShowing={isShowing}
          isLastClickCorrect={isLastClickCorrect}
          isWrong={isWrong}
          showContent={showContent}
          onClick={handleClick}
          windowDimensions={windowDimensions}
        />
      );
    });
  }, [grid, revealed, gameState, difficulty, sequence, userInput, handleClick, errorSquare, displaySequence, windowDimensions]);

  // Preload all images when grid is initialized
  useEffect(() => {
    grid.forEach(item => {
      if (item.image) {
        const img = new Image();
        img.onload = () => {
          console.log(`Image loaded: ${item.image}`);
        };
        img.onerror = () => {
          console.error(`Failed to preload image: ${item.image}`);
        };
        img.src = item.image;
      }
    });
  }, [grid]);

  return (
    <div className="game-container">
      <Title level={1}>Memory Game</Title>
      <div className="game-status-sr-only" role="status" aria-live="polite">
        {gameStatusText}
      </div>
      <Space direction="vertical" className="game-space-container">
        <div className="game-controls-container">
          <Row gutter={12} className="game-stats">
            <Col span={12}>
              <div className="game-stats__item">
                <Statistic
                  value={gameState !== 'idle' ? sequence.length : 0}
                  prefix={<><TrophyOutlined style={{ marginRight: 'var(--spacing-xs)', color: 'var(--color-primary)' }} aria-hidden="true" /> Round: </>}
                />
              </div>
            </Col>
            <Col span={12}>
              <div className="game-stats__item">
                <Statistic
                  value={formattedTime}
                  prefix={<><ClockCircleOutlined style={{ marginRight: 'var(--spacing-xs)', color: 'var(--color-secondary)' }} aria-hidden="true" /> Time: </>}
                />
              </div>
            </Col>
          </Row>
          <GameControls
            difficulty={difficulty}
            gameState={gameState}
            hintUsed={hintUsed}
            onStart={startGame}
            onHint={useHint}
            onShowLeaderboard={() => setShowLeaderboard(true)}
            onDifficultyChange={setDifficulty}
          />
        </div>
        <div
          className="game-grid"
          role="grid"
          aria-label={`Memory game grid, ${gridSize}x${gridSize}`}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            borderColor: `${gameState === 'lost' && 'var(--color-error)' ||
              gameState === 'playing' && 'var(--color-success)' ||
              gameState === 'showing' && 'var(--color-warning)' ||
              gameState === 'idle' && 'var(--color-primary)'
              }`
          }}
        >
          {gridItems}
        </div>
      </Space>

      <LeaderboardModal
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        leaderboard={leaderboard}
      />

      <GameOverModal
        open={showGameOverModal}
        onClose={() => {
          setShowGameOverModal(false);
          resetBoard();
        }}
        rounds={sequence.length - 1}
        elapsedTime={elapsedTime}
        difficulty={difficulty}
      />
    </div>
  );
};

export default App;