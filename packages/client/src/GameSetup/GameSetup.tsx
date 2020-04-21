import React, { memo, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, CircularProgress } from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Component } from './GameSetupComponent';
import { CREATE_GAME, GET_TEMPLATES, INVITE_USER } from '../graphql';
import { Template } from './types';
import { useStyles } from './styles';
import { useAppState } from '../AppState';

export const GameSetup = memo(() => {
  const classes = useStyles();
  const { playAgainData, clearPlayAgainData, user } = useAppState();
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

  const [inviteUser, { loading: inviteUserLoading, error: inviteUserError }] = useMutation(INVITE_USER, {
    onError: err => {
      console.warn(err);
    },
  });

  const handleSubmit = useCallback(
    async data => {
      const { users, ...createGameData } = data;

      const gameData = await createGame({
        variables: {
          createGameInput: createGameData,
        },
      });

      if (users && users.length) {
        const usersToInvite = users.filter((currUser: any) => currUser.id !== user.id);
        if (usersToInvite.length) {
          for (const userToInvite of usersToInvite) {
            await inviteUser({ variables: { userId: userToInvite.id, gameId: gameData?.data?.createGame?.id } });
          }
        }
      }

      clearPlayAgainData();
    },
    [clearPlayAgainData, createGame, inviteUser, user.id]
  );

  const error = templatesError || createGameError || inviteUserError;
  const loading = templatesLoading || createGameLoading || inviteUserLoading;

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
                <Grid container justify="center" className={classes.loading}>
                  <CircularProgress size={60} />
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

  return <Component templates={templatesData.templates} playAgainData={playAgainData} onSubmit={handleSubmit} />;
});
