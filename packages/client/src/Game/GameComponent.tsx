import React, { memo, useCallback } from 'react';
import { WaitOpponents } from './WaitOpponents';
import { Player, GameData } from './types';
import { WinningView } from './WinningView';
import { InGameView } from './InGameView/InGameView';
import { ClaimPlayer } from './ClaimPlayer';

interface Props {
  userId: string;
  gameData: GameData;
  onClaimPlayer: (player: Player) => void;
}

export const GameComponent: React.FC<Props> = memo(({ gameData, userId, onClaimPlayer }) => {
  const { name, players, tiles } = gameData;

  const isAPlayer = Boolean(players.find(player => player.userId === userId));
  const pendingPlayers = players.filter(player => !player.userId);

  const handlePlayerSelected = useCallback(
    (player: Player) => {
      onClaimPlayer(player);
    },
    [onClaimPlayer]
  );

  const isGameGoing = tiles.filter(tile => tile.status !== 'taken').length;

  if (!isGameGoing) {
    return <WinningView gameData={gameData} />;
  }

  if (!isAPlayer && pendingPlayers.length) {
    return <ClaimPlayer name={name} gameId={gameData.id} players={players} onPlayerSelected={handlePlayerSelected} />;
  }

  return isAPlayer && pendingPlayers.length ? (
    <WaitOpponents gameId={gameData.id} gameName={name} pendingPlayers={pendingPlayers} />
  ) : (
    <InGameView userId={userId} gameData={gameData} />
  );
});
