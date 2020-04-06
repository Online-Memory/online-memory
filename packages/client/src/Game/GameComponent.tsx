import React, { memo, useCallback } from 'react';
import { WaitOpponents } from './WaitOpponents';
import { GameData } from './types';
import { WinningView } from './WinningView';
import { InGameView } from './InGameView/InGameView';
import { ClaimPlayer } from './ClaimPlayer';

interface Props {
  userId: string;
  gameData: GameData;
  onClaimPlayer: (playerName: string) => void;
  onStartGame: (gameName: string) => void;
}

export const GameComponent: React.FC<Props> = memo(({ gameData, userId, onClaimPlayer, onStartGame }) => {
  const { name, players, owner } = gameData;

  const isAPlayer = Boolean(players.find(player => player.userId === userId && player.name));

  const handleClaimPlayer = useCallback(
    (playerName: string) => {
      onClaimPlayer(playerName);
    },
    [onClaimPlayer]
  );

  const handleStartGame = useCallback(() => {
    onStartGame(gameData.id);
  }, [gameData.id, onStartGame]);

  if (gameData.status === 'ended') {
    return <WinningView gameData={gameData} />;
  }

  if (gameData.status === 'new' && !isAPlayer) {
    return <ClaimPlayer name={name} gameId={gameData.id} onClaimPlayer={handleClaimPlayer} />;
  }

  if (gameData.status === 'new' && owner === userId) {
    return <WaitOpponents gameId={gameData.id} gameName={name} players={players} onStartGame={handleStartGame} />;
  }

  return <InGameView userId={userId} gameData={gameData} />;
});
