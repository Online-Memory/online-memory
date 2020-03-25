import React, { memo, useCallback } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { GET_GAME, CLAIM_PLAYER, GAME_UPDATED } from '../graphql';
import { useAuth } from '../Auth/useAuth';
import { Player, GameData } from './types';
import { GameComponent } from './GameComponent';
import { useStyles } from './styles';

export const Game: React.FC = memo(() => {
  const classes = useStyles();
  const { user } = useAuth();
  const { id } = useParams();

  const { data, loading, error } = useQuery<{ getGame: GameData }>(GET_GAME, {
    variables: { gameId: id || '' },
    errorPolicy: 'ignore',
  });
  const [claimPlayer, { loading: claimPlayerLoading }] = useMutation(CLAIM_PLAYER, {
    onError: err => {
      console.warn(err);
    },
  });

  useSubscription(GAME_UPDATED, { variables: { id } });

  const handleClaimPlayer = useCallback(
    (player: Player) => {
      claimPlayer({
        variables: {
          claimPlayerInput: {
            gameId: id,
            playerId: player.id,
          },
        },
      });
    },
    [claimPlayer, id]
  );

  if (error || (!loading && !data)) {
    return (
      <div className={`GameSetup ${classes.container}`}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Grid container justify="center" className={classes.loading}>
                <Grid item>
                  <Typography>{(error && error.message) || error || 'Ops! Something went wrong'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  if (loading || claimPlayerLoading) {
    return (
      <div className={`GameSetup ${classes.container}`}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Grid container justify="center" className={classes.loading}>
                <Grid item>
                  <Typography>Loading...</Typography>
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
      <div className={`GameSetup ${classes.container}`}>
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

  return <GameComponent gameData={data.getGame} userId={user.id || ''} onClaimPlayer={handleClaimPlayer} />;
});
