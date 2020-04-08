import React, { memo, useCallback, useEffect, useState } from 'react';
import { GameData } from './types';
import { WinningView } from './WinningView';
import { InGameView } from './InGameView/InGameView';
import { ClaimPlayer } from './ClaimPlayer';

interface Props {
  userId: string;
  gameData: GameData;
  onClaimPlayer: (playerName: string) => void;
}

export const GameComponent: React.FC<Props> = memo(({ gameData, userId, onClaimPlayer }) => {
  const { name, players } = gameData;

  const isAPlayer = Boolean(players.find(player => player.userId === userId && player.name));
  const [gameStatus, setGameStatus] = useState(gameData.status);

  useEffect(() => {
    if (gameStatus !== gameData.status) {
      if (gameData.status === 'ended') {
        setTimeout(() => setGameStatus('ended'), 2000);
      } else {
        setGameStatus(gameData.status);
      }
    }
  }, [gameData.status, gameStatus]);

  const handleClaimPlayer = useCallback(
    (playerName: string) => {
      onClaimPlayer(playerName);
    },
    [onClaimPlayer]
  );

  if (gameStatus === 'ended') {
    return <WinningView gameData={gameData} />;
  }

  if (gameData.status === 'new' && !isAPlayer) {
    return <ClaimPlayer name={name} gameId={gameData.id} onClaimPlayer={handleClaimPlayer} />;
  }

  return <InGameView userId={userId} gameData={gameData} />;
});
