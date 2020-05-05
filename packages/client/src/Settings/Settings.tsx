import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  TextField,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  CircularProgress,
} from '@material-ui/core';
import { useAppState } from '../AppState';
import { useStyles } from './styles';

export const Settings: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { updateUsername, loading, user, showMessage } = useAppState();
  const [username, setUsername] = useState(user?.username);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleChangeUsername = useCallback((input: any) => {
    setUsername(input.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    await updateUsername(username);
    showMessage('User information correctly updated', 'success', 'Success');
    history.goBack();
  }, [history, showMessage, updateUsername, username]);

  const handleCancel = useCallback(async () => {
    history.goBack();
  }, [history]);

  const handleDeleteAccount = useCallback(async () => {
    setShowConfirmDelete(false);
    history.goBack();
  }, [history]);

  const handleDeleteAccountButton = useCallback(async () => {
    setShowConfirmDelete(true);
  }, []);

  return (
    <div className={`Profile ${classes.container}`}>
      <Dialog
        open={showConfirmDelete}
        aria-labelledby="confirm-user-deletion-title"
        aria-describedby="confirm-user-deletion-description"
      >
        <DialogTitle id="confirm-user-deletion-title">Delete your account</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-user-deletion-description">
            Are you sure you want to completely delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAccount}>Yes</Button>
          <Button autoFocus onClick={() => setShowConfirmDelete(false)} color="primary">
            NO
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="lg">
        <Card>
          <CardHeader title="User Profile" />

          <CardContent>
            <Container maxWidth="sm">
              <Grid container direction="column" spacing={4}>
                <Grid item>
                  <Typography component="h4" variant="h6" align="center" gutterBottom>
                    Public profile
                  </Typography>
                  <Typography gutterBottom>Username</Typography>
                  <TextField
                    type="text"
                    variant="outlined"
                    helperText="Username must be between 5 and 12 characters"
                    inputProps={{ maxLength: 16 }}
                    value={username}
                    onChange={handleChangeUsername}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Typography gutterBottom>Email</Typography>
                  <TextField
                    type="text"
                    variant="outlined"
                    inputProps={{ maxLength: 30 }}
                    value={user?.email}
                    disabled
                    fullWidth
                  />
                </Grid>

                <Grid item>
                  <Divider variant="middle" />
                </Grid>

                <Grid item>
                  <Typography color="error" component="h4" variant="h6" align="center" gutterBottom>
                    Delete account
                  </Typography>
                  <Grid item container direction="row" alignItems="center" justify="space-between">
                    <Typography paragraph>
                      This action is permanent and will completely remove your account and all the information related
                      to it
                    </Typography>
                    <Button
                      className={classes.deleteButton}
                      color="primary"
                      variant="contained"
                      onClick={handleDeleteAccountButton}
                      disabled
                    >
                      {loading && <CircularProgress size={24} className={classes.loader} />}
                      Delete your account
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </CardContent>

          <CardActions className={classes.cardActions}>
            <Button color="default" onClick={handleCancel}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSubmit} disabled={loading}>
              {loading && <CircularProgress size={24} className={classes.loader} />}
              Update Profile
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
};
