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
  CircularProgress,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
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
  const { name, players, playerTurn, board, tiles, template, moves, owner, status, updatedAt, startedAt } = gameData;
  const classes = useStyles();
  const { tileSize, zoomIn, zoomOut } = useZoom(60);
  const [deltaGameCreation, setDeltaGameCreation] = useState(0);
  const [deltaGameUpdated, setDeltaGameUpdated] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState('');

  const userPlayer = players.find(player => player.userId === userId);
  const gameUpdated = new Date(new Date(updatedAt).toUTCString()).valueOf();
  const gameCreated = new Date(new Date(startedAt).toUTCString()).valueOf();
  const now = new Date(new Date(Date.now()).toUTCString()).valueOf();

  useEffect(() => {
    if (status !== 'started') {
      return;
    }

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

  const [startGame, { loading: startGameLoading }] = useMutation(START_GAME, {
    onError: err => {
      console.warn(err);
    },
  });

  const [playTurn, { loading: playTurnLoading }] = useMutation(PLAY_TURN, {
    onError: err => {
      console.warn(err);
    },
  });

  const [checkoutTile, { loading: checkoutTileLoading }] = useMutation(CHECKOUT_TILE, {
    onError: err => {
      console.warn(err);
    },
  });
  const handleClose = useCallback(() => {
    if (playerTurn && playerTurn.status === 'idle') {
      playTurn({
        variables: {
          playTurnInput: {
            gameId: gameData.id,
          },
        },
      });
    }
  }, [gameData.id, playTurn, playerTurn]);

  const handleStartGame = useCallback(() => {
    startGame({
      variables: {
        startGameInput: {
          gameId: gameData.id,
        },
      },
    });
  }, [gameData.id, startGame]);

  const open = useMemo(() => {
    return status === 'started' && playerTurn && playerTurn.userId === userId && playerTurn.status === 'idle';
  }, [playerTurn, status, userId]);

  const playerTurnOpen = useMemo(() => {
    return status === 'started' && playerTurn && playerTurn.userId !== userId && playerTurn.status !== 'idle';
  }, [playerTurn, status, userId]);

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

  const cleanNotificationMessage = useCallback(() => {
    setNotificationMessage('');
  }, []);

  const handleCopyId = useCallback(() => {
    (navigator as any).clipboard.writeText(gameData.id);
    setNotificationMessage('Game Id copied to the clipboard');
  }, [gameData.id]);

  const handleCopyInvitation = useCallback(() => {
    const invitation = `Come play memory with me!

Join the Online Memory game at:
https://master.d3czed5ma25sw0.amplifyapp.com/game/${gameData.id}

Game ID: ${gameData.id}`;
    (navigator as any).clipboard.writeText(invitation);
    setNotificationMessage('Game invitation copied to the clipboard');
  }, [gameData.id]);

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
      <Snackbar open={open} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          severity="info"
          action={
            <Button color="default" size="small" onClick={handleClose}>
              PLAY
            </Button>
          }
        >
          It's your turn!
        </Alert>
      </Snackbar>

      {playerTurn && (
        <Snackbar
          open={playerTurnOpen}
          classes={{ anchorOriginBottomLeft: classes.playerTurnOpen }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert severity="info">
            {playerTurn.name[0].toUpperCase()}
            {playerTurn.name.slice(1).toLowerCase()} is playing
          </Alert>
        </Snackbar>
      )}

      {notificationMessage && (
        <Snackbar
          open={Boolean(notificationMessage)}
          autoHideDuration={2500}
          onClose={cleanNotificationMessage}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success">{notificationMessage}</Alert>
        </Snackbar>
      )}

      <Dialog
        open={Boolean(status === 'idle' && userPlayer && userPlayer.status === 'offline')}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Are you ready?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This game is ready to begin.
            <br /> Click "Let's go" when you're ready start playing
          </DialogContentText>
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
            gameCreationTime={status === 'started' ? getGameCreationTime() : undefined}
            turnTimer={status === 'started' ? getTurnTimer() : undefined}
            moves={status === 'started' ? moves : undefined}
            players={players}
            playerTurn={playerTurn}
          />

          {status === 'new' && owner === userId ? (
            <Grid justify="center" alignItems="center" direction="column" xs={12} md={9} spacing={6} item container>
              <Grid item>
                <Typography component="h4" variant="h5" align="center">
                  You are the game host
                </Typography>
              </Grid>

              <Grid item justify="center" alignItems="center" direction="column">
                <Typography variant="subtitle1" align="center">
                  Share this game id with other user: <strong>{gameData.id}</strong>
                </Typography>
                <Grid item container justify="space-evenly">
                  <Button variant="outlined" color="default" onClick={handleCopyInvitation}>
                    Copy Invitation
                  </Button>

                  <Button variant="outlined" color="default" onClick={handleCopyId}>
                    Copy Game ID
                  </Button>
                </Grid>
              </Grid>

              <Grid item direction="column" spacing={10}>
                <Grid item>
                  <Typography paragraph align="center">
                    Click <strong>"Start game"</strong> once all the users have joined
                  </Typography>
                </Grid>
                <Grid item container justify="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={handleStartGame}
                    disabled={startGameLoading}
                  >
                    Start Game
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : null}

          {status === 'new' && owner !== userId ? (
            <Grid justify="center" alignItems="center" direction="column" xs={12} md={9} spacing={10} item container>
              <Typography component="h4" variant="h6" align="center">
                Waiting for the host to start the game
              </Typography>
              <Grid item>
                <CircularProgress size={60} />
              </Grid>
            </Grid>
          ) : null}

          {status === 'idle' ? (
            <Grid direction="column" justify="center" xs={12} md={9} item container>
              <Grid item>
                <Typography component="h4" variant="h6" align="center" gutterBottom>
                  Waiting for all the players to be ready
                </Typography>
              </Grid>
              <Grid item>
                <Typography align="center" paragraph>
                  Be prepared! This game is about to start
                </Typography>
              </Grid>
            </Grid>
          ) : null}

          {playerTurn && status !== 'idle' && status !== 'new' ? (
            <Board
              board={board}
              template={template}
              tiles={tiles}
              tileSize={tileSize}
              loading={startGameLoading || checkoutTileLoading || playTurnLoading}
              disabled={
                startGameLoading ||
                playTurnLoading ||
                checkoutTileLoading ||
                playerTurn.userId !== userId ||
                playerTurn.status === 'idle'
              }
              onCheckoutTile={handleCheckOutTile}
            />
          ) : null}
        </Grid>
      </Container>
    </div>
  );
});
