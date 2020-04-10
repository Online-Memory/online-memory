exports.claimPlayer = async (userId, gameStatus, users, players, claimPlayer = false) => {
  const userPlayer = players.find(player => player.userId === userId);
  const isUser = Boolean(~users.indexOf(userId));

  if (!claimPlayer) {
    return {};
  }

  if (gameStatus !== 'new' || (userPlayer && userPlayer.userId) || isUser) {
    return {};
  }

  const usersUpdated = gameStatus === 'new' && isUser ? users : [...users, userId];
  const playersUpdated = [
    ...players,
    {
      id: players.length + 1,
      userId,
      status: 'offline',
      moves: 0,
      pairs: 0,
    },
  ];

  return {
    players: playersUpdated,
    users: usersUpdated,
  };
};
