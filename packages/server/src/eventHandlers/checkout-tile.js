const updatePlayerTurn = (playerTurn, isWin, nextPlayer, currTile) => {
  if (playerTurn.turn > 1 && !isWin) {
    return {
      ...nextPlayer,
      currentPlaying: playerTurn.currentPlaying,
      status: 'idle',
      turn: 0,
      streak: 0,
    };
  }

  if (playerTurn.turn > 1 && isWin) {
    return {
      ...playerTurn,
      streak: (playerTurn.streak || 0) + 1,
      turn: 1,
    };
  }

  return {
    ...playerTurn,
    turn: playerTurn.turn + 1,
    tileRef: `${currTile.ref}`,
  };
};

const checkoutTile = async (userId, players, playerTurn, tiles, currTile, tileId, moves) => {
  if (!playerTurn.turn) {
    return { error: 'The user is not allowed to play. The user must start the turn first' };
  }

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
    delete playerTurnUpdated.tileRef;

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
        const longestStreak = player.streak || 0;
        const playerStreakUpdated = playerTurnUpdated.streak > longestStreak ? playerTurnUpdated.streak : longestStreak;

        return {
          ...player,
          streak: playerStreakUpdated,
          pairs: (player.pairs || 0) + 1,
        };
      }

      return player;
    });
  }

  const tilesAvailable = tilesUpdated.filter(tile => tile.status !== 'taken');
  const gameStatusUpdated = !tilesAvailable.length ? 'ended' : undefined;

  return {
    moves: moves + 1,
    tiles: tilesUpdated,
    playerTurn: playerTurnUpdated,
    players: playersUpdated,
    ...(gameStatusUpdated && { status: gameStatusUpdated }),
  };
};

module.exports = {
  checkoutTile,
};
