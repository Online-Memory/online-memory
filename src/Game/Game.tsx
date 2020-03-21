import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, AppBar, Toolbar, Grid, Button, Link } from '@material-ui/core';
import { Tile, getTiles } from './tiles';

const useStyles = makeStyles(theme => ({
  background: {
    background: '#CCC',
    height: '100%',
  },
  container: {
    height: '100%',
  },
  tile: {
    width: '80px',
    height: '80px',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const getTile = (tiles: Tile[], posX: number, posY: number, gridX: number): Tile => {
  const id = gridX * posY + posX;

  return tiles[id];
};

export const Game = () => {
  const gridSize = [10, 10];
  const classes = useStyles();
  const { gameTiles, gridX, gridY } = getTiles(gridSize[0], gridSize[1]);

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
};
