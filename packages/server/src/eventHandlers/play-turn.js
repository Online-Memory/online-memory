exports.playTurn = async (tiles, playerTurn, userId) => {
  const tilesUpdated = tiles.map(tile => ({
    ...tile,
    status: tile.status === 'taken' ? 'taken' : 'hidden',
  }));

  const playerTurnUpdated = {
    ...playerTurn,
    turn: 1,
    status: 'playing',
    currentPlaying: userId,
  };

  return {
    playerTurn: playerTurnUpdated,
    tiles: tilesUpdated,
  };
};
