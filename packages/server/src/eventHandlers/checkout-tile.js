const updatePlayerTurn = (playerTurn, isWin, nextPlayer, currTile) => {
  if (playerTurn.turn > 1 && !isWin) {
    return {
      ...nextPlayer,
      currentPlaying: playerTurn.currentPlaying,
      status: 'idle',
      turn: 0,
    };
  } else if (playerTurn.turn > 1 && isWin) {
    return {
      ...playerTurn,
      turn: 1,
    };
  }

  return {
    ...playerTurn,
    turn: (playerTurn.turn || 0) + 1,
    tileRef: `${currTile.ref}`,
  };
};

exports.checkoutTile = async (userId, gameStatus, players, playerTurn, tiles, currTile, tileId, moves) => {
  const isWin = playerTurn.status === 'playing' && playerTurn.turn === 2 && `${currTile.ref}` === playerTurn.tileRef;

  let playersUpdated = players.map(player => {
    if (player.userId === userId) {
      return {
        ...player,
        moves: (player.moves || 0) + 1,
      };
    }
    return player;
  });

  let tilesUpdated = tiles.map(tile => {
    if (`${tile.id}` === `${tileId}` && !isWin) {
      return {
        ...tile,
        status: 'show',
      };
    }
    return tile;
  });

  const currPlayer = players.findIndex(player => player.userId === playerTurn.userId);
  const nextPlayer = currPlayer < players.length - 1 ? players[currPlayer + 1] : players[0];
  const playerTurnUpdated = updatePlayerTurn(playerTurn, isWin, nextPlayer, currTile);

  if (isWin) {
    tilesUpdated = tiles.map(tile => {
      if (`${tile.ref}` === `${currTile.ref}`) {
        return {
          ...tile,
          status: 'taken',
        };
      }
      return tile;
    });

    playersUpdated = playersUpdated.map(player => {
      if (player.userId === userId) {
        return {
          ...player,
          pairs: (player.pairs || 0) + 1,
        };
      }

      return player;
    });
  }

  const tilesAvailable = tilesUpdated.filter(tile => tile.status !== 'taken');
  const gameStatusUpdated = !tilesAvailable.length ? 'ended' : gameStatus;

  return {
    moves: moves + 1,
    tiles: tilesUpdated,
    playerTurn: playerTurnUpdated,
    players: playersUpdated,
    status: gameStatusUpdated,
  };
};
