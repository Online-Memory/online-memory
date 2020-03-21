import React, { memo } from 'react';
import { Container, Grid } from '@material-ui/core';
import { useTiles } from './useTiles';
import { useStyles } from './styles';

export const Game = memo(() => {
  const gridSize = [10, 10];
  const classes = useStyles();
  const { gameTiles, gridX, gridY, getTile } = useTiles(gridSize[0], gridSize[1]);

  if (!gameTiles || !gameTiles.length) {
    return <div className="Game">Loading...</div>;
  }

  return (
    <div className={`Game ${classes.background}`}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid
          container
          className={classes.container}
          direction="column"
          spacing={1}
          alignItems="center"
          alignContent="center"
          justify="center"
        >
          {gridY.map((_, indexY) => (
            <Grid
              key={`col-${indexY}`}
              container
              direction="row"
              spacing={1}
              alignItems="center"
              alignContent="center"
              justify="center"
            >
              {gridX.map((_, indexX) => (
                <Grid item key={`col-${indexY}-row-${indexX}`}>
                  <div>
                    <img
                      className={classes.tile}
                      src={`tiles/${getTile(gameTiles, indexX, indexY, gridSize[1]).ref}.png`}
                      alt="Memory Tile"
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
});
