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
      className={`px-3 py-1.5 max-h-12 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors ${className}`}
      onClick={onReset}
    >
      Reset Game
    </button>
  );
};
