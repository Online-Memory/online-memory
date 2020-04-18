const { playTurn } = require('../src/eventHandlers/play-turn');

describe('Play Turn', () => {
  const userId = 'user-id';

  it('should return an error when the playerTurn is not defined', async () => {
    const tiles = [{ status: 'show' }, { status: 'taken' }, { status: 'show' }];
    const playerTurn = undefined;

    const expectedError = 'Cannot update this game. A playerTurn must be available in the game first';

    const res = await playTurn(tiles, playerTurn, userId);

    expect(res.error).toBeDefined();
    expect(res.error).toBe(expectedError);
  });

  it('should return an error when the playerTurn does not have a valid status', async () => {
    const tiles = [{ status: 'show' }, { status: 'taken' }, { status: 'show' }];
    const playerTurn = { status: 'playing', userId };

    const expectedError = `Users are not allowed to play turns. The player Turn status "${playerTurn.status}" is not valid. "idle" was expected`;

    const res = await playTurn(tiles, playerTurn, userId);

    expect(res.error).toBeDefined();
    expect(res.error).toBe(expectedError);
  });

  it('should return an error when the user is not the current active player', async () => {
    const tiles = [{ status: 'show' }, { status: 'taken' }, { status: 'show' }];
    const playerTurn = { status: 'playing' };

    const expectedError = `User is not allowed to play now`;

    const res = await playTurn(tiles, playerTurn, userId);

    expect(res.error).toBeDefined();
    expect(res.error).toBe(expectedError);
  });

  it('should hide all the tiles not taken', async () => {
    const tiles = [{ status: 'show' }, { status: 'taken' }, { status: 'show' }];
    const playerTurn = { status: 'idle', userId };
    const expectedTiles = [{ status: 'hidden' }, { status: 'taken' }, { status: 'hidden' }];

    const res = await playTurn(tiles, playerTurn, userId);

    expect(res.error).not.toBeDefined();
    expect(res.tiles).toEqual(expectedTiles);
  });

  it('should update the player turn', async () => {
    const tiles = [{ status: 'show' }, { status: 'taken' }, { status: 'show' }];
    const playerTurn = {
      turn: 0,
      moves: 0,
      pairs: 0,
      streak: 10,
      name: 'Player 1',
      status: 'idle',
      currentPlaying: 'player-2',
      userId,
    };
    const expectedPlayerTurn = {
      turn: 1,
      moves: 0,
      pairs: 0,
      streak: 0,
      name: 'Player 1',
      status: 'playing',
      currentPlaying: userId,
      userId,
    };

    const res = await playTurn(tiles, playerTurn, userId);

    expect(res.playerTurn).toEqual(expectedPlayerTurn);
  });
});
