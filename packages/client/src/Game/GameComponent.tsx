import React, { memo, useCallback } from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
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
  const classes = useStyles();
  const { name, players, playerTurn, board, tiles } = gameData;

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
            It's <strong>{playerTurn.name.toUpperCase()}</strong> turn!
          </Typography>
        )}

        <Typography align="center" component="h2" variant="h4" gutterBottom>
          {name}
        </Typography>

        {isAPlayer ? (
          <Grid className={classes.container} direction="column" justify="center" spacing={1} container>
            {gridY.map((_, indexY) => (
              <Grid key={`col-${indexY}`} spacing={1} justify="center" container item>
                {gridX.map((_, indexX) => (
                  <Grid item key={`col-${indexY}-row-${indexX}`}>
                    <TileComponent
                      userId={userId}
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
