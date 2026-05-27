import { useGameContext } from "../context/GameContext";

// Button to leave online game
export const LeaveGameButton = ({ className }: { className?: string }) => {
  const { handleLeaveGame } = useGameContext();

  const onLeave = () => {
    if (window.confirm('Are you sure you want to leave the game? You cannot rejoin this game after leaving and all your progress will be lost.')) {
      handleLeaveGame();
    }
  };

  return (
    <button
      className={`px-3 py-1.5 max-h-12 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors ${className}`}
      onClick={onLeave}
    >
      Leave Game
    </button>
  );
};
