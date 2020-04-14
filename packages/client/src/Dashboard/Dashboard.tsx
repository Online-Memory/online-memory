import React, { useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  // IconButton,
} from '@material-ui/core';
// import DeleteIcon from '@material-ui/icons/Delete';
import { useStyles } from './styles';
import { GET_USER_GAMES } from '../graphql';
import { UserGames } from '../AppState';

export const Dashboard: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { data, error, loading } = useQuery<{ getUserGames: UserGames }>(GET_USER_GAMES, {
    onError: err => {
      console.warn(err);
    },
    fetchPolicy: 'no-cache',
  });

  const handleGoToGame = useCallback(
    (gameId: string) => () => {
      history.push(`/game/${gameId}`);
    },
    [history]
  );

  // const handleDeleteGame = useCallback(
  //   (gameId: string) => () => {
  //     console.warn(gameId);
  //   },
  //   []
  // );

  if (error) {
    return (
      <Grid container justify="center" className={classes.loading}>
        <Typography>Ops! Something went wrong. Try again later</Typography>
      </Grid>
    );
  }

  if (loading || !data) {
    return (
      <Grid container justify="center" className={classes.loading}>
        <CircularProgress size={60} />
      </Grid>
    );
  }

  const {
    getUserGames: { activeGames, completedGames },
  } = data;

  return (
    <div className={`Dashboard ${classes.container}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader title="Your Dashboard" />

          <CardContent>
            <Container maxWidth="sm">
              <Grid container direction="column" spacing={6}>
                <Typography align="center" gutterBottom>
                  You have {activeGames.length} active {activeGames.length === 1 ? 'game' : 'games'} and{' '}
                  {completedGames?.length} played {completedGames?.length === 1 ? 'game' : 'games'}.
                </Typography>

                <Grid item container direction="column">
                  <Grid item>
                    <Typography component="h4" variant="h6" align="center">
                      Your Active Games
                    </Typography>
                    <Typography variant="caption" align="center" paragraph>
                      Games can only be deleted when they are not started or after 1 day of inactivity.
                      <br />
                      Multi-player games will remain visible for the other users.
                    </Typography>
                  </Grid>

                  <Grid item>
                    <List component="nav" className={classes.scoreboardList}>
                      {activeGames.map((game: any) => (
                        <ListItem key={game.id} className={classes.scoreboardListItem} alignItems="flex-start" button>
                          <ListItemText
                            primary={game.name}
                            secondary={`Created ${new Date(game.createdAt).toDateString()}`}
                          />
                          <ListItemSecondaryAction>
                            {/* <IconButton
                              aria-label="delete"
                              className={classes.delete}
                              onClick={handleDeleteGame(game.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton> */}
                            <Button size="small" variant="outlined" color="primary" onClick={handleGoToGame(game.id)}>
                              Go
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>

                <Grid item container direction="column">
                  <Grid item>
                    <Typography component="h4" variant="h6" align="center" gutterBottom>
                      Your Played Games
                    </Typography>
                  </Grid>

                  <Grid item>
                    <List component="nav" className={classes.scoreboardList}>
                      {completedGames.map((game: any) => (
                        <ListItem key={game.id} className={classes.scoreboardListItem} alignItems="flex-start" button>
                          <ListItemText
                            primary={game.name}
                            secondary={`Created ${new Date(game.createdAt).toDateString()}`}
                          />
                          <ListItemSecondaryAction>
                            <Button size="small" variant="outlined" color="primary" onClick={handleGoToGame(game.id)}>
                              Go
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};
