import React, { memo, useState, useCallback, useMemo } from 'react';
import { Avatar } from 'react-avataaars';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Link,
} from '@material-ui/core';
import { TileComponent } from '../Game/Tile';
import { Template } from './types';
import { useStyles } from './styles';
import { Tile, GameData } from '../Game/types';
import { UserFriend } from '../AppState';
import { Link as LinkUI } from 'react-router-dom';

const getSampleTiles = (small: boolean): Tile[] => {
  return small
    ? [
        { id: 1, ref: '000', status: 'show' },
        { id: 2, ref: '001', status: 'show' },
        { id: 3, ref: '002', status: 'show' },
        { id: 4, ref: '003', status: 'show' },
      ]
    : [
        { id: 1, ref: '000', status: 'show' },
        { id: 2, ref: '001', status: 'show' },
        { id: 3, ref: '002', status: 'show' },
        { id: 4, ref: '003', status: 'show' },
        { id: 5, ref: '004', status: 'show' },
        { id: 6, ref: '005', status: 'show' },
        { id: 7, ref: '006', status: 'show' },
      ];
};

interface Props {
  templates: Template[];
  userFriends: UserFriend[];
  isMobile: boolean;
  playAgainData?: GameData;
  onSubmit: any;
}

const GAME_TILES = [100, 72, 48, 36, 24, 16];

export const Component: React.FC<Props> = memo(({ templates, playAgainData, onSubmit, userFriends, isMobile }) => {
  const classes = useStyles();
  const playAgainUsers =
    playAgainData?.users?.map(user => ({
      id: user?.id,
      username: user?.item?.username,
      avatar: user?.item?.avatar,
    })) || [];
  const [inviteUsers, setInviteUsers] = useState(playAgainUsers);
  const [gameName, setGameName] = useState(playAgainData?.name || '');
  const [gameTemplate, setGameTemplate] = useState(playAgainData?.template || templates[0].id);
  const [gameTiles, setGameTiles] = useState(playAgainData?.tiles?.length || templates[0].tiles);

  const handleSubmit = useCallback(() => {
    onSubmit({
      name: gameName,
      template: gameTemplate,
      tiles: gameTiles,
      users: inviteUsers,
    });
  }, [gameName, gameTemplate, gameTiles, inviteUsers, onSubmit]);

  const handleTemplateChange = useCallback(
    event => {
      const currTemplate = templates.find(template => template.id === event.target.value);
      const isAllowedSize = gameTiles <= (currTemplate?.tiles || 0);

      if (!isAllowedSize) {
        const newTilesSize = GAME_TILES.filter(tileSize => tileSize <= (currTemplate?.tiles || 0))[0];
        setGameTiles(newTilesSize);
      }

      setGameTemplate(event.target.value);
    },
    [gameTiles, templates]
  );

  const handleTilesChange = useCallback(event => {
    setGameTiles(event.target.value);
  }, []);

  const handleGameNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  }, []);

  const handleAddUser = useCallback(
    (userFriend: UserFriend) => () => {
      setInviteUsers(currUsers => [
        ...currUsers,
        { username: userFriend.username, id: userFriend.id, avatar: userFriend.avatar },
      ]);
    },
    []
  );

  const handleRemoveFriend = useCallback(
    (userId: string) => () => {
      setInviteUsers(currUsers => [...currUsers.filter(currUser => currUser.id !== userId)]);
    },
    []
  );

  const checkForm = useMemo(() => {
    return !gameName || !gameTemplate;
  }, [gameName, gameTemplate]);

  const availableUserFriends = (userFriends || [])
    .filter(
      userFriend => userFriend && userFriend.id && userFriend.avatar && userFriend.username && userFriend.displayName
    )
    .filter(userFriend => !inviteUsers.find(inviteUser => inviteUser?.id === userFriend?.id)?.id);

  return (
    <div className={`GameSetup ${classes.container}`}>
      <Container maxWidth={false}>
        <Card>
          <CardHeader title="New Game" subheader="Define your game" />

          <CardContent>
            <Container maxWidth="sm">
              <Grid container direction="column" spacing={4}>
                <Grid item>
                  <Typography gutterBottom>Enter a name for your game</Typography>
                  <TextField
                    type="text"
                    variant="outlined"
                    inputProps={{ maxLength: 30 }}
                    value={gameName}
                    onChange={handleGameNameChange}
                    fullWidth
                  />
                </Grid>

                <Grid item>
                  <Typography gutterBottom>Choose a game template</Typography>
                  <Select fullWidth variant="outlined" value={gameTemplate} onChange={handleTemplateChange}>
                    {templates.map(template => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item container className={classes.tileSamplesContainer}>
                  {getSampleTiles(isMobile).map((tile, index) => (
                    <TileComponent
                      key={`tile_${tile.id}`}
                      tile={{
                        id: tile.id,
                        status: tile.status,
                        ref: tile.ref,
                        owner: '',
                      }}
                      template={gameTemplate}
                      tileSize={100}
                      disabled={true}
                      loading={false}
                      className={classes.tileSample}
                      style={{
                        left: `${index * 65 + 30}px`,
                        top: `${Math.abs(index * 25 - 75) || 12}px`,
                        transform: `rotateZ(${10 * index - 30}deg)`,
                      }}
                    />
                  ))}
                </Grid>

                <Grid item>
                  <Typography gutterBottom>Choose the number of tiles</Typography>
                  <Select fullWidth variant="outlined" value={gameTiles} onChange={handleTilesChange}>
                    {GAME_TILES.map(tileSize =>
                      tileSize <= Number(templates.find(template => template.id === gameTemplate)?.tiles) ? (
                        <MenuItem key={`tileSize-${tileSize}`} value={tileSize}>
                          {tileSize}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </Grid>

                <Grid item>
                  <Typography gutterBottom>Players</Typography>
                  <Grid item container direction="row" spacing={1}>
                    {inviteUsers.map(inviteUser => (
                      <Grid item key={inviteUser.id}>
                        <Chip
                          label={inviteUser.username}
                          color="primary"
                          variant="outlined"
                          icon={
                            <div className={classes.avatarWrapper}>
                              <Avatar size="24px" hash={inviteUser.avatar} className={classes.avatarIcon} />
                            </div>
                          }
                          onDelete={handleRemoveFriend(inviteUser.id)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item>
                  <Typography gutterBottom>Invite your friends to this game</Typography>
                  <Grid item container direction="column" alignItems="center" spacing={1}>
                    <Grid item container>
                      {availableUserFriends.length ? (
                        <div className={classes.usersList}>
                          <List component="nav" aria-label="users list" className={classes.friendsList}>
                            {availableUserFriends.map(
                              friendData =>
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
                                      <Typography color="primary">
                                        <Button color="inherit" onClick={handleAddUser(friendData)}>
                                          Add
                                        </Button>
                                      </Typography>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                )
                            )}
                          </List>
                        </div>
                      ) : userFriends.length ? (
                        <Typography paragraph color="textSecondary">
                          All your friends are already in this game
                        </Typography>
                      ) : (
                        <Typography paragraph color="textSecondary">
                          It looks like you don't have any friend yet. You can manage your friends from the{' '}
                          <Link component={LinkUI} color="primary" to="/friends">
                            Friends
                          </Link>{' '}
                          page
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </CardContent>

          <CardActions className={classes.cardActions}>
            <Button color="primary" onClick={handleSubmit} disabled={checkForm}>
              Start
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
});
