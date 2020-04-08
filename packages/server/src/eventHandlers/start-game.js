const shufflePlayers = player =>
  player.sort(() => Math.random() - 0.5).map((player, index) => ({ ...player, id: index + 1 }));

exports.startGame = (isOwner, gameStatus, players, userId) => {
  if (isOwner && gameStatus === 'new') {
    return {
      status: 'idle',
      players: shufflePlayers(players),
    };
  }

  const playersUpdated = players.map(player => {
    if (player.userId === userId) {
      return {
        ...player,
        status: 'ready',
      };
    }

    return player;
  });

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
        currentPlaying: playersUpdated[0].userId,
      },
    };
  }

  return {
    players: playersUpdated,
  };
};
