import React, { memo, useCallback } from 'react';
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

  const handleClaimPlayer = useCallback(
    (playerName: string) => {
      onClaimPlayer(playerName);
    },
    [onClaimPlayer]
  );

  if (gameData.status === 'ended') {
    return <WinningView gameData={gameData} />;
  }

  if (gameData.status === 'new' && !isAPlayer) {
    return <ClaimPlayer name={name} gameId={gameData.id} onClaimPlayer={handleClaimPlayer} />;
  }

  return <InGameView userId={userId} gameData={gameData} />;
});
