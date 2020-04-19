import React, { memo, useCallback, useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, Grid, Typography, CircularProgress } from '@material-ui/core';
import { GET_GAME, CLAIM_PLAYER, GAME_UPDATED, PLAY_TURN, CHECKOUT_TILE } from '../graphql';
import { useAppState } from '../AppState';
import { GameData } from './types';
import { GameComponent } from './GameComponent';
import { useStyles } from './styles';

export const Game: React.FC = memo(() => {
  const classes = useStyles();
  const { id } = useParams();
  const { user } = useAppState();
  const [skip, setSkip] = useState<boolean>(true);
  const [_loading, _setLoading] = useState<boolean>(false);

  const { data, loading: dataLoading, error: dataError } = useQuery<{ getGame: GameData }>(GET_GAME, {
    variables: { gameId: id || '' },
    onError: err => {
      console.warn(err);
    },
  });

  const [claimPlayer, { loading: claimPlayerLoading }] = useMutation(CLAIM_PLAYER, {
    onError: err => {
      console.warn(err);
    },
  });

  const [playTurn, { loading: playTurnLoading }] = useMutation(PLAY_TURN, {
    onError: err => {
      console.warn(err);
    },
  });

  const [checkoutTile, { loading: checkoutTileLoading }] = useMutation(CHECKOUT_TILE, {
    onError: err => {
      console.warn(err);
    },
  });

  const { error: subError, data: subData, loading: subLoading } = useSubscription<{ gameUpdated: GameData }>(
    GAME_UPDATED,
    {
      skip,
      variables: { id },
      shouldResubscribe: true,
      onSubscriptionData: () => {
        _setLoading(false);
      },
    }
  );

  const handleClaimPlayer = useCallback(() => {
    _setLoading(true);
    claimPlayer({
      variables: {
        claimPlayerInput: {
          gameId: id,
        },
      },
    });
  }, [claimPlayer, id]);

  const handleCheckOutTile = useCallback(
    (tileId: string) => {
      if (_loading) {
        return;
      }

      _setLoading(true);

      checkoutTile({
        variables: {
          checkoutTileInput: {
            gameId: data?.getGame?.id,
            tileId,
          },
        },
      });
    },
    [_loading, checkoutTile, data]
  );

  const handlePlayTurn = useCallback(() => {
    if (_loading) {
      return;
    }

    _setLoading(true);

    playTurn({
      variables: {
        playTurnInput: {
          gameId: data?.getGame?.id,
        },
      },
    });
  }, [_loading, data, playTurn]);

  useEffect(() => {
    setSkip(false);
  }, []);

  const error = dataError || subError;
  const loading = _loading || dataLoading || claimPlayerLoading || checkoutTileLoading || playTurnLoading || subLoading;

  if (error) {
    return (
      <div className={`Game ${classes.gameContainer}`}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Grid container justify="center" className={classes.loading}>
                <Grid item>
                  <Typography>
                    Ops! Something went wrong. Try to refresh this page or make sure this game really exists
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  if (dataLoading || !user || !user.id) {
    return (
      <div className={`Game ${classes.gameContainer}`}>
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

  if (!data || !data.getGame || !data.getGame.id) {
    return (
      <div className={`Game ${classes.gameContainer}`}>
        <Container maxWidth="lg">
          <Card>
            <CardContent>
              <Grid container justify="center" className={classes.loading}>
                <Grid item>
                  <Typography>Invalid game. Please make sure this game id exists</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <GameComponent
      gameData={(subData && subData.gameUpdated) || data.getGame}
      user={user}
      onClaimPlayer={handleClaimPlayer}
      onPlayTurn={handlePlayTurn}
      onCheckOutTile={handleCheckOutTile}
      loading={loading}
    />
  );
});
