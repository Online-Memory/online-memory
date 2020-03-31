import React from 'react';
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { Player } from '../types';
import { useStyles } from './styles';

interface Props {
  name: string;
  gameCreationTime: string;
  turnTimer: string;
  moves: number;
  players: Player[];
  playerTurn: Player;
}

export const Dashboard: React.FC<Props> = ({ name, moves, players, playerTurn, gameCreationTime, turnTimer }) => {
  const classes = useStyles();
  const currPlayerIdPlayingIndex = players.findIndex(player => player.id === playerTurn.id);
  let currPlayerPlaying = playerTurn.turn
    ? players[currPlayerIdPlayingIndex]
    : currPlayerIdPlayingIndex - 1 >= 0
    ? players[currPlayerIdPlayingIndex - 1]
    : players[players.length - 1];

  if (!moves) {
    currPlayerPlaying = players[0];
  }

  return (
    <Grid className={classes.container} item xs={12} lg={3}>
      <Typography className={classes.scoreboardTitle} align="center" component="h2" variant="h4" gutterBottom>
        {name}
      </Typography>

      <Typography paragraph gutterBottom>
        Game timer: {gameCreationTime}
      </Typography>

      <Typography paragraph gutterBottom>
        Turn timer: {turnTimer}
      </Typography>

      <Typography paragraph gutterBottom>
        Total tiles flipped: {moves}
      </Typography>

      <Typography component="h6" variant="h6">
        Scoreboard
      </Typography>

      <div className={classes.scoreboardList}>
        <List component="nav">
          {players.map(player => (
            <ListItem
              key={`player-score-${player.id}`}
              className={currPlayerPlaying.id === player.id ? classes.currentPlayer : ''}
            >
              <ListItemIcon>
                {(currPlayerPlaying.id === player.id && (
                  <ArrowRightIcon fontSize="large" className={classes.currentPlayer} />
                )) || <span></span>}
              </ListItemIcon>
              <ListItemText
                primary={player.name}
                classes={{ primary: currPlayerPlaying.id === player.id ? classes.currentPlayer : '' }}
              />
              <ListItemSecondaryAction>
                <Typography className={currPlayerPlaying.id === player.id ? classes.currentPlayer : ''}>
                  {player.score || 0}
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </Grid>
  );
};
