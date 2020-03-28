import React, { memo, useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Container, Grid, Button, Snackbar } from '@material-ui/core';
import { WithWidth, withWidth } from '@material-ui/core';
import { PLAY_TURN, CHECKOUT_TILE } from '../graphql';
import { ClaimPlayer } from './ClaimPlayer';
import { WaitOpponents } from './WaitOpponents';
import { Dashboard } from './Dashboard';
import { TileComponent } from './Tile';
import { Player, GameData, Tile } from './types';
import { useStyles } from './styles';
import { WinningView } from './WinningView';

interface Props extends WithWidth {
  userId: string;
  gameData: GameData;
  onClaimPlayer: (player: Player) => void;
}

const Component: React.FC<Props> = memo(({ gameData, userId, onClaimPlayer, width }) => {
  const { name, players, playerTurn, board, tiles } = gameData;
  const classes = useStyles();

  const gridX = new Array(board.gridX).fill('');
  const gridY = new Array(board.gridY).fill('');
  const isAPlayer = Boolean(players.find(player => player.userId === userId));
  const pendingPlayers = players.filter(player => !player.userId);

  const [playTurn, { loading: playTurnLoading }] = useMutation(PLAY_TURN, {
    onError: err => {
      console.warn(err);
    },
  });

  const [checkoutTile, { loading: checkoutTIleLoading }] = useMutation(CHECKOUT_TILE, {
    onError: err => {
      console.warn(err);
    },
  });

  const handlePlayerSelected = useCallback(
    (player: Player) => {
      onClaimPlayer(player);
    },
    [onClaimPlayer]
  );

  const getTile = useCallback((tiles: Tile[], posX: number, posY: number, boardX: number) => {
    const id = boardX * posY + posX;

    return tiles[id];
  }, []);

  const handleCheckOutTile = useCallback(
    (tileId: number) => {
      checkoutTile({
        variables: {
          checkoutTileInput: {
            gameId: gameData.id,
            tileId,
          },
        },
      });
    },
    [checkoutTile, gameData.id]
  );

  const handleClose = () => {
    if (playTurnLoading || playerTurn.turn) {
      return;
    }

    playTurn({
      variables: {
        playTurnInput: {
          gameId: gameData.id,
        },
      },
    });
  };

  const open = useMemo(() => {
    return playerTurn.userId === userId && !playerTurn.turn;
  }, [playerTurn.turn, playerTurn.userId, userId]);

  const isGameGoing = tiles.filter(tile => tile.status !== 'taken').length;

  if (!isGameGoing) {
    const winningPlayer = players.sort((playerA, playerB) => (playerB.score || 0) - (playerA.score || 0))[0];

    return (
      <WinningView
        winningPlayer={winningPlayer}
        gameName={gameData.name}
        players={players}
        endGameTime={gameData.updatedAt}
      />
    );
  }

  return isAPlayer && pendingPlayers.length ? (
    <div className={`Game ${classes.container}`}>
      <WaitOpponents gameId={gameData.id} gameName={name} pendingPlayers={pendingPlayers} />
    </div>
  ) : (
    <div className={`Game ${classes.container}`}>
      <Snackbar
        message="It's your turn!"
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button color="primary" size="small" onClick={handleClose}>
            PLAY
          </Button>
        }
      />

      <Snackbar
        open={Boolean(playerTurn.userId)}
        message={playerTurn.userId !== userId ? `${playerTurn.name.toUpperCase()} is playing` : `It's your turn`}
        anchorOrigin={{ vertical: width === 'xl' ? 'top' : 'bottom', horizontal: 'left' }}
        classes={{
          root: classes.snackBarRoot,
          anchorOriginBottomLeft: classes.snackBarBottomLeft,
          anchorOriginTopLeft: classes.snackBarTopLeft,
        }}
      />

      <Container maxWidth="lg">
        {isAPlayer || !pendingPlayers.length ? (
          <Grid container>
            <Dashboard name={name} players={players} userId={userId} turnPlayerId={playerTurn.id} />
            <Grid className={`Board ${classes.container}`} justify="flex-end" xs={12} lg={9} item container>
              <Grid direction="column" className={classes.boardContainer} item container>
                {gridY.map((_, indexY) => (
                  <Grid key={`col-${indexY}`} container item>
                    {gridX.map((_, indexX) => (
                      <Grid item key={`col-${indexY}-row-${indexX}`} className="tileItem">
                        <TileComponent
                          tile={getTile(tiles, indexX, indexY, board.gridX)}
                          disabled={
                            playTurnLoading || checkoutTIleLoading || playerTurn.userId !== userId || !playerTurn.turn
                          }
                          loading={checkoutTIleLoading || playTurnLoading}
                          onCheckout={handleCheckOutTile}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <ClaimPlayer name={name} gameId={gameData.id} players={players} onPlayerSelected={handlePlayerSelected} />
        )}
      </Container>
    </div>
  );
});

export const GameComponent = withWidth()(Component);
