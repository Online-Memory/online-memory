import React, { memo, useEffect, useState } from 'react';
import { GameData } from './types';
import { WinningView } from './WinningView';
import { InGameView } from './InGameView';
import { UserData } from '../AppState';

interface Props {
  user: UserData;
  gameData: GameData;
  onClaimPlayer: () => void;
  onPlayTurn: () => void;
  onCheckOutTile: (tileId: string) => void;
  loading: boolean;
}

export const GameComponent: React.FC<Props> = memo(
  ({ gameData, user, onClaimPlayer, loading, onPlayTurn, onCheckOutTile }) => {
    const [gameStatus, setGameStatus] = useState(gameData.status);
    const isAPlayer = Boolean(gameData.users.find(currUser => currUser.id === user.id));

    useEffect(() => {
      if (gameData.status === 'new' && !isAPlayer) {
        onClaimPlayer();
      }
    }, [gameData.status, isAPlayer, onClaimPlayer]);

    useEffect(() => {
      if (gameStatus !== gameData.status) {
        if (gameData.status === 'ended') {
          setTimeout(() => setGameStatus('ended'), 5000);
        } else {
          setGameStatus(gameData.status);
        }
      }
    }, [gameData.status, gameStatus]);

    if (gameStatus === 'ended') {
      return <WinningView gameData={gameData} />;
    }

    return (
      <InGameView
        user={user}
        gameData={gameData}
        loading={loading}
        onPlayTurn={onPlayTurn}
        onCheckOutTile={onCheckOutTile}
      />
    );
  }
);
