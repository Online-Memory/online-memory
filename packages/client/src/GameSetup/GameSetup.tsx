import React, { memo, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography } from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Component } from './GameSetupComponent';
import { CREATE_GAME, GET_TEMPLATES } from '../graphql';
import { Template } from './types';
import { useStyles } from './styles';

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

  return <Component templates={templatesData.templates} onSubmit={handleSubmit} />;
});
