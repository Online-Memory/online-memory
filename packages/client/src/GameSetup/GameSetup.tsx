import React, { memo, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography } from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Component } from './GameSetupComponent';
import { CREATE_GAME, GET_TEMPLATES } from '../graphql';
import { Player, Template } from './types';
import { useStyles } from './styles';

const defaultPlayers: Player[] = [
  { id: 1, name: '', active: true },
  { id: 2, name: '', active: true },
  { id: 3, name: '', active: true },
  { id: 4, name: '', active: true },
  { id: 5, name: '', active: false },
  { id: 6, name: '', active: false },
  { id: 7, name: '', active: false },
  { id: 8, name: '', active: false },
  { id: 9, name: '', active: false },
  { id: 10, name: '', active: false },
];

export const GameSetup = memo(() => {
  const classes = useStyles();
  const { data: templatesData, loading: templatesLoading, error: templatesError } = useQuery<{ templates: Template[] }>(
    GET_TEMPLATES,
    {
      onError: err => {
        console.warn(err);
      },
    }
  );

  const [createGame, { loading: createGameLoading, error: createGameError, data: createGameData }] = useMutation(
    CREATE_GAME,
    {
      onError: err => {
        console.warn(err);
      },
    }
  );

  const handleSubmit = useCallback(
    data => {
      createGame({
        variables: {
          createGameInput: data,
        },
      });
    },
    [createGame]
  );

  const error = templatesError || createGameError;
  const loading = templatesLoading || createGameLoading;

  if (error) {
    return (
      <div className={`GameSetup ${classes.container}`}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Grid container justify="center" className={classes.loading}>
                <Grid item>
                  <Typography>Ops! Something went wrong. Please, try again</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  if (loading || !templatesData) {
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

  if (createGameData && createGameData.createGame) {
    const { id } = createGameData.createGame;

    return <Redirect to={`/game/${id}`} />;
  }

  return <Component defaultPlayers={defaultPlayers} templates={templatesData.templates} onSubmit={handleSubmit} />;
});
