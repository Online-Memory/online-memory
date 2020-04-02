import React, { memo, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
} from '@material-ui/core';
import { Player } from '../types';
import { useStyles } from './styles';

interface Props {
  name: string;
  gameId: string;
  players: Player[];
  onPlayerSelected: (player: Player) => void;
}

export const ClaimPlayer: React.FC<Props> = memo(({ name, gameId, players, onPlayerSelected }) => {
  const classes = useStyles();

  const handlePlayerSelected = useCallback(
    (player: Player) => () => {
      onPlayerSelected(player);
    },
    [onPlayerSelected]
  );

  return (
    <div className={`ClaimPlayer ${classes.gameContainer}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader title={`Welcome to ${name}`} subheader={`Game ID: ${gameId}`} />
          <CardContent>
            <Grid container justify="center">
              <Grid item xs={4}>
                <Typography component="h2" variant="h5" align="center" gutterBottom>
                  Choose your player
                </Typography>

                <List aria-label="players" className={classes.claimPlayerList}>
                  {players
                    .filter(player => !player.userId)
                    .map(player => {
                      return (
                        <ListItem key={`player-${player.id}`} button>
                          <ListItemText primary={player.name} onClick={handlePlayerSelected(player)} />
                        </ListItem>
                      );
                    })}
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
});
