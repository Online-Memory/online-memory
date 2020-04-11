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
} from '@material-ui/core';
import { useStyles } from './styles';
import { GET_GAMES } from '../graphql';

export const Dashboard: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { data, loading } = useQuery(GET_GAMES, {
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

  if (loading || !data) {
    return (
      <Grid container justify="center" className={classes.loading}>
        <CircularProgress size={60} />
      </Grid>
    );
  }

  const {
    whoAmI: { completedGames, activeGames },
  } = data;

  return (
    <div className={`Dashboard ${classes.container}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader title="Your Dashboard" />

          <CardContent>
            <Container maxWidth="sm">
              <Grid container direction="column" spacing={6}>
                <Grid item>
                  <Typography component="h4" variant="h6" align="center" gutterBottom>
                    Your Active Games
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
                          <Button size="small" variant="outlined" color="primary" onClick={handleGoToGame(game.id)}>
                            Go
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Grid>

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
            </Container>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};
