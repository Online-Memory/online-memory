import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useStyles } from '../styles';
import { Player } from '../types';

interface Props {
  name: string;
  players: Player[];
  userId: string;
  turnPlayerId: string;
}

export const Dashboard: React.FC<Props> = ({ name, players, userId, turnPlayerId }) => {
  const classes = useStyles();

  return (
    <Grid className={classes.container} item xs={12} lg={3}>
      <Typography className={classes.scoreboardTitle} align="center" component="h2" variant="h4" gutterBottom>
        {name}
      </Typography>

      <Typography component="h6" variant="h6" gutterBottom>
        Scoreboard
      </Typography>
      {players.map(player => (
        <Typography
          key={`player-score-${player.id}`}
          className={player.userId === userId ? classes.scoreCurrentPlayer : ''}
          gutterBottom
        >
          {(turnPlayerId === player.id && <span>►&nbsp;&nbsp;</span>) || (
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          )}
          <strong>{player.name}</strong>: {player.score || 0}
        </Typography>
      ))}
    </Grid>
  );
};
