exports.deleteGame = async (userId, gameDataItem) => {
  const { status, users, players, owner, updatedAt } = gameDataItem;
  const isMultiPlayer = Number(users && users.length) > 1;

  if (status === 'ended') {
    return {
      error: 'Cannot delete games already completed',
    };
  }

  if (!isMultiPlayer) {
    return {
      allowDeletion: true,
    };
  }

  if (status !== 'started') {
    return {
      allowRemoveUser: true,
      users: users.filter(user => user !== userId),
      players: users.filter(player => player.userId !== userId),
    };
  }

  const now = Date.now();
  const lastUpdate = new Date(updatedAt).valueOf();
  const wasLastInteractedMoreThanOneDayAgo = Boolean(Math.floor((now - lastUpdate) / 1000 / 60 / 60 / 24));

  if (wasLastInteractedMoreThanOneDayAgo) {
    return {
      allowRemoveUser: true,
      users: users.filter(user => user !== userId),
      players: players.filter(player => player.userId !== userId),
    };
  }

  return {
    error: 'Games can only be deleted after 1 day from the their last interaction. Try again later',
  };
};
