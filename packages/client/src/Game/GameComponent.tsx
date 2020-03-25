import React, { memo, useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  Container,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { PLAY_TURN } from '../graphql';
import { ClaimPlayer } from './ClaimPlayer';
import { WaitOpponents } from './WaitOpponents';
import { TileComponent } from './Tile';
import { Player, GameData, Tile } from './types';
import { useStyles } from './styles';

interface Props {
  userId: string;
  gameData: GameData;
  onClaimPlayer: (player: Player) => void;
}

export const GameComponent: React.FC<Props> = memo(({ gameData, userId, onClaimPlayer }) => {
  const { name, players, playerTurn, board, tiles } = gameData;
  const classes = useStyles();

  const [playTurn] = useMutation(PLAY_TURN, {
    onError: err => {
      console.warn(err);
    },
  });

  const open = useMemo(() => {
    return playerTurn.userId === userId && !playerTurn.turn;
  }, [playerTurn.turn, playerTurn.userId, userId]);

  const handleClose = () => {
    playTurn({
      variables: {
        playTurnInput: {
          gameId: gameData.id,
        },
      },
    });
  };

  const gridX = new Array(board.gridX).fill('');
  const gridY = new Array(board.gridY).fill('');
  const isAPlayer = Boolean(players.find(player => player.userId === userId));
  const pendingPlayers = players.filter(player => !player.userId);

  const handlePlayerSelected = useCallback(
    (player: Player) => {
      onClaimPlayer(player);
    },
    [onClaimPlayer]
  );

  const getTile = useCallback((tiles: Tile[], posX: number, posY: number, boardX: number) => {
    const id = boardX * posY + posX;

    return tiles[id];
  }, []);

  return isAPlayer && pendingPlayers.length ? (
    <div className={`Game ${classes.container}`}>
      <WaitOpponents gameId={gameData.id} gameName={name} pendingPlayers={pendingPlayers} />
    </div>
  ) : (
    <div className={`Game ${classes.container}`}>
      <Container maxWidth="lg">
        {!pendingPlayers.length && (
          <Typography paragraph gutterBottom>
            It's <strong>{playerTurn.name.toUpperCase()}'s</strong> turn!
          </Typography>
        )}

        <Typography align="center" component="h2" variant="h4" gutterBottom>
          {name}
        </Typography>

        {players.map(player => (
          <Typography key={`player-score-${player.id}`} gutterBottom>
            {player.name} - {player.score || 0}
          </Typography>
        ))}

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"It's your turn!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              It's your turn to play!
              <br />
              Press 'Play' to make your move
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Play
            </Button>
          </DialogActions>
        </Dialog>

        {isAPlayer ? (
          <Grid className={classes.container} direction="column" justify="center" spacing={1} container>
            {gridY.map((_, indexY) => (
              <Grid key={`col-${indexY}`} spacing={1} justify="center" container item>
                {gridX.map((_, indexX) => (
                  <Grid item key={`col-${indexY}-row-${indexX}`}>
                    <TileComponent
                      userId={userId}
                      gameId={gameData.id}
                      playerTurn={playerTurn}
                      tile={getTile(tiles, indexX, indexY, board.gridX)}
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        ) : (
          <ClaimPlayer players={players} onPlayerSelected={handlePlayerSelected} />
        )}
      </Container>
    </div>
  );
});
