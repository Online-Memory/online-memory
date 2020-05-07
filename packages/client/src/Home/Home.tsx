import React, { useState, useCallback, useRef, memo } from 'react';
import { Link as LinkUI, useHistory } from 'react-router-dom';
import { Container, Typography, Grid, Button, TextField } from '@material-ui/core';
import { useAppState } from '../AppState';
import { useStyles } from './styles';
import spinningWorld from '../assets/img/world_spinning.gif';
export const Home: React.FC = memo(() => {
  const classes = useStyles();
  const history = useHistory();
  const { user, world } = useAppState();
  const inputRef = useRef<HTMLTextAreaElement>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [joinGame, setJoinGame] = useState(false);
  const [joinGameId, setJoinGameId] = useState('');

  const handleJoinGameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setJoinGameId(event.target.value);
  }, []);

  const focusInput = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => inputRef && inputRef.current && inputRef.current.focus(), 0);
  }, []);

  const handleJoinGameToggle = useCallback(async () => {
    setJoinGame(joinGameStatus => !joinGameStatus);

    if (!joinGame) {
      await focusInput();
    }
  }, [focusInput, joinGame]);

  const handleJoinGame = useCallback(() => {
    history.push(`/game/${joinGameId}`);
  }, [history, joinGameId]);

  return (
    <div className="Home">
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container direction="column" justify="space-around" spacing={4}>
          <Grid container direction="column">
            {user?.username && world?.onlineUsers && (
              <>
                <Typography component="h2" variant="h4" align="center" gutterBottom>
                  Welcome back, {user.username}!
                </Typography>
                <Typography className={classes.underTitle} component="h4" variant="h5" align="center" gutterBottom>
                  {world.onlineUsers === 2 ? 'There is' : 'There are'} {world.onlineUsers - 1} other users online
                </Typography>
              </>
            )}
          </Grid>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <img src={spinningWorld} alt="WMC logo spinning" />
            </Grid>
          </Grid>
          <Grid item>
            <Typography
              className={classes.punchLine}
              component="h3"
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Let's play memory!
            </Typography>

            <Typography
              className={classes.underTitle}
              component="h4"
              variant="h6"
              align="center"
              color="textSecondary"
              gutterBottom
            >
              Spread the love, not the virus
            </Typography>
          </Grid>
          <div className={classes.heroButtons}>
            <Grid container direction="row" justify="space-around" alignItems="center">
              <Grid item>
                <LinkUI to="/new" className={classes.linkButton}>
                  <Button className={classes.buttonHome} variant="contained" color="primary">
                    Start new game
                  </Button>
                </LinkUI>
              </Grid>
              <Grid item>
                <Button
                  className={classes.buttonHome}
                  variant="outlined"
                  color="primary"
                  onClick={handleJoinGameToggle}
                >
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
                    inputRef={inputRef}
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
        </Grid>
      </Container>
    </div>
  );
});
