import React, { memo } from 'react';
import { Container, Grid, Typography, Card, CardHeader, CardContent } from '@material-ui/core';
import { Player } from '../types';

interface Props {
  gameId: string;
  gameName: string;
  pendingPlayers: Player[];
}

export const WaitOpponents: React.FC<Props> = memo(({ gameId, gameName, pendingPlayers }) => (
  <Container maxWidth="lg">
    <Card>
      <CardHeader title={gameName} subheader={`Game ID: ${gameId}`} />
      <CardContent>
        <Grid container direction="column" spacing={2} justify="center">
          <Grid item>
            <Typography align="center" paragraph>
              Waiting for other players to join this game
            </Typography>
          </Grid>
          <Grid item>
            <Typography align="center" paragraph>
              Share this game id with the other players to start this game: <strong>{gameId}</strong>
            </Typography>
          </Grid>
          <Grid item>
            <Typography align="center" paragraph>
              Pending players:
            </Typography>
          </Grid>
          {pendingPlayers.map(player => (
            <Grid item key={`pendingPlayer-${player.id}`}>
              <Typography align="center" paragraph>
                {player.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  </Container>
));
