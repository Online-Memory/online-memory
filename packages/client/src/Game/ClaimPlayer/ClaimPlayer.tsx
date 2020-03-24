import React, { memo, useCallback } from 'react';
import { Card, CardHeader, CardContent, Grid, List, ListItem, ListItemText } from '@material-ui/core';
import { Player } from '../types';

interface Props {
  players: Player[];
  onPlayerSelected: (player: Player) => void;
}

export const ClaimPlayer: React.FC<Props> = memo(({ players, onPlayerSelected }) => {
  const handlePlayerSelected = useCallback(
    (player: Player) => () => {
      onPlayerSelected(player);
    },
    [onPlayerSelected]
  );

  return (
    <div className={`ClaimPlayer`}>
      <Card>
        <CardHeader title="Welcome to the game" subheader="Choose your player" />
        <CardContent>
          <Grid container justify="center">
            <Grid item xs={6}>
              <List aria-label="players">
                {players.map(player => {
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
    </div>
  );
});
