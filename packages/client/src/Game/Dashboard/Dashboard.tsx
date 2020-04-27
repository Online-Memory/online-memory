import React, { memo } from 'react';
import { Avatar } from 'react-avataaars';
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Player, PlayerTurn, User } from '../types';
import { useStyles } from './styles';

interface Props {
  name: string;
  users: User[];
  gameCreationTime?: string;
  turnTimer?: string;
  moves?: number;
  players: Player[];
  playerTurn: PlayerTurn;
}

export const Dashboard: React.FC<Props> = memo(
  ({ name, moves = 0, players, users, playerTurn, gameCreationTime, turnTimer }) => {
    const classes = useStyles();

    const currPlayer: Player | undefined =
      playerTurn && players.find(player => player.userId === playerTurn.currentPlaying);

    return (
      <Grid className={`GameDashboard ${classes.container}`} item xs={12} md={3}>
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
          {moves ? 'Scoreboard' : 'Players'}
        </Typography>

        <div className={classes.scoreboardList}>
          <List component="nav">
            {players.map(player => {
              const user = users.find(user => user.id === player.userId)?.item;

              if (!user) {
                return null;
              }

              return (
                <ListItem
                  key={`player-score-${player.id}`}
                  className={currPlayer && currPlayer.id === player.id ? classes.currentPlayer : ''}
                >
                  <ListItemIcon>
                    <div className={classes.avatarWrapper}>
                      <Avatar size="40px" hash={user.avatar} className={classes.avatarIcon} />
                    </div>
                  </ListItemIcon>
                  <ListItemText
                    primary={user.displayName}
                    classes={{
                      primary:
                        currPlayer && currPlayer.id === player.id
                          ? classes.listItemCurrentPlayer
                          : classes.listItemText,
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
              );
            })}
          </List>
        </div>
      </Grid>
    );
  }
);
