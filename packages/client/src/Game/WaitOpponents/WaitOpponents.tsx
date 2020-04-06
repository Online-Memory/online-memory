import React, { memo } from 'react';
import { Container, Grid, Typography, Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core';
import { Player } from '../types';
import { useStyles } from './styles';

interface Props {
  gameId: string;
  gameName: string;
  players: Player[];
  onStartGame: () => void;
}

export const WaitOpponents: React.FC<Props> = memo(({ gameId, gameName, players, onStartGame }) => {
  const classes = useStyles();

  return (
    <div className={`WaitOpponents ${classes.gameContainer}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader title={gameName} subheader={`Game ID: ${gameId}`} />
          <CardContent>
            <Grid container direction="column" spacing={1} justify="center">
              <Grid item>
                <Typography align="center" paragraph>
                  Waiting for other players to join this game
                </Typography>
                <Typography align="center" paragraph>
                  Share this game id with the other players to start this game: <strong>{gameId}</strong>
                </Typography>
              </Grid>
              <Grid item>
                <Typography align="center" paragraph>
                  Players joined so far:
                </Typography>
              </Grid>
              <Grid item>
                {players.map(player => (
                  <Typography key={`pendingPlayer-${player.id}`} align="center" paragraph>
                    {player.name}
                  </Typography>
                ))}
              </Grid>

              <Grid item>
                <Typography align="center" paragraph>
                  You are the game host. Click <strong>"Start game"</strong> when all the user have joined the game to
                  start playing
                </Typography>
              </Grid>
            </Grid>
          </CardContent>

          <CardActions className={classes.cardActions}>
            <Button color="primary" onClick={onStartGame}>
              Start
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
});
