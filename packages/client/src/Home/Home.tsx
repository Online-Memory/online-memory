import React, { useState, useCallback } from 'react';
import { Link as LinkUI, useHistory } from 'react-router-dom';
import { Container, Typography, Grid, Button, TextField } from '@material-ui/core';
import { useStyles } from './styles';

export const Home = () => {
  const classes = useStyles();
  const history = useHistory();

  const [joinGame, setJoinGame] = useState(false);
  const [joinGameId, setJoinGameId] = useState('');

  const handleJoinGameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setJoinGameId(event.target.value);
  }, []);

  const handleJoinGameToggle = useCallback(() => {
    setJoinGame(joinGameStatus => !joinGameStatus);
  }, []);

  const handleJoinGame = useCallback(() => {
    history.push(`/game/${joinGameId}`);
  }, [history, joinGameId]);

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
            <Grid container spacing={4} justify="center">
              <Grid item>
                <LinkUI to="/new" className={classes.linkButon}>
                  <Button variant="contained" color="primary">
                    Start new game
                  </Button>
                </LinkUI>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary" onClick={handleJoinGameToggle}>
                  Join a game
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item></Grid>
            </Grid>
            {joinGame && (
              <Grid container spacing={1} justify="center" alignItems="center">
                <Grid item xs>
                  <TextField
                    type="text"
                    variant="outlined"
                    inputProps={{ maxLength: 32 }}
                    value={joinGameId}
                    label="Game ID"
                    onChange={handleJoinGameChange}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleJoinGame}>
                    Join
                  </Button>
                </Grid>
              </Grid>
            )}
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
