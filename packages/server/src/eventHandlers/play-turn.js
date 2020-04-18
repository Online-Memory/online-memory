const playTurn = async (tiles, playerTurn, userId) => {
  if (!playerTurn) {
    return { error: `Cannot update this game. A playerTurn must be available in the game first` };
  }

  if (playerTurn.userId !== userId) {
    return { error: 'User is not allowed to play now' };
  }

  if (playerTurn.status !== 'idle') {
    return {
      error:
        `Users are not allowed to play turns. ` +
        `The player Turn status "${playerTurn.status}" is not valid. "idle" was expected`,
    };
  }

  const tilesUpdated = tiles.map(tile => ({
    ...tile,
    status: tile.status === 'taken' ? 'taken' : 'hidden',
  }));

  const playerTurnUpdated = {
    ...playerTurn,
    turn: 1,
    streak: 0,
    status: 'playing',
    currentPlaying: userId,
  };

  return {
    playerTurn: playerTurnUpdated,
    tiles: tilesUpdated,
  };
};

module.exports = {
  playTurn,
};
