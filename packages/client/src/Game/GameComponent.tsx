import React, { memo, useCallback } from 'react';
import { Container, Grid, Typography, Card, CardHeader, CardContent } from '@material-ui/core';
import { ClaimPlayer } from './ClaimPlayer/ClaimPlayer';
import { useTiles } from './useTiles';
import { useStyles } from './styles';
import { Player, GameData } from './types';

interface Props {
  userId: string;
  gameData: GameData;
  onClaimPlayer: (player: Player) => void;
}
export const GameComponent: React.FC<Props> = memo(({ gameData, userId, onClaimPlayer }) => {
  const classes = useStyles();
  const gridSize = [10, 10];
  const { gameTiles, gridX, gridY, getTile, checkoutTile } = useTiles(gridSize[0], gridSize[1]);
  const { name, players } = gameData;

  const handleTileSelected = useCallback(
    tile => () => {
      checkoutTile(tile);
    },
    [checkoutTile]
  );

  const handlePlayerSelected = useCallback(
    (player: Player) => {
      onClaimPlayer(player);
    },
    [onClaimPlayer]
  );

  if (!gameTiles || !gameTiles.length) {
    return <div className={`Game ${classes.container}`}>Loading...</div>;
  }

  const isAPlayer = Boolean(players.find(player => player.userId === userId));
  const pendingPlayers = players.filter(player => !player.userId);

  return isAPlayer && pendingPlayers.length ? (
    <div className={`Game ${classes.container}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader title={name} subheader={`Game ID: ${gameData.id}`} />
          <CardContent>
            <Grid container direction="column" spacing={2} justify="center">
              <Grid item>
                <Typography align="center" paragraph>
                  Waiting for other players to join this game
                </Typography>
              </Grid>
              <Grid item>
                <Typography align="center" paragraph>
                  Share this game id with the other players to start this game: <strong>{gameData.id}</strong>
                </Typography>
              </Grid>
              <Grid item>
                <Typography align="center" paragraph>
                  Pending players:
                </Typography>
              </Grid>
              {pendingPlayers.map(player => (
                <Grid item key={`pendingPlayer-${player.id}`}>
                  <Typography align="center" paragraph>
                    {player.name}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  ) : (
    <div className={`Game ${classes.container}`}>
      <Container maxWidth="lg">
        <Typography align="center" component="h2" variant="h4">
          {name}
        </Typography>

        {isAPlayer ? (
          <Grid className={classes.container} direction="column" justify="center" spacing={1} container>
            {gridY.map((_, indexY) => (
              <Grid key={`col-${indexY}`} spacing={1} justify="center" container item>
                {gridX.map((_, indexX) => {
                  const tile = getTile(gameTiles, indexX, indexY, gridSize[1]);
                  return (
                    <Grid item key={`col-${indexY}-row-${indexX}`}>
                      <div className={classes.tileBox}>
                        {!tile.owner && (
                          <img
                            className={classes.tile}
                            src={`/tiles/${tile.status === 'show' ? tile.ref : '000'}.png`}
                            alt="Memory Tile"
                            onClick={handleTileSelected(tile)}
                          />
                        )}
                      </div>
                    </Grid>
                  );
                })}
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
