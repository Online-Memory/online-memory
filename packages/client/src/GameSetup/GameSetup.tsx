import React, { memo, useState, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  Slider,
} from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useStyles } from './styles';

export const CREATE_GAME = gql`
  mutation CreateGame($createGameInput: CreateGameInput!) {
    createGame(input: $createGameInput) {
      id
    }
  }
`;

const defaultPlayers = [
  { id: 1, name: '', active: true },
  { id: 2, name: '', active: true },
  { id: 3, name: '', active: false },
  { id: 4, name: '', active: false },
  { id: 5, name: '', active: false },
  { id: 6, name: '', active: false },
  { id: 7, name: '', active: false },
  { id: 8, name: '', active: false },
  { id: 9, name: '', active: false },
  { id: 10, name: '', active: false },
];

export const GameSetup = memo(() => {
  const classes = useStyles();
  const [teamSize, setTeamSize] = useState(2);
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState(defaultPlayers);
  const [createGame, { loading, error, data }] = useMutation(CREATE_GAME, {
    onError: err => {
      console.warn(err);
    },
  });

  const handleSubmit = useCallback(() => {
    createGame({
      variables: {
        createGameInput: {
          name: gameName,
          size: teamSize,
          players,
        },
      },
    });
  }, [createGame, gameName, players, teamSize]);

  const handleGameNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  }, []);

  const handlePlayerChange = useCallback(
    (playerId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setPlayers(currPlayers =>
        currPlayers.map((currPlayer, index) => ({
          ...currPlayer,
          name: index === playerId - 1 ? value : currPlayer.name,
        }))
      );
    },
    []
  );

  const handlePlayersChange = useCallback((_, value: number | number[]) => {
    if (Array.isArray(value)) {
      return;
    }

    setTeamSize(value);
    setPlayers(currPlayers =>
      currPlayers.map((currPlayer, index) => ({
        ...currPlayer,
        active: index < value,
      }))
    );
  }, []);

  if (error) {
    return (
      <div className={`GameSetup ${classes.container}`}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Grid container justify="center" className={classes.loading}>
                <Grid item>
                  <Typography>{error}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  if (!loading) {
    return (
      <div className={`GameSetup ${classes.container}`}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Grid container justify="center" className={classes.loading}>
                <Grid item>
                  <Typography>Loading...</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  if (data && data.createGame) {
    const { id } = data.createGame;

    return <Redirect to={`/game/${id}`} />;
  }

  return (
    <div className={`GameSetup ${classes.container}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader title="New Game" subheader="Enter your game detail" />
          <CardContent>
            <Container maxWidth="sm">
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography gutterBottom>Enter a name for your game</Typography>
                  <TextField
                    type="text"
                    variant="outlined"
                    inputProps={{ maxLength: 30 }}
                    value={gameName}
                    onChange={handleGameNameChange}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Typography gutterBottom>How many players are going to play?</Typography>
                  <Slider
                    className={`playersSlider ${classes.slider}`}
                    valueLabelDisplay="on"
                    value={teamSize}
                    onChange={handlePlayersChange}
                    min={1}
                    max={10}
                    step={1}
                    marks
                  />
                </Grid>
                {players
                  .filter(player => player.active)
                  .map(player => (
                    <Grid item key={`player-${player.id}-name`}>
                      <Typography gutterBottom>Player {player.id} name</Typography>
                      <TextField
                        type="text"
                        variant="outlined"
                        inputProps={{ maxLength: 20 }}
                        value={player.name}
                        onChange={handlePlayerChange(player.id)}
                        fullWidth
                      />
                    </Grid>
                  ))}
              </Grid>
            </Container>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button color="primary" onClick={handleSubmit}>
              Start
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
});
