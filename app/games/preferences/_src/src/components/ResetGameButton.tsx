import { useGameContext } from "../context/GameContext";


export const ResetGameButton = ({ className }: { className?: string }) => {
  const { handleResetGame } = useGameContext();

  const onReset = () => {
    if (window.confirm('Are you sure you want to reset the game for everyone?')) {
      handleResetGame();
    }
  };

  return (
    <button
      className={`px-3 py-1.5 max-h-12 bg-danger text-white font-medium rounded-lg hover:bg-danger-hover transition-colors ${className}`}
      onClick={onReset}
    >
      Reset Game
    </button>
  );
};
