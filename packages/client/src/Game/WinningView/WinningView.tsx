import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
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

interface Props {
  gameData: GameData;
}

export const WinningView: React.FC<Props> = memo(({ gameData }) => {
  const classes = useStyles();
  const history = useHistory();
  const winningPlayersOrdered = gameData.players.sort(
    (playerA, playerB) => (playerB.pairs || 0) - (playerA.pairs || 0)
  );
  const winningPlayerScore = winningPlayersOrdered[0].pairs;
  const winningPlayers = winningPlayersOrdered.filter(player => player.pairs === winningPlayerScore);
  const endGameTime = gameData.updatedAt;
  const gameLengthTimestamp = (new Date(endGameTime).valueOf() - new Date(gameData.startedAt).valueOf()) / 1000;

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
    history.push('/new');
  }, [history]);

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
                        <Typography component="span" variant="h3">
                          {gameData.users.find(user => user.id === winningPlayer.userId)?.item.username},{' '}
                        </Typography>
                      ))}
                    </Typography>
                    <Typography align="center" component="h2" variant="h3" gutterBottom>
                      won this game with {winningPlayers[0].pairs} points!
                    </Typography>
                  </>
                ) : (
                  <Typography align="center" component="h2" variant="h3" gutterBottom>
                    {gameData.users.find(user => user.id === winningPlayers[0].userId)?.item.username} won this game
                    with {winningPlayers[0].pairs} points!
                  </Typography>
                )}
              </Grid>

              <Grid item xs={10}>
                <img src={trophy} alt="trophy" width="180" />
              </Grid>

              <Grid item container xs={10} md={6} justify="center">
                <div className={classes.scoreboardList}>
                  <List component="nav">
                    {gameData.players.map(player => {
                      const user = gameData.users.find(user => user.id === player.userId)?.item;
                      return (
                        user && (
                          <ListItem key={`player_score-${player.id}`}>
                            <ListItemIcon>
                              <div className={classes.avatarWrapper}>
                                <Avatar size="40px" hash={user.avatar} className={classes.avatarIcon} />
                              </div>
                            </ListItemIcon>
                            <ListItemText
                              primary={user.username}
                              secondary={`${player.pairs || 0} ${player.pairs === 1 ? 'match' : 'matches'} found`}
                            />
                          </ListItem>
                        )
                      );
                    })}
                  </List>
                </div>
              </Grid>
              <Grid item xs={10}>
                <Typography component="h6" variant="h6">
                  This was a {gameData.tiles.length} tiles game
                </Typography>
                <Typography component="h6" variant="h6">
                  Game duration: {getGameLength()}
                </Typography>
                <Typography component="h6" variant="h6">
                  Tiles flipped: {`${gameData.moves}`}
                </Typography>
              </Grid>
            </Grid>

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
          </CardContent>
        </Card>
      </Container>
    </div>
  );
});
