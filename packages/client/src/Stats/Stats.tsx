import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ResponsiveRadar } from '@nivo/radar';
import {
  withWidth,
  WithWidth,
  Container,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  CardActions,
  Button,
  CircularProgress,
  isWidthDown,
} from '@material-ui/core';
import { useAppState } from '../AppState';
import { useStyles } from './styles';
import { useTheme } from '../App/useTheme';

const LabelComponent: React.FC<any> = ({ id, anchor, isSmall, userStats }) => {
  const classes = useStyles();

  return !isSmall ? (
    <g transform={`translate(${anchor === 'end' ? -80 : anchor === 'middle' ? -20 : 0}, -10)`}>
      <text className={classes.radarLabelTitle}>{id}</text>
      <text className={classes.radarLabelValue} y={24}>
        {userStats.find((dataItem: any) => dataItem.title === id)?.score}%
      </text>
    </g>
  ) : null;
};

const LabelWrapperComponent = (isSmall: boolean, userStats: any) => {
  return (prop: any) => LabelComponent({ ...prop, isSmall, userStats });
};

export const StatsComponent: React.FC<WithWidth> = ({ width }) => {
  const classes = useStyles();
  const history = useHistory();
  const { user, userLoading, loading, loadStats } = useAppState();
  const { darkTheme } = useTheme();

  const handleBack = useCallback(async () => {
    history.goBack();
  }, [history]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (userLoading || loading) {
    return (
      <div className={`Profile ${classes.container}`}>
        <Container maxWidth="lg">
          <CircularProgress />
        </Container>
      </div>
    );
  }

  const { stats } = user;
  const gamesPlayed = stats.gamesPlayed || 0;
  const gamePairs = stats.gamePairs || 0;
  const gameStreak = stats.gameStreak || 0;
  const wins = stats.wins || 0;
  const totalPairs = stats.totalPairs || 0;
  const totalMoves = stats.totalMoves || 0;

  const goodPlayer = Math.floor(
    (gamesPlayed * 100) / Math.floor((Date.now() - +new Date(user.createdAt)) / 1000 / 60 / 60 / 24)
  );
  const memoryMaster = gamesPlayed && Math.floor((wins * 100) / gamesPlayed);
  const pairsFinder = totalMoves && Math.floor((totalPairs * 100) / (totalMoves / 2));

  const userStats = [
    {
      title: 'Pairs finder',
      score: pairsFinder,
    },
    {
      title: 'Memory master',
      score: memoryMaster > 100 ? 100 : memoryMaster,
    },
    {
      title: 'Good player',
      score: goodPlayer > 100 ? 100 : goodPlayer,
    },
    {
      title: 'Pairer',
      score: Math.floor(gamePairs),
    },
    {
      title: 'Streaker',
      score: Math.floor(gameStreak),
    },
  ];

  return (
    <div className={`Profile ${classes.container}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader title="Stats" />

          <CardContent>
            <Container maxWidth="md">
              <Grid container direction="column" spacing={6}>
                <Grid item>
                  {gamesPlayed ? (
                    <Typography component="h4" variant="h6" align="center" gutterBottom>
                      Well done {user.username}! You have played {gamesPlayed} {gamesPlayed === 1 ? 'game' : 'games'} so
                      far. Keep playing.
                    </Typography>
                  ) : null}
                </Grid>

                <Grid item>
                  <Typography component="h4" variant="h6" align="center" gutterBottom>
                    User Stats
                  </Typography>
                  <div className={classes.radarChart}>
                    <ResponsiveRadar
                      data={userStats}
                      keys={['score']}
                      indexBy="title"
                      maxValue={100}
                      margin={{
                        top: isWidthDown('sm', width) ? 5 : 80,
                        right: isWidthDown('sm', width) ? 5 : 120,
                        bottom: isWidthDown('sm', width) ? 5 : 60,
                        left: isWidthDown('sm', width) ? 5 : 120,
                      }}
                      curve="linearClosed"
                      borderWidth={4}
                      borderColor={{ from: 'color', modifiers: [['darker', 1]] }}
                      gridLevels={8}
                      gridShape="circular"
                      gridLabel={LabelWrapperComponent(isWidthDown('sm', width), userStats) as any}
                      gridLabelOffset={32}
                      enableDotLabel={false}
                      colors={{ scheme: darkTheme ? 'accent' : 'purple_orange' }}
                      fillOpacity={darkTheme ? 0.9 : 0.8}
                      blendMode="normal"
                      isInteractive={true}
                      legends={[
                        {
                          anchor: 'top-left',
                          direction: 'row',
                          translateX: -200,
                          translateY: -200,
                          itemWidth: 0,
                          itemHeight: 0,
                        },
                      ]}
                    />
                  </div>
                </Grid>

                <Grid item>
                  <Typography align="center" component="h4" variant="h6" gutterBottom>
                    Legend
                  </Typography>
                  <Typography>
                    <strong>Pairs finder</strong> defines the accuracy of the user in finding pairs
                  </Typography>
                  <Typography>
                    <strong>Pairer</strong> is the percentage of pairs found in a game compared to the other players
                  </Typography>
                  <Typography>
                    <strong>Streaker</strong> is the percentage of the longest streak performed in a game compared to
                    the other players
                  </Typography>
                  <Typography>
                    <strong>Good player</strong> defines the number of games played based on a length of time. If you
                    play at least one game a day, your score will remain to 100%
                  </Typography>
                  <Typography>
                    <strong>Memory master</strong> is the percentage of victories compared to the total games played
                  </Typography>
                  <Typography paragraph variant="caption">
                    <strong>**</strong> statistics from games played in solo will be discarded from Pairs finder,
                    Pairer, Streaker and Memory master
                  </Typography>
                </Grid>
              </Grid>
            </Container>
          </CardContent>

          <CardActions className={classes.cardActions}>
            <Button color="default" onClick={handleBack}>
              Go Back
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
};

export const Stats = withWidth()(StatsComponent);
