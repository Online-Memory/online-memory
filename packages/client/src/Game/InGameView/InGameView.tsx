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
import { UserData } from '../../AppState';
import { START_GAME } from '../../graphql';
import { useStyles } from './styles';
import { GameData } from '../types';
import { Dashboard } from '../Dashboard';
import { Board } from '../Board';
import { GameHost } from './GameHost';

interface Props {
  user: UserData;
  gameData: GameData;
  loading: boolean;
  onPlayTurn: () => void;
  onCheckOutTile: (tileId: string) => void;
}

export const InGameView: React.FC<Props> = memo(({ user, gameData, loading, onPlayTurn, onCheckOutTile }) => {
  const {
    name,
    players,
    users,
    playerTurn,
    board,
    tiles,
    template,
    moves,
    owner,
    status,
    updatedAt,
    startedAt,
  } = gameData;
  const classes = useStyles();
  const { tileSize, zoomIn, zoomOut } = useZoom(60);
  const [deltaGameCreation, setDeltaGameCreation] = useState(0);
  const [deltaGameUpdated, setDeltaGameUpdated] = useState(0);

  const userPlayer = players.find(player => player.userId === user.id);
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
    return status === 'started' && playerTurn && playerTurn.userId === user.id && playerTurn.status === 'idle';
  }, [playerTurn, status, user.id]);

  const playerTurnOpen = useMemo(() => {
    return status === 'started' && playerTurn && playerTurn.userId !== user.id && playerTurn.status !== 'idle';
  }, [playerTurn, status, user.id]);

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
    const deltaHours = Math.floor(deltaGameUpdated / 60 / 60);
    const deltaMinutes = Math.floor(deltaGameUpdated / 60) % 60;
    const deltaSeconds = Math.floor(deltaGameUpdated - deltaMinutes * 60);

    return `${pad(deltaHours)}:${pad(deltaMinutes)}:${pad(deltaSeconds)}`;
  }, [deltaGameUpdated, pad]);

  const handleCheckOutTile = useCallback(
    (tileId: number) => {
      if (loading) {
        return;
      }

      if (playerTurn && playerTurn.status === 'idle' && playerTurn.userId === user.id) {
        onPlayTurn();
        return;
      }

      onCheckOutTile(`${tileId}`);
    },
    [loading, onCheckOutTile, onPlayTurn, playerTurn, user.id]
  );

  const userPlaying =
    playerTurn && users.find(user => playerTurn.status !== 'idle' && user.id === playerTurn.userId)?.item;

  return (
    <div className={`Game ${classes.gameContainer}`}>
      <Snackbar open={open} className={classes.turnAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="info" color="info" elevation={8} variant="standard">
          It's your turn! Make your move
        </Alert>
      </Snackbar>

      {userPlaying && (
        <Snackbar
          open={playerTurnOpen}
          classes={{ anchorOriginBottomLeft: classes.playerTurnOpen }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert severity="info">{userPlaying.username} is playing</Alert>
        </Snackbar>
      )}

      <Dialog
        open={Boolean(status === 'idle' && userPlayer && userPlayer.status === 'offline')}
        aria-labelledby="alert-start-game-dialog-title"
        aria-describedby="alert-start-game-dialog-description"
      >
        <DialogTitle id="alert-start-game-dialog-title">Are you ready?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-start-game-dialog-description">
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
            users={users}
            playerTurn={playerTurn}
          />

          {status === 'new' && owner === user.id ? (
            <GameHost gameId={gameData.id} handleStartGame={handleStartGame} disabled={startGameLoading} />
          ) : null}

          {status === 'new' && owner !== user.id ? (
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
              loading={loading || startGameLoading}
              disabled={loading || startGameLoading || playerTurn.userId !== user.id}
              startTurn={playerTurn.userId === user.id && playerTurn.status === 'idle'}
              onCheckoutTile={handleCheckOutTile}
            />
          ) : null}
        </Grid>
      </Container>
    </div>
  );
});
