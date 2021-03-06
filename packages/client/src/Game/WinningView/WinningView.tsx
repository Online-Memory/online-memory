import React, { memo, useCallback } from 'react';
import { Avatar } from 'react-avataaars';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@material-ui/core';
import { useStyles } from './styles';
import { GameData } from '../types';
import trophy from '../../assets/img/trophy.gif';
import { useAppState } from '../../AppState';

interface Props {
  gameData: GameData;
}

export const WinningView: React.FC<Props> = memo(({ gameData }) => {
  const classes = useStyles();
  const { user, playAgain } = useAppState();

  const { players, owner } = gameData;

  const winningPlayersOrdered = [...players].sort((playerA, playerB) => (playerB.pairs || 0) - (playerA.pairs || 0));
  const winningPlayerScore = winningPlayersOrdered[0].pairs;
  const winningPlayers = winningPlayersOrdered.filter(player => player.pairs === winningPlayerScore);
  const endGameTime = gameData.updatedAt;
  const gameLengthTimestamp = (new Date(endGameTime).valueOf() - new Date(gameData.startedAt).valueOf()) / 1000;
  const longestStreak = [...players].sort((playerA, playerB) => (playerB.streak || 0) - (playerA.streak || 0));
  const longestStreakPlayers = longestStreak.filter(player => player.streak === longestStreak[0].streak);

  const pad = (num: number) => {
    return ('0' + num).slice(-2);
  };

  const getGameLength = () => {
    const deltaHours = Math.floor(gameLengthTimestamp / 60 / 60);
    const deltaMinutes = Math.floor(gameLengthTimestamp / 60) % 60;
    const deltaSeconds = Math.floor(gameLengthTimestamp - deltaMinutes * 60);

    return `${pad(deltaHours)}:${pad(deltaMinutes)}:${pad(deltaSeconds)}`;
  };

  const handlePlayAgain = useCallback(() => {
    const { users, name, ...gameDataRest } = gameData;

    let updatedName = `${name} #2`;
    let version = 1;
    const isAReplay = name.match(/#(\d+)$/);
    if (isAReplay && isAReplay[1]) {
      version = Number(isAReplay[1]) + 1;
      updatedName = name.replace(/#\d+$/, `#${version}`);
    }

    const filteredUsers = users.filter(currUser => currUser.id !== user.id);

    playAgain({ ...gameDataRest, name: updatedName, users: filteredUsers });
  }, [gameData, playAgain, user.id]);

  return (
    <div className={`WinningGame ${classes.container}`}>
      <Container maxWidth="lg">
        <Card elevation={3}>
          <CardHeader
            title={gameData.name}
            subheader={`Game ended on ${new Date(endGameTime).toDateString()} at ${new Date(
              endGameTime
            ).toLocaleTimeString()}`}
          />
          <CardContent>
            <Grid
              container
              className={classes.grid}
              alignContent="center"
              alignItems="center"
              direction="column"
              spacing={5}
            >
              <Grid item>
                {winningPlayers.length > 1 ? (
                  <>
                    <Typography align="center" component="h2" variant="h3" gutterBottom>
                      It's a tie!
                    </Typography>
                    <Typography align="center" component="h2" variant="h3">
                      {winningPlayers.map(winningPlayer => (
                        <Typography key={winningPlayer.userId} component="span" variant="h3">
                          {gameData.users.find(user => user.id === winningPlayer.userId)?.item.displayName},{' '}
                        </Typography>
                      ))}
                    </Typography>
                    <Typography align="center" component="h2" variant="h3" gutterBottom>
                      won this game with {winningPlayers[0].pairs} points!
                    </Typography>
                  </>
                ) : (
                  <Typography align="center" component="h2" variant="h3" gutterBottom>
                    {gameData.users.find(user => user.id === winningPlayers[0].userId)?.item.displayName} won this game
                    with {winningPlayers[0].pairs} points!
                  </Typography>
                )}
              </Grid>

              <Grid item xs={10}>
                <img src={trophy} alt="trophy" width="180" />
              </Grid>

              <Grid item container xs={10} md={6} justify="center">
                <div className={classes.scoreboardList}>
                  <List component="nav" className={classes.listWrapper}>
                    {winningPlayersOrdered.map((player, index) => {
                      const user = gameData.users.find(user => user.id === player.userId)?.item;
                      return (
                        user && (
                          <ListItem
                            divider={index + 1 === winningPlayersOrdered.length ? false : true}
                            key={`player_score-${player.id}`}
                          >
                            <ListItemIcon>
                              <div className={classes.avatarWrapper}>
                                <Avatar size="40px" hash={user.avatar} className={classes.avatarIcon} />
                              </div>
                            </ListItemIcon>
                            <ListItemText primary={user.displayName} secondary={`Longest streak: ${player.streak}`} />
                            <ListItemText classes={{ root: classes.listItemMatches }}>{`${player.pairs || 0} ${
                              player.pairs === 1 ? 'match' : 'matches'
                            } found`}</ListItemText>
                          </ListItem>
                        )
                      );
                    })}
                  </List>
                </div>
              </Grid>
              <Grid item xs={10}>
                <Typography component="h6" variant="h6" gutterBottom>
                  This was a {gameData.tiles.length} tiles game
                </Typography>
                <Typography component="h6" paragraph>
                  The longest streak with <strong>{longestStreak[0].streak}</strong> tiles found in a row was scored by{' '}
                  <strong>
                    {longestStreakPlayers.length > 1
                      ? longestStreakPlayers
                          .reduce((store: any, curr: any) => {
                            return [...store, gameData?.users.find(user => user.id === curr.userId)?.item.displayName];
                          }, [])
                          .join(', ')
                      : gameData?.users.find(user => user.id === longestStreakPlayers[0].userId)?.item.displayName}
                  </strong>
                </Typography>
                <Typography component="h6" paragraph>
                  Game duration: {getGameLength()}
                </Typography>
                <Typography component="h6" paragraph>
                  Tiles flipped: {`${gameData.moves}`}
                </Typography>
              </Grid>
            </Grid>

            {user.id === owner ? (
              <Grid
                container
                className={classes.grid}
                alignContent="center"
                alignItems="center"
                direction="column"
                spacing={5}
              >
                <Button size="large" color="primary" variant="outlined" onClick={handlePlayAgain}>
                  Play Again
                </Button>
              </Grid>
            ) : null}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
});
