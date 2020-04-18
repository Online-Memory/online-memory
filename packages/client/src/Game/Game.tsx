import React, { memo, useCallback, useState, useRef } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, Grid, Typography, CircularProgress } from '@material-ui/core';
import { GET_GAME, CLAIM_PLAYER, GAME_UPDATED } from '../graphql';
import { useAppState } from '../AppState';
import { GameData } from './types';
import { GameComponent } from './GameComponent';
import { useStyles } from './styles';

export const Game: React.FC = memo(() => {
  const classes = useStyles();
  const { id } = useParams();
  const { user } = useAppState();
  const [loading, _setLoading] = useState(false);
  const timer = useRef<any>();

  const setLoading = useCallback(() => {
    _setLoading(true);
    if (timer && timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => _setLoading(false), 750);
  }, []);

  const { data, loading: dataLoading, error } = useQuery<{ getGame: GameData }>(GET_GAME, {
    variables: { gameId: id || '' },
    onError: err => {
      console.warn(err);
    },
  });

  const [claimPlayer, { loading: claimPlayerLoading }] = useMutation(CLAIM_PLAYER, {
    onError: err => {
      console.warn(err);
    },
  });

  const { error: subError } = useSubscription(GAME_UPDATED, {
    variables: { id },
  });

  const handleClaimPlayer = useCallback(() => {
    claimPlayer({
      variables: {
        claimPlayerInput: {
          gameId: id,
        },
      },
    });
  }, [claimPlayer, id]);

  if (error || subError) {
    return (
      <div className={`Game ${classes.gameContainer}`}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Grid container justify="center" className={classes.loading}>
                <Grid item>
                  <Typography>
                    Ops! Something went wrong. Try to refresh this page or make sure this game really exists
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  if (dataLoading || claimPlayerLoading || !user || !user.id) {
    return (
      <div className={`Game ${classes.gameContainer}`}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Grid container justify="center" className={classes.loading}>
                <Grid container justify="center" className={classes.loading}>
                  <CircularProgress size={60} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  if (!data || !data.getGame || !data.getGame.id) {
    return (
      <div className={`Game ${classes.gameContainer}`}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Grid container justify="center" className={classes.loading}>
                <Grid item>
                  <Typography>Invalid game. Please make sure this game id exists</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <GameComponent
      gameData={data.getGame}
      user={user}
      onClaimPlayer={handleClaimPlayer}
      loading={loading}
      onSetLoading={setLoading}
    />
  );
});
