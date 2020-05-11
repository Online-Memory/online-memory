import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar } from 'react-avataaars';
import debounce from 'lodash/debounce';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@material-ui/core';
import { useAppState, UserData } from '../AppState';
import { useStyles } from './styles';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_USERS } from '../graphql';

export const Friends: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { loading, userFriends, addFriend, deleteFriend } = useAppState();
  const [searchUser, setSearchUser] = useState('');
  const [usersList, setUsersList] = useState<UserData[]>();

  const [getUsers, { data: getUsersData, loading: getUsersLoading }] = useLazyQuery<{ getUsers: UserData[] }>(
    GET_USERS,
    {
      onError: err => {
        console.warn(err);
      },
    }
  );

  const debounceCallback = useCallback(
    debounce((name: any) => {
      getUsers({ variables: { name } });
    }, 750),
    []
  );

  const handleSearchUser = useCallback(
    async (input: any) => {
      const { value } = input.target;

      setSearchUser(value);

      if (value.length >= 4) {
        debounceCallback(value);
      }
    },
    [debounceCallback]
  );

  const handleAddFriend = useCallback(
    (userId: string) => () => {
      addFriend(userId);
    },
    [addFriend]
  );

  const handleDeleteFriend = useCallback(
    (friendId: string) => () => {
      deleteFriend(friendId);
    },
    [deleteFriend]
  );

  const handleCancel = useCallback(async () => {
    history.goBack();
  }, [history]);

  useEffect(() => {
    if (!getUsersLoading && getUsersData?.getUsers) {
      setUsersList(getUsersData.getUsers);
    } else {
      setUsersList([]);
    }
  }, [getUsersData, getUsersLoading]);

  return (
    <div className={`Profile ${classes.container}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader title="Friends" />

          <CardContent>
            <Container maxWidth="sm">
              <Grid container direction="column" spacing={6}>
                <Grid item>
                  <Typography component="h4" variant="h6" align="center" gutterBottom>
                    My Friends
                  </Typography>

                  <Grid item container direction="column" alignItems="center" spacing={1}>
                    <Grid item>{loading && <CircularProgress size={60} />}</Grid>
                    <Grid item container>
                      {userFriends?.length ? (
                        <div className={classes.usersList}>
                          <List component="nav" aria-label="users list">
                            {userFriends.map((friendData, index) => (
                              <ListItem key={`player-score-${friendData.id}`}>
                                <ListItemIcon>
                                  <div className={classes.avatarWrapper}>
                                    <Avatar size="40px" hash={friendData.avatar} className={classes.avatarIcon} />
                                  </div>
                                </ListItemIcon>
                                <ListItemText
                                  primary={friendData.displayName}
                                  classes={{ primary: classes.listItemText }}
                                />
                                <ListItemSecondaryAction>
                                  <Typography color="error">
                                    <Button color="inherit" disabled={loading} onClick={handleDeleteFriend(`${index}`)}>
                                      Delete
                                    </Button>
                                  </Typography>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                        </div>
                      ) : (
                        <Typography paragraph color="textSecondary">
                          It looks like you don't have any friend yet
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Divider variant="middle" />
                </Grid>

                <Grid item>
                  <Typography component="h4" variant="h6" align="center" gutterBottom>
                    Add Friends
                  </Typography>

                  <Grid item container direction="column" alignItems="center" spacing={1}>
                    <Grid item container>
                      <TextField
                        label="Enter a username"
                        variant="outlined"
                        value={searchUser}
                        onChange={handleSearchUser}
                        helperText="Enter at least 4 letters"
                        fullWidth
                      />
                    </Grid>
                    <Grid item>{getUsersLoading && <CircularProgress size={60} />}</Grid>
                    <Grid item container>
                      {usersList?.length ? (
                        <div className={classes.usersList}>
                          <List component="nav" aria-label="users list">
                            {usersList.map(userData =>
                              userFriends.find(userFriend => userFriend?.id === userData?.id)?.id ? null : (
                                <ListItem key={`player-score-${userData.id}`}>
                                  <ListItemIcon>
                                    <div className={classes.avatarWrapper}>
                                      <Avatar size="40px" hash={userData.avatar} className={classes.avatarIcon} />
                                    </div>
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={userData.displayName}
                                    classes={{ primary: classes.listItemText }}
                                  />
                                  <ListItemSecondaryAction>
                                    <Typography color="primary">
                                      <Button color="inherit" disabled={loading} onClick={handleAddFriend(userData.id)}>
                                        Add
                                      </Button>
                                    </Typography>
                                  </ListItemSecondaryAction>
                                </ListItem>
                              )
                            )}
                          </List>
                        </div>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </CardContent>

          <CardActions className={classes.cardActions}>
            <Button color="default" onClick={handleCancel}>
              Go Back
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
};
