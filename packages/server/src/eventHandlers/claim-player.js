exports.claimPlayer = async (userId, users, players, playerName) => {
  const userPlayer = players.find(player => player.userId === userId);
  const isUser = Boolean(~users.indexOf(userId));
  const usersUpdated = isUser ? users : [...users, userId];

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
    users: usersUpdated,
  };
};
