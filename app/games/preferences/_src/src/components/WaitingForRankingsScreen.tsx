import { useEffect, useState } from "react";
import { useGameContext } from "../context/GameContext";

export const WaitingForRankingsScreen = () => {
    const { gameRoom, targetPlayerIndex, setGameState, setTargetRankings, socket } = useGameContext();

    const [playersWaiting, setPlayersWaiting] = useState<string[]>([]);

    useEffect(() => {
        const getPlayersWaitingFor = (): string[] => {
            if (!gameRoom?.players) return [];
            const targetPlayer = gameRoom.players[targetPlayerIndex];
            const playersWithoutRankings = new Set();

            gameRoom.players.forEach(player => {
                if (!player.rankings?.length) {
                    if (player.userId !== targetPlayer.userId) {
                        playersWithoutRankings.add(player.name)
                    } else if (!gameRoom.game?.targetRankings?.length) {
                        playersWithoutRankings.add(player.name)
                    }
                }
            })
            const slackers: string[] = Array.from(playersWithoutRankings) as string[];
            console.log({ playersWithoutRankings, slackers, gameRoom, socket });
            return slackers;
        }
        const playersWaiting = getPlayersWaitingFor();
        if (playersWaiting.length === 0) {
            setGameState('review');
            if (gameRoom?.game?.targetRankings) {
                setTargetRankings(gameRoom?.game?.targetRankings)
            }
            return
        }
        setPlayersWaiting(playersWaiting);
    }, [gameRoom, targetPlayerIndex, setGameState, setTargetRankings, socket]);

    return (
        <div className="flex flex-col items-center space-y-4 p-6">
            <h3 className="text-2xl font-bold">Waiting for rankings...</h3>
            <div className="text-center w-full">
                <div className="space-y-2">
                    <p className="text-lg">Still waiting for:</p>
                    <ul className="space-y-2 lg:mb-4 mb-2 w-full">
                        {playersWaiting.map((player, index) => (
                            <li key={`${player}-${index}`} className="p-2.5 rounded-lg flex-1 flex justify-center items-center bg-gray-100 font-medium">
                                <div className="flex flex-1 justify-center">{player}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}