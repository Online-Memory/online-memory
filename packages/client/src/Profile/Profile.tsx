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
  CircularProgress,
} from '@material-ui/core';
import { Avatar } from 'react-avataaars';
import { useAppState } from '../AppState';
import { useStyles } from './styles';

const randomUuid = () => {
  let dt = new Date().getTime();

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const Profile: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { updateUser, loading, user, showMessage } = useAppState();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleChangeDisplayName = useCallback((input: any) => {
    setDisplayName(input.target.value);
  }, []);

  const handleChangeAvatar = useCallback(() => {
    setAvatar(randomUuid());
  }, []);

  const handleSubmit = useCallback(async () => {
    await updateUser(displayName, avatar);
    showMessage('User information correctly updated', 'success', 'Success');
    history.goBack();
  }, [avatar, displayName, history, showMessage, updateUser]);

  const handleCancel = useCallback(async () => {
    history.goBack();
  }, [history]);

  return (
    <div className={`Profile ${classes.container}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader title="User Profile" />

          <CardContent>
            <Container maxWidth="sm">
              <Grid container direction="column" spacing={6}>
                <Grid item>
                  <Typography component="h4" variant="h6" align="center" gutterBottom>
                    Display Name
                  </Typography>
                  <Typography gutterBottom>Choose your display name</Typography>
                  <TextField
                    type="text"
                    variant="outlined"
                    inputProps={{ maxLength: 30 }}
                    value={displayName}
                    onChange={handleChangeDisplayName}
                    fullWidth
                  />
                </Grid>

                <Grid item>
                  <Typography component="h4" variant="h6" align="center" gutterBottom>
                    Avatar
                  </Typography>
                  <Grid item container direction="row" alignItems="center" justify="space-between">
                    <Avatar hash={avatar} className={classes.avatar} />
                    <Button color="default" size="large" variant="outlined" onClick={handleChangeAvatar}>
                      Shuffle
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
              Save changes
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
};
