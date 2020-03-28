import React, { memo } from 'react';
import { Container, Grid, Typography, Card, CardHeader, CardContent } from '@material-ui/core';
import { useStyles } from '../styles';
import { Player } from '../types';

interface Props {
  gameName: string;
  winningPlayer: Player;
  players: Player[];
  endGameTime: string;
}

export const WinningView: React.FC<Props> = memo(({ winningPlayer, players, gameName, endGameTime }) => {
  const classes = useStyles();

  return (
    <div className={`Game ${classes.container}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader
            title={gameName}
            subheader={`Game ended on ${new Date(endGameTime).toDateString()} at ${new Date(
              endGameTime
            ).toLocaleTimeString()}`}
          />
          <CardContent>
            <Grid container alignContent="center" alignItems="center" direction="column" spacing={4}>
              <Grid item>
                <Typography align="center" component="h2" variant="h3" gutterBottom>
                  {winningPlayer.name[0].toUpperCase()}
                  {winningPlayer.name.slice(1).toLocaleLowerCase()} won this game with {winningPlayer.score} points!
                </Typography>
              </Grid>

              <Grid item xs={10}>
                <img src="/trophy.gif" alt="trophy" width="180" />
              </Grid>

              <Grid item xs={10}>
                {players.map((player, index) => (
                  <Typography key={`player_score-${player.id}`} paragraph>
                    {index + 1}.{' '}
                    <strong>
                      {player.name[0].toUpperCase()}
                      {player.name.slice(1).toLocaleLowerCase()}
                    </strong>
                    's score: {player.score} points
                  </Typography>
                ))}
              </Grid>
              <Grid item></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
});
