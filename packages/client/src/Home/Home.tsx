import React from 'react';
import { Link as LinkUI } from 'react-router-dom';
import { Container, Typography, Grid, Button } from '@material-ui/core';
import { useStyles } from './styles';

export const Home = () => {
  const classes = useStyles();

  return (
    <div className="Home">
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            OnLine Memory
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            COVID-19 solution for playing memory online with your friends while you're home
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <LinkUI to="/new" className={classes.linkButon}>
                  <Button variant="contained" color="primary">
                    Start new game
                  </Button>
                </LinkUI>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary">
                  Join a game
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>

      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <img alt="Memory Italia" src="./memory-italia.jpg" width="100%" className={classes.image} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
