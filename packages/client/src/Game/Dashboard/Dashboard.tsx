import React, { memo } from 'react';
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
import { Player, PlayerTurn } from '../types';
import { useStyles } from './styles';

interface Props {
  name: string;
  gameCreationTime?: string;
  turnTimer?: string;
  moves?: number;
  players: Player[];
  playerTurn: PlayerTurn;
}

export const Dashboard: React.FC<Props> = memo(
  ({ name, moves = 0, players, playerTurn, gameCreationTime, turnTimer }) => {
    const classes = useStyles();

    const currPlayer: Player | undefined =
      playerTurn && players.find(player => player.userId === playerTurn.currentPlaying);

    return (
      <Grid className={classes.container} item xs={12} md={3}>
        <Typography className={classes.scoreboardTitle} align="center" component="h2" variant="h4" gutterBottom>
          {name}
        </Typography>

        {gameCreationTime ? (
          <Typography paragraph gutterBottom>
            Game timer: {gameCreationTime}
          </Typography>
        ) : null}

        {turnTimer ? (
          <Typography paragraph gutterBottom>
            Turn timer: {turnTimer}
          </Typography>
        ) : null}

        {moves ? (
          <Typography paragraph gutterBottom>
            Total tiles flipped: {moves}
          </Typography>
        ) : null}

        <Typography component="h6" variant="h6">
          {moves ? 'Scoreboard' : 'Players joined'}
        </Typography>

        <div className={classes.scoreboardList}>
          <List component="nav">
            {players.map(player => (
              <ListItem
                key={`player-score-${player.id}`}
                className={currPlayer && currPlayer.id === player.id ? classes.currentPlayer : ''}
              >
                <ListItemIcon>
                  {(currPlayer && currPlayer.id === player.id && (
                    <ArrowRightIcon className={classes.currentPlayer} />
                  )) || <span></span>}
                </ListItemIcon>
                <ListItemText
                  primary={player.name}
                  classes={{
                    primary:
                      currPlayer && currPlayer.id === player.id ? classes.listItemCurrentPlayer : classes.listItemText,
                  }}
                />
                {moves ? (
                  <ListItemSecondaryAction>
                    <Typography className={currPlayer && currPlayer.id === player.id ? classes.currentPlayer : ''}>
                      {player.pairs || 0}
                    </Typography>
                  </ListItemSecondaryAction>
                ) : null}
              </ListItem>
            ))}
          </List>
        </div>
      </Grid>
    );
  }
);
