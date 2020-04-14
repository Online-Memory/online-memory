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
  const { updateUser, updateUserLoading, user } = useAppState();
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleChangeUsername = useCallback((input: any) => {
    setUsername(input.target.value);
  }, []);

  const handleChangeAvatar = useCallback((input: any) => {
    setAvatar(randomUuid());
  }, []);

  const handleSubmit = useCallback(async () => {
    await updateUser(username, avatar);
    history.goBack();
  }, [avatar, history, updateUser, username]);

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
                    User Name
                  </Typography>
                  <Typography gutterBottom>Choose your user name</Typography>
                  <TextField
                    type="text"
                    variant="outlined"
                    inputProps={{ maxLength: 30 }}
                    value={username}
                    onChange={handleChangeUsername}
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
            <Button color="primary" onClick={handleSubmit} disabled={updateUserLoading}>
              Save changes
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
};
