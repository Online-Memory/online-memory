import React, { memo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { GET_GAME } from '../graphql';
import { GameComponent } from './GameComponent';
import { useStyles } from './styles';

export const Game: React.FC = memo(() => {
  const { id } = useParams();
  const classes = useStyles();
  const { data, loading, error } = useQuery(GET_GAME, {
    variables: { gameId: id || '' },
  });

  if (error) {
    return (
      <div className={`GameSetup ${classes.container}`}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Grid container justify="center" className={classes.loading}>
                <Grid item>
                  <Typography>{error}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  if (loading) {
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

  if (!data.getGame || !data.getGame.id) {
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

  return <GameComponent gameData={data.getGame} />;
});
