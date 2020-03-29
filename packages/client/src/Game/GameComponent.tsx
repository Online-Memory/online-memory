import React, { memo, useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Container, Grid, Button, Snackbar } from '@material-ui/core';
import { WithWidth, withWidth } from '@material-ui/core';
import { PLAY_TURN, CHECKOUT_TILE } from '../graphql';
import { ClaimPlayer } from './ClaimPlayer';
import { WaitOpponents } from './WaitOpponents';
import { Dashboard } from './Dashboard';
import { Player, GameData } from './types';
import { WinningView } from './WinningView';
import { Board } from './Board';
import { ZoomControl } from '../ZoomControl';
import { useZoom } from '../ZoomControl/useZoom';
import { useStyles } from './styles';

interface Props extends WithWidth {
  userId: string;
  gameData: GameData;
  onClaimPlayer: (player: Player) => void;
}

const Component: React.FC<Props> = memo(({ gameData, userId, onClaimPlayer, width }) => {
  const { tileSize, zoomIn, zoomOut } = useZoom(80);
  const classes = useStyles();
  const { name, players, playerTurn, board, tiles } = gameData;

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

  const handleClose = useCallback(() => {
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
  }, [gameData.id, playTurn, playTurnLoading, playerTurn.turn]);

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
    <div className={`Game ${classes.gameContainer}`}>
      <WaitOpponents gameId={gameData.id} gameName={name} pendingPlayers={pendingPlayers} />
    </div>
  ) : (
    <div className={`Game ${classes.gameContainer}`}>
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

      <ZoomControl onZoomIn={zoomIn} onZoomOut={zoomOut} />

      <Container maxWidth="lg">
        {isAPlayer || !pendingPlayers.length ? (
          <Grid container>
            <Dashboard name={name} players={players} userId={userId} turnPlayerId={playerTurn.id} />
            <Board
              board={board}
              tiles={tiles}
              tileSize={tileSize}
              loading={checkoutTIleLoading || playTurnLoading}
              disabled={playTurnLoading || checkoutTIleLoading || playerTurn.userId !== userId || !playerTurn.turn}
              onCheckoutTile={handleCheckOutTile}
            />
          </Grid>
        ) : (
          <ClaimPlayer name={name} gameId={gameData.id} players={players} onPlayerSelected={handlePlayerSelected} />
        )}
      </Container>
    </div>
  );
});

export const GameComponent = withWidth()(Component);
