import React, { memo, useCallback, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Container,
  TextField,
  CardActions,
  Button,
} from '@material-ui/core';
import { useStyles } from './styles';

interface Props {
  name: string;
  gameId: string;
  onClaimPlayer: (playerName: string) => void;
}

export const ClaimPlayer: React.FC<Props> = memo(({ name, gameId, onClaimPlayer }) => {
  const classes = useStyles();
  const [playerName, setPlayerName] = useState('');

  const handleGameNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    onClaimPlayer(playerName);
  }, [onClaimPlayer, playerName]);

  return (
    <div className={`ClaimPlayer ${classes.gameContainer}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader title={`Welcome to ${name}`} subheader={`Game ID: ${gameId}`} />
          <CardContent>
            <Grid container justify="center">
              <Grid item xs={4}>
                <Typography component="h2" variant="h5" align="center" gutterBottom>
                  Enter your player name
                </Typography>
                <TextField
                  type="text"
                  variant="outlined"
                  inputProps={{ maxLength: 30 }}
                  value={playerName}
                  onChange={handleGameNameChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions className={classes.cardActions}>
            <Button color="primary" onClick={handleSubmit} disabled={!playerName}>
              Submit
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
});
