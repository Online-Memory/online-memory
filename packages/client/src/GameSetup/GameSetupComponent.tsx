import React, { memo, useState, useCallback, useMemo } from 'react';
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
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TileComponent } from '../Game/Tile';
import { Template } from './types';
import { useStyles } from './styles';
import { Tile, GameData } from '../Game/types';

const sampleTiles: Tile[] = [
  { id: 1, ref: '000', status: 'show' },
  { id: 2, ref: '001', status: 'show' },
  { id: 3, ref: '002', status: 'show' },
  { id: 4, ref: '003', status: 'show' },
  { id: 5, ref: '004', status: 'show' },
  { id: 6, ref: '005', status: 'show' },
  { id: 7, ref: '006', status: 'show' },
];

interface Props {
  templates: Template[];
  playAgainData?: GameData;
  searchUserLoading: boolean;
  searchUserData: any;
  onSearchUser: (user: string) => void;
  onSubmit: any;
}

const GAME_TILES = [100, 72, 48, 36];

export const Component: React.FC<Props> = memo(
  ({ templates, playAgainData, onSubmit, onSearchUser, searchUserData, searchUserLoading }) => {
    const classes = useStyles();
    const playAgainUsers = playAgainData?.users?.map(user => ({ username: user?.item?.username, id: user?.id })) || [];
    const [inviteUsers, setInviteUsers] = useState(playAgainUsers);
    const [defaultUsers] = useState(inviteUsers);
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

    const handleChangeUsers = useCallback((_event: any, usersInput: any) => {
      setInviteUsers(usersInput);
    }, []);

    const handleSearchUser = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchUser(event.target.value);
      },
      [onSearchUser]
    );

    const checkForm = useMemo(() => {
      return !gameName || !gameTemplate;
    }, [gameName, gameTemplate]);

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
                    {sampleTiles.map((tile, index) => (
                      <TileComponent
                        key={`tile_${tile.id}`}
                        tile={{ id: tile.id, status: tile.status, ref: tile.ref, owner: '' }}
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
                    <Typography gutterBottom>Invite other users to this game</Typography>
                    <Autocomplete
                      multiple
                      className={classes.fieldComponent}
                      getOptionLabel={(option: any) => option?.username || ''}
                      options={searchUserData}
                      loading={searchUserLoading}
                      onChange={handleChangeUsers}
                      defaultValue={[...defaultUsers]}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Enter a username"
                          variant="outlined"
                          onChange={handleSearchUser}
                          fullWidth
                        />
                      )}
                    />
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
  }
);
