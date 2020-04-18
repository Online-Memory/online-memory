const updatePlayers = (players, userId) =>
  players.map(player => {
    if (player.userId === userId) {
      return {
        ...player,
        status: 'idle',
      };
    }

    return player;
  });

const shufflePlayers = player =>
  player.sort(() => Math.random() - 0.5).map((currPlayer, index) => ({ ...currPlayer, id: index + 1 }));

const startGame = async (isOwner, gameStatus, players, userId) => {
  const playersUpdated = updatePlayers(players, userId);

  if (isOwner && gameStatus === 'new' && players.length === 1) {
    return {
      status: 'started',
      startedAt: new Date().toISOString(),
      players: playersUpdated,
      playerTurn: {
        ...playersUpdated[0],
        status: 'idle',
        turn: 0,
        streak: 0,
        currentPlaying: playersUpdated[0].userId,
      },
    };
  }

  if (isOwner && gameStatus === 'new' && players.length > 1) {
    return {
      status: 'idle',
      players: shufflePlayers(playersUpdated),
    };
  }

  const offlinePlayers = playersUpdated.filter(player => player.status === 'offline');

  if (!offlinePlayers.length) {
    return {
      status: 'started',
      startedAt: new Date().toISOString(),
      players: playersUpdated,
      playerTurn: {
        ...playersUpdated[0],
        status: 'idle',
        turn: 0,
        streak: 0,
        currentPlaying: playersUpdated[0].userId,
      },
    };
  }

  return {
    players: playersUpdated,
  };
};

module.exports = {
  startGame,
};
