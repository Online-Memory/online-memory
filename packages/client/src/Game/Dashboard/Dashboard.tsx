import React, { memo, useState, useCallback, useRef } from 'react';
import { Avatar } from 'react-avataaars';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
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
    const [minimize, setMinimize] = useState(false);
    const [showFullContent, setShowFullContent] = useState(true);
    const timeout = useRef<NodeJS.Timeout>();

    const currPlayer: Player | undefined =
      playerTurn && players.find(player => player.userId === playerTurn.currentPlaying);

    const handleMinimize = useCallback(() => {
      setMinimize(!minimize);
      if (timeout && timeout.current) {
        clearTimeout(timeout.current);
      }

      if (!minimize) {
        timeout.current = setTimeout(() => setShowFullContent(false), 500);
      } else {
        timeout.current = setTimeout(() => setShowFullContent(true), 500);
      }
    }, [minimize]);

    return (
      <div className={`GameDashboard ${classes.container} ${minimize ? classes.containerMinimized : null}`}>
        <IconButton
          aria-label="toggle dashboard"
          className={`${classes.toggleDashboardButton} ${minimize ? classes.toggleDashboardButtonMinimized : null}`}
          size="medium"
          onClick={handleMinimize}
        >
          <Tooltip title="Toggle dashboard" aria-label="Toggle dashboard" placement="top">
            <ChevronLeft
              fontSize="inherit"
              className={`${classes.toggleDashboardIcon} ${minimize ? classes.toggleDashboardIconMinimized : null}`}
            />
          </Tooltip>
        </IconButton>

        {showFullContent ? (
          <div
            className={`${classes.dashboardContent} ${
              minimize ? classes.dashboardContentHidden : classes.dashboardContentVisible
            }`}
          >
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
                          <Typography
                            className={currPlayer && currPlayer.id === player.id ? classes.currentPlayer : ''}
                          >
                            {player.pairs || 0}
                          </Typography>
                        </ListItemSecondaryAction>
                      ) : null}
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </div>
        ) : (
          <>
            {players.map(player => {
              const user = users.find(user => user.id === player.userId)?.item;

              if (!user) {
                return null;
              }

              return (
                <div key={`player-score-${player.id}`}>
                  <div className={classes.avatarWrapper}>
                    <Avatar size="40px" hash={user.avatar} className={classes.avatarIcon} />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  }
);
