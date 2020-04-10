import React, { memo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { UserData } from '../../Auth/useAuth';

interface Props {
  user: UserData;
}

export const UserStats: React.FC<Props> = memo(({ user }) => {
  return (
    <Grid item>
      <Typography component="h4" variant="h5" align="center" gutterBottom>
        Welcome back, {user.username}!
      </Typography>
      {user.activeGames.length ? (
        <Typography align="center">
          You have {user.activeGames.length} active {user.activeGames.length === 1 ? 'game' : 'games'}
        </Typography>
      ) : null}
      <Typography align="center">
        You have played {user.completedGames.length} {user.completedGames.length === 1 ? 'game' : 'games'}. Keep going!
      </Typography>
    </Grid>
  );
});
