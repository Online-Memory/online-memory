const { getUser, updateStats } = require('../helpers/db-operations');

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

const getUserStats = async userId => {
  const user = await getUser(userId);
  const { stats } = user.Item || {};

  return {
    wins: stats.wins || 0,
    streak: stats.streak || 0,
    gamesPlayed: stats.gamesPlayed || 0,
    totalMoves: stats.totalMoves || 0,
    totalPairs: stats.totalPairs || 0,
    gamePairs: stats.gamePairs || 0,
    gameStreak: stats.gameStreak || 0,
  };
};

const updateUsersStats = async (players, totTiles) => {
  const victoryScore = players.sort((a, b) => b.pairs - a.pairs)[0].pairs;
  const victoryPlayers = players.filter(player => player.pairs === victoryScore);
  const victoryPlayersId = victoryPlayers.map(victoryPlayer => victoryPlayer.userId);
  const longestStreak = players.sort((a, b) => b.streak - a.streak)[0].streak;

  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const player of players) {
    const userStats = await getUserStats(player.userId);
    const gamePlayerPairs = (player.pairs * 100) / (totTiles / 2);
    const gameUserStreak = (player.streak * 100) / longestStreak;
    const gameStreak = userStats.gamesPlayed ? (userStats.gameStreak + gameUserStreak) / 2 : gameUserStreak;
    const gamePairs = userStats.gamesPlayed ? (userStats.gamePairs + gamePlayerPairs) / 2 : gamePlayerPairs;

    if (players.length > 1) {
      const statsUpdated = {
        ...userStats,
        wins: victoryPlayersId.indexOf(player.userId) > -1 ? userStats.wins + 1 : userStats.wins,
        streak: userStats.streak >= player.streak ? userStats.streak : player.streak,
        gamesPlayed: userStats.gamesPlayed + 1,
        totalMoves: userStats.totalMoves + player.moves,
        totalPairs: userStats.totalPairs + player.pairs,
        gamePairs,
        gameStreak,
      };

      await updateStats(player.userId, statsUpdated);
    } else {
      const statsUpdated = {
        ...userStats,
        gamesPlayed: userStats.gamesPlayed + 1,
      };

      await updateStats(player.userId, statsUpdated);
    }
  }
  /* eslint-enable no-restricted-syntax, no-await-in-loop */
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

  if (gameStatusUpdated === 'ended') {
    await updateUsersStats(playersUpdated, tilesUpdated.length);
  }

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
