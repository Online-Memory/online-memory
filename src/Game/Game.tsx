import React, { memo, useCallback } from 'react';
import { Container, Grid } from '@material-ui/core';
import { useTiles } from './useTiles';
import { useStyles } from './styles';

export const Game = memo(() => {
  const gridSize = [10, 10];
  const classes = useStyles();
  const { gameTiles, gridX, gridY, getTile, checkoutTile } = useTiles(gridSize[0], gridSize[1]);
  const handleTileSelected = useCallback(
    tile => () => {
      checkoutTile(tile);
    },
    [checkoutTile]
  );

  if (!gameTiles || !gameTiles.length) {
    return <div className="Game">Loading...</div>;
  }

  return (
    <div className={`Game ${classes.container}`}>
      <Container maxWidth="lg">
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
                          src={`tiles/${tile.status === 'show' ? tile.ref : '000'}.png`}
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
      </Container>
    </div>
  );
});
