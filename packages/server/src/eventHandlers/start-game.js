exports.startGame = async (players, userId) => {
  const playersUpdated = players.map(player => {
    if (player.userId === userId) {
      return {
        ...player,
        status: 'ready',
      };
    }
  });

  const offlinePlayers = playersUpdated.filter(player => player.status === 'offline');

  if (!offlinePlayers.length) {
    return {
      status: 'started',
      startedAt: new Date().toISOString(),
      players: playersUpdated,
    };
  }

  return {
    players: playersUpdated,
  };
};