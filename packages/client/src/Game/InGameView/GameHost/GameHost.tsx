import React, { useCallback, useState } from 'react';
import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import { useAppState } from '../../../AppState';

interface Props {
  gameId: string;
  disabled: boolean;
  handleStartGame: () => void;
}

export const GameHost: React.FC<Props> = ({ gameId, disabled, handleStartGame }) => {
  const { showMessage } = useAppState();
  const [open, setOpen] = useState(false);

  const handleCopyInvitation = useCallback(() => {
    const invitation = `Come play memory with me!

Join the Online Memory game at:
https://master.d3czed5ma25sw0.amplifyapp.com/game/${gameId}

Game ID: ${gameId}`;
    (navigator as any).clipboard.writeText(invitation);
    showMessage('Game invitation copied to the clipboard', 'success');
  }, [gameId, showMessage]);

  const handleCopyId = useCallback(() => {
    (navigator as any).clipboard.writeText(gameId);
    showMessage('Game Id copied to the clipboard', 'success');
  }, [gameId, showMessage]);

  const handleShowConfirmation = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <Grid justify="center" alignItems="center" direction="column" xs={12} md={9} spacing={6} item container>
      <Dialog
        open={open}
        aria-labelledby="alert-game-host-start-game"
        aria-describedby="alert-game-host-dialog-description"
      >
        <DialogTitle id="alert-game-host-start-game">Are you sure you want to start this game?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-game-host-dialog-description">
            Once a game has started, <strong>new players won't be allowed to join</strong>.
            <br />
            Make sure <strong>all users</strong> have joined before clicking start
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="default">
            cancel
          </Button>
          <Button onClick={handleStartGame} color="primary">
            Start
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item>
        <Typography component="h4" variant="h5" align="center">
          You are the game host
        </Typography>
      </Grid>

      <Grid item justify="center" alignItems="center" direction="column" container>
        <Typography variant="subtitle1" align="center">
          Share this game id with other user: <strong>{gameId}</strong>
        </Typography>
        <Grid item container justify="space-evenly">
          <Button variant="outlined" color="default" onClick={handleCopyInvitation}>
            Copy Invitation
          </Button>

          <Button variant="outlined" color="default" onClick={handleCopyId}>
            Copy Game ID
          </Button>
        </Grid>
      </Grid>

      <Grid item direction="column" spacing={10} container>
        <Grid item>
          <Typography paragraph align="center">
            Click <strong>"Start game"</strong> once all the users have joined
          </Typography>
        </Grid>
        <Grid item container justify="center">
          <Button variant="outlined" color="primary" size="large" onClick={handleShowConfirmation} disabled={disabled}>
            Start Game
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
