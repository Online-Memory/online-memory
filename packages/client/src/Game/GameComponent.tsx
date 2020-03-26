import React, { memo, useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Container, Grid, Typography, Button, Snackbar } from '@material-ui/core';
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
      <Snackbar
        message="It's your turn!"
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button color="secondary" size="small" onClick={handleClose}>
            PLAY
          </Button>
        }
      />
      <Snackbar
        open={Boolean(playerTurn.userId)}
        message={playerTurn.userId !== userId ? `${playerTurn.name.toUpperCase()} is playing` : `It's your turn`}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />

      <Container maxWidth="lg">
        {isAPlayer ? (
          <Grid container spacing={1}>
            <Grid item xs={12} lg={2}>
              <Typography align="center" component="h2" variant="h4" gutterBottom>
                {name}
              </Typography>

              <Typography component="h6" variant="h6" gutterBottom>
                Scoreboard
              </Typography>
              {players.map(player => (
                <Typography
                  key={`player-score-${player.id}`}
                  className={player.userId === userId ? classes.scoreCurrentPlayer : ''}
                  gutterBottom
                >
                  <strong>{player.name}</strong>: {player.score || 0}
                </Typography>
              ))}
            </Grid>

            <Grid className={classes.container} direction="column" justify="center" item container xs={12} lg={10}>
              {gridY.map((_, indexY) => (
                <Grid key={`col-${indexY}`} justify="center" container item>
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
          </Grid>
        ) : (
          <ClaimPlayer players={players} onPlayerSelected={handlePlayerSelected} />
        )}
      </Container>
    </div>
  );
});
