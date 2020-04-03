import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  Container,
  Grid,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from '@material-ui/core';
import { ZoomControl, useZoom } from '../../ZoomControl';
import { PLAY_TURN, CHECKOUT_TILE, START_GAME } from '../../graphql';
import { useStyles } from './styles';
import { GameData } from '../types';
import { Dashboard } from '../Dashboard';
import { Board } from '../Board';

interface Props {
  userId: string;
  gameData: GameData;
}

export const InGameView: React.FC<Props> = memo(({ userId, gameData }) => {
  const { name, players, playerTurn, board, tiles, template, moves, status, updatedAt, startedAt } = gameData;
  const classes = useStyles();
  const { tileSize, zoomIn, zoomOut } = useZoom(60);
  const [deltaGameCreation, setDeltaGameCreation] = useState(0);
  const [deltaGameUpdated, setDeltaGameUpdated] = useState(0);
  const userPlayer = players.find(player => player.userId === userId);

  const [startGame] = useMutation(START_GAME, {
    onError: err => {
      console.warn(err);
    },
  });

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

  const handleClose = useCallback(() => {
    if (playerTurn.turn) {
      return;
    }

    playTurn({
      variables: {
        playTurnInput: {
          gameId: gameData.id,
        },
      },
    });
  }, [gameData.id, playTurn, playerTurn.turn]);

  const handleStartGame = useCallback(() => {
    startGame({
      variables: {
        startGameInput: {
          gameId: gameData.id,
        },
      },
    });
  }, [gameData.id, startGame]);

  useEffect(() => {
    if (status !== 'started') {
      return;
    }

    const gameUpdated = new Date(new Date(updatedAt).toUTCString()).valueOf();
    const gameCreated = new Date(new Date(startedAt).toUTCString()).valueOf();
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

  const open = useMemo(() => {
    return status === 'started' && playerTurn.userId === userId && !playerTurn.turn;
  }, [playerTurn.turn, playerTurn.userId, status, userId]);

  const playerTurnOpen = useMemo(() => {
    return status === 'started' && playerTurn.userId !== userId && playerTurn.turn === 1;
  }, [playerTurn.turn, playerTurn.userId, status, userId]);

  const getTurnTimer = useCallback(() => {
    const delta = 30 - deltaGameUpdated;
    return delta >= 0 ? `${delta}` : '0';
  }, [deltaGameUpdated]);

  const pad = useCallback((num: number) => {
    return ('0' + num).slice(-2);
  }, []);

  const getGameCreationTime = useCallback(() => {
    const deltaHours = Math.floor(deltaGameCreation / 60 / 60);
    const deltaMinutes = Math.floor(deltaGameCreation / 60) % 60;
    const deltaSeconds = Math.floor(deltaGameCreation - deltaMinutes * 60);

    return `${pad(deltaHours)}:${pad(deltaMinutes)}:${pad(deltaSeconds)}`;
  }, [deltaGameCreation, pad]);

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

  return (
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

      <Snackbar
        message={`${playerTurn.name[0].toUpperCase()}${playerTurn.name.slice(1).toLowerCase()} is playing`}
        open={playerTurnOpen}
        classes={{ anchorOriginBottomLeft: classes.playerTurnOpen }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />

      <Dialog
        open={Boolean(userPlayer && userPlayer.status === 'offline')}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Are you ready to start this game?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Click when you're ready start playing</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStartGame} color="primary">
            Let's Go!
          </Button>
        </DialogActions>
      </Dialog>

      <ZoomControl onZoomIn={zoomIn} onZoomOut={zoomOut} />

      <Container maxWidth="lg">
        <Grid container>
          <Dashboard
            name={name}
            gameCreationTime={getGameCreationTime()}
            turnTimer={getTurnTimer()}
            moves={moves}
            players={players}
            playerTurn={playerTurn}
          />
          {status !== 'started' ? (
            <Grid justify="center" xs={12} md={9} item container>
              <Typography component="h4" variant="h6" align="center">
                Waiting for other players to start the game
              </Typography>
            </Grid>
          ) : (
            <Board
              board={board}
              template={template}
              tiles={tiles}
              tileSize={tileSize}
              loading={checkoutTIleLoading || playTurnLoading}
              disabled={playTurnLoading || checkoutTIleLoading || playerTurn.userId !== userId || !playerTurn.turn}
              onCheckoutTile={handleCheckOutTile}
            />
          )}
        </Grid>
      </Container>
    </div>
  );
});
