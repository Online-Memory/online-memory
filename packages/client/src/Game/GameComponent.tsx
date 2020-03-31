import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Container, Grid, Button, Snackbar } from '@material-ui/core';
import { PLAY_TURN, CHECKOUT_TILE } from '../graphql';
import { ClaimPlayer } from './ClaimPlayer';
import { WaitOpponents } from './WaitOpponents';
import { Dashboard } from './Dashboard';
import { Player, GameData } from './types';
import { WinningView } from './WinningView';
import { Board } from './Board';
import { ZoomControl } from '../ZoomControl';
import { useZoom } from '../ZoomControl/useZoom';
import { useStyles } from './styles';

interface Props {
  userId: string;
  gameData: GameData;
  onClaimPlayer: (player: Player) => void;
}

export const GameComponent: React.FC<Props> = memo(({ gameData, userId, onClaimPlayer }) => {
  const { tileSize, zoomIn, zoomOut } = useZoom(80);
  const [deltaGameCreation, setDeltaGameCreation] = useState(0);
  const [deltaGameUpdated, setDeltaGameUpdated] = useState(0);
  const classes = useStyles();
  const { name, players, playerTurn, board, tiles, template, moves, createdAt, updatedAt } = gameData;

  const isAPlayer = Boolean(players.find(player => player.userId === userId));
  const pendingPlayers = players.filter(player => !player.userId);

  const [playTurn, { loading: playTurnLoading }] = useMutation(PLAY_TURN, {
    onError: err => {
      console.warn(err);
    },
  });

  const [checkoutTile, { loading: checkoutTIleLoading }] = useMutation(CHECKOUT_TILE, {
    onError: err => {
      console.warn(err);
    },
  });

  useEffect(() => {
    const gameUpdated = new Date(new Date(updatedAt).toUTCString()).valueOf();
    const gameCreated = new Date(new Date(createdAt).toUTCString()).valueOf();
    const now = new Date(new Date(Date.now()).toUTCString()).valueOf();

    const timer1 = setTimeout(() => {
      const deltaCreation = Math.abs(now - gameCreated) / 1000;
      const deltaUpdated = Math.abs(now - gameUpdated) / 1000;

      setDeltaGameCreation(deltaCreation);
      setDeltaGameUpdated(deltaUpdated);
    }, 1000);

    return () => {
      clearTimeout(timer1);
    };
  });

  const pad = useCallback((num: number) => {
    return ('0' + num).slice(-2);
  }, []);

  const getGameCreationTime = useCallback(() => {
    const deltaHours = Math.floor(deltaGameCreation / 60 / 60);
    const deltaMinutes = Math.floor(deltaGameCreation / 60) % 60;
    const deltaSeconds = Math.floor(deltaGameCreation - deltaMinutes * 60);

    return `${pad(deltaHours)}:${pad(deltaMinutes)}:${pad(deltaSeconds)}`;
  }, [deltaGameCreation, pad]);

  const getTurnTimer = useCallback(() => {
    const delta = 30 - deltaGameUpdated;
    return delta >= 0 ? `${delta}` : '0';
  }, [deltaGameUpdated]);

  const handlePlayerSelected = useCallback(
    (player: Player) => {
      onClaimPlayer(player);
    },
    [onClaimPlayer]
  );

  const handleCheckOutTile = useCallback(
    (tileId: number) => {
      checkoutTile({
        variables: {
          checkoutTileInput: {
            gameId: gameData.id,
            tileId,
          },
        },
      });
    },
    [checkoutTile, gameData.id]
  );

  const handleClose = useCallback(() => {
    if (playTurnLoading || playerTurn.turn) {
      return;
    }

    playTurn({
      variables: {
        playTurnInput: {
          gameId: gameData.id,
        },
      },
    });
  }, [gameData.id, playTurn, playTurnLoading, playerTurn.turn]);

  const open = useMemo(() => {
    return playerTurn.userId === userId && !playerTurn.turn;
  }, [playerTurn.turn, playerTurn.userId, userId]);

  const isGameGoing = tiles.filter(tile => tile.status !== 'taken').length;

  if (!isGameGoing) {
    let winningPlayers = players.sort((playerA, playerB) => (playerB.score || 0) - (playerA.score || 0));
    const winningPlayerScore = winningPlayers[0].score;
    winningPlayers = winningPlayers.filter(player => player.score === winningPlayerScore);

    return (
      <WinningView
        winningPlayers={winningPlayers}
        gameName={gameData.name}
        players={players}
        endGameTime={gameData.updatedAt}
      />
    );
  }

  return isAPlayer && pendingPlayers.length ? (
    <div className={`Game ${classes.gameContainer}`}>
      <WaitOpponents gameId={gameData.id} gameName={name} pendingPlayers={pendingPlayers} />
    </div>
  ) : (
    <div className={`Game ${classes.gameContainer}`}>
      <Snackbar
        message="It's your turn!"
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button color="primary" size="small" onClick={handleClose}>
            PLAY
          </Button>
        }
      />

      <ZoomControl onZoomIn={zoomIn} onZoomOut={zoomOut} />

      <Container maxWidth="lg">
        {isAPlayer || !pendingPlayers.length ? (
          <Grid container>
            <Dashboard
              name={name}
              gameCreationTime={getGameCreationTime()}
              turnTimer={getTurnTimer()}
              moves={moves}
              players={players}
              playerTurn={playerTurn}
            />
            <Board
              board={board}
              template={template}
              tiles={tiles}
              tileSize={tileSize}
              loading={checkoutTIleLoading || playTurnLoading}
              disabled={playTurnLoading || checkoutTIleLoading || playerTurn.userId !== userId || !playerTurn.turn}
              onCheckoutTile={handleCheckOutTile}
            />
          </Grid>
        ) : (
          <ClaimPlayer name={name} gameId={gameData.id} players={players} onPlayerSelected={handlePlayerSelected} />
        )}
      </Container>
    </div>
  );
});
