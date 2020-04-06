exports.claimPlayer = async (userId, players, playerName) => {
  const userPlayer = players.find(player => player.userId === userId);

  let playersUpdated;
  if (userPlayer && userPlayer.userId) {
    playersUpdated = players.map(player => {
      if (player.userId === userId) {
        return {
          ...player,
          name: playerName,
        };
      }

      return player;
    });
  } else {
    playersUpdated = [
      ...players,
      {
        id: players.length + 1,
        name: playerName,
        userId: userId,
        status: 'offline',
        moves: 0,
        pairs: 0,
      },
    ];
  }

  return {
    players: playersUpdated,
  };
};
