const claimPlayer = async (userId = '', gameStatus = '', users = [], players = []) => {
  const isUser = Boolean(users.indexOf(userId) >= 0);

  if (gameStatus !== 'new' || isUser) {
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
      streak: 0,
    },
  ];

  return {
    players: playersUpdated,
    users: usersUpdated,
  };
};

module.exports = {
  claimPlayer,
};
