import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { Avatar } from 'react-avataaars';
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
import { UserData, UserFriend } from '../AppState';
import { useStyles } from './styles';

interface Props {
  usersAvailable: UserData[];
  userFriends: UserFriend[];
  loading: boolean;
  getUsersLoading: boolean;
  getUsers: (name: string) => void;
  onAddFriend: (name: string) => () => void;
  onDeleteFriend: (name: string) => () => void;
}

export const FriendsComponent: React.FC<Props> = ({
  usersAvailable,
  userFriends,
  loading,
  getUsersLoading,
  getUsers,
  onAddFriend,
  onDeleteFriend,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [searchUser, setSearchUser] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);

  const handleCancel = useCallback(async () => {
    history.goBack();
  }, [history]);

  const debounceCallback = useCallback(
    debounce((name: any) => {
      getUsers(name);
    }, 750),
    []
  );

  const handleSearchUser = useCallback(
    async (input: any) => {
      const { value } = input.target;

      setSearchUser(value);

      if (value.length >= 4) {
        if (firstLoad) {
          setFirstLoad(false);
        }
        debounceCallback(value);
      }
    },
    [debounceCallback, firstLoad]
  );

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
                      {usersAvailable.length
                        ? usersAvailable.map(
                            userData =>
                              userData &&
                              userData.id && (
                                <div key={userData.id} className={classes.usersList}>
                                  <List component="nav" aria-label="users list">
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
                                          <Button color="inherit" disabled={loading} onClick={onAddFriend(userData.id)}>
                                            Add
                                          </Button>
                                        </Typography>
                                      </ListItemSecondaryAction>
                                    </ListItem>
                                  </List>
                                </div>
                              )
                          )
                        : !firstLoad && !getUsersLoading && <Typography>No user found</Typography>}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Divider variant="middle" />
                </Grid>

                <Grid item>
                  <Typography component="h4" variant="h6" align="center" gutterBottom>
                    My Friends
                  </Typography>

                  <Grid item container direction="column" alignItems="center" spacing={1}>
                    <Grid item>{loading && <CircularProgress size={60} />}</Grid>
                    <Grid item container>
                      {userFriends?.length ? (
                        <div className={classes.usersList}>
                          <List component="nav" aria-label="users list" className={classes.friendsList}>
                            {userFriends.map(
                              (friendData, index) =>
                                friendData &&
                                friendData.id && (
                                  <ListItem key={`player-score-${friendData.id}`}>
                                    <ListItemIcon>
                                      <div className={classes.avatarWrapper}>
                                        <Avatar size="40px" hash={friendData.avatar} className={classes.avatarIcon} />
                                      </div>
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={friendData.username}
                                      secondary={friendData.displayName}
                                      classes={{ primary: classes.listItemText }}
                                    />
                                    <ListItemSecondaryAction>
                                      <Typography color="error">
                                        <Button color="inherit" disabled={loading} onClick={onDeleteFriend(`${index}`)}>
                                          Delete
                                        </Button>
                                      </Typography>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                )
                            )}
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
