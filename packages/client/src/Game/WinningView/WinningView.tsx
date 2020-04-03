import React, { memo } from 'react';
import { Container, Grid, Typography, Card, CardHeader, CardContent } from '@material-ui/core';
import { useStyles } from './styles';
import { GameData } from '../types';

interface Props {
  gameData: GameData;
}

export const WinningView: React.FC<Props> = memo(({ gameData }) => {
  const classes = useStyles();

  const winningPlayersOrdered = gameData.players.sort(
    (playerA, playerB) => (playerB.score || 0) - (playerA.score || 0)
  );
  const winningPlayerScore = winningPlayersOrdered[0].score;
  const winningPlayers = winningPlayersOrdered.filter(player => player.score === winningPlayerScore);
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
            <Grid container alignContent="center" alignItems="center" direction="column" spacing={4}>
              <Grid item>
                {winningPlayers.length > 1 ? (
                  <>
                    <Typography align="center" component="h2" variant="h3" gutterBottom>
                      It's a tie!
                    </Typography>
                    <Typography align="center" component="h2" variant="h3">
                      {winningPlayers.map(winningPlayer => (
                        <Typography component="span" variant="h3">
                          {winningPlayer.name[0].toUpperCase()}
                          {winningPlayer.name.slice(1).toLocaleLowerCase()},{' '}
                        </Typography>
                      ))}
                    </Typography>
                    <Typography align="center" component="h2" variant="h3" gutterBottom>
                      won this game with {winningPlayers[0].score} points!
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography align="center" component="h2" variant="h3" gutterBottom>
                      {winningPlayers[0].name[0].toUpperCase()}
                      {winningPlayers[0].name.slice(1).toLocaleLowerCase()} won this game with {winningPlayers[0].score}{' '}
                      points!
                    </Typography>
                  </>
                )}
              </Grid>

              <Grid item xs={10}>
                <img src="/img/trophy.gif" alt="trophy" width="180" />
              </Grid>

              <Grid item xs={10}>
                {gameData.players.map((player, index) => (
                  <Typography key={`player_score-${player.id}`} paragraph>
                    {index + 1}.{' '}
                    <strong>
                      {player.name[0].toUpperCase()}
                      {player.name.slice(1).toLocaleLowerCase()}
                    </strong>
                    's score: {player.score} points
                  </Typography>
                ))}
              </Grid>
              <Grid item xs={10}>
                <Typography component="h4" variant="h6" gutterBottom>
                  Game duration: {getGameLength()}
                </Typography>
                <Typography component="h4" variant="h6" gutterBottom>
                  Tiles flipped: {`${gameData.moves}`}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
});
