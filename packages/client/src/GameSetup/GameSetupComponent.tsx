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
  Slider,
  Select,
  MenuItem,
} from '@material-ui/core';
import { TileComponent } from '../Game/Tile';
import { Player, Template } from './types';
import { useStyles } from './styles';
import { Tile } from '../Game/types';

interface Props {
  defaultPlayers: Player[];
  templates: Template[];
  onSubmit: any;
}

export const Component: React.FC<Props> = memo(({ defaultPlayers, templates, onSubmit }) => {
  const classes = useStyles();
  const [teamSize, setTeamSize] = useState(4);
  const [gameName, setGameName] = useState('');
  const [gameTemplate, setGameTemplate] = useState(templates[0].id);
  const [players, setPlayers] = useState(defaultPlayers);

  const handleSubmit = useCallback(() => {
    onSubmit({
      name: gameName,
      size: teamSize,
      template: gameTemplate,
      players,
    });
  }, [gameName, gameTemplate, onSubmit, players, teamSize]);

  const handleChange = useCallback(event => {
    setGameTemplate(event.target.value);
  }, []);

  const handleGameNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  }, []);

  const handlePlayerChange = useCallback(
    (playerId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setPlayers(currPlayers =>
        currPlayers.map((currPlayer, index) => ({
          ...currPlayer,
          name: index === playerId - 1 ? value : currPlayer.name,
        }))
      );
    },
    []
  );

  const handlePlayersChange = useCallback((_, value: number | number[]) => {
    if (Array.isArray(value)) {
      return;
    }

    setTeamSize(value);
    setPlayers(currPlayers =>
      currPlayers.map((currPlayer, index) => ({
        ...currPlayer,
        active: index < value,
      }))
    );
  }, []);

  const checkForm = useMemo(() => {
    const hasMissingPlayerName = players.filter(player => player.active).filter(player => !player.name).length;

    return Boolean(hasMissingPlayerName) || !gameName || !gameTemplate;
  }, [gameName, gameTemplate, players]);

  const sampleTiles: Tile[] = [
    {
      id: 1,
      ref: '000',
      status: 'show',
    },
    {
      id: 2,
      ref: '001',
      status: 'show',
    },
    {
      id: 3,
      ref: '002',
      status: 'show',
    },
    {
      id: 4,
      ref: '003',
      status: 'show',
    },
    {
      id: 5,
      ref: '004',
      status: 'show',
    },
    {
      id: 6,
      ref: '005',
      status: 'show',
    },
    {
      id: 7,
      ref: '006',
      status: 'show',
    },
  ];

  return (
    <div className={`GameSetup ${classes.container}`}>
      <Container maxWidth="lg">
        <Card>
          <CardHeader title="New Game" subheader="Define your game" />

          <CardContent>
            <Container maxWidth="sm">
              <Grid container direction="column" spacing={1}>
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
                  <Typography gutterBottom>How many players are going to play?</Typography>
                  <Slider
                    className={`playersSlider ${classes.slider}`}
                    valueLabelDisplay="on"
                    value={teamSize}
                    onChange={handlePlayersChange}
                    min={1}
                    max={10}
                    step={1}
                    marks
                  />
                </Grid>

                <Grid item>
                  <Typography gutterBottom>Choose a game template</Typography>
                  <Select fullWidth variant="outlined" value={gameTemplate} onChange={handleChange}>
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

                <Grid>
                  {players
                    .filter(player => player.active)
                    .map(player => (
                      <Grid item key={`player-${player.id}-name`}>
                        <Typography gutterBottom>Player {player.id} name</Typography>
                        <TextField
                          type="text"
                          variant="outlined"
                          inputProps={{ maxLength: 20 }}
                          value={player.name}
                          onChange={handlePlayerChange(player.id)}
                          fullWidth
                        />
                      </Grid>
                    ))}
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
