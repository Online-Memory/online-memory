const { checkoutTile } = require('../src/eventHandlers/checkout-tile');

describe('Checkout Tile', () => {
  it('Should return an error when the player turn is minor than 1', async () => {
    const userId = 'user-a';
    const players = [];
    const playerTurn = { turn: 0 };
    const tiles = [];
    const currTile = { ref: '001' };
    const tileId = 'user-a';
    const moves = 0;
    const errorMessage = 'The user is not allowed to play. The user must start the turn first';

    const res = await checkoutTile(userId, players, playerTurn, tiles, currTile, tileId, moves);

    expect(res.error).toBeDefined();
    expect(res.error).toBe(errorMessage);
  });

  it('Should increment the game total moves by 1', async () => {
    const userId = 'user-a';
    const players = [];
    const playerTurn = { turn: 1 };
    const tiles = [];
    const currTile = { ref: '001' };
    const tileId = 'user-a';
    const moves = 0;

    const res = await checkoutTile(userId, players, playerTurn, tiles, currTile, tileId, moves);

    expect(res.moves).toBe(moves + 1);
  });

  it('Should not alter the game status', async () => {
    const userId = 'user-a';
    const players = [];
    const playerTurn = { turn: 1 };
    const tileId = 1;
    const tiles = [{ status: 'hidden', id: tileId }];
    const currTile = { ref: '001' };
    const moves = 0;

    const res = await checkoutTile(userId, players, playerTurn, tiles, currTile, tileId, moves);

    expect(res).not.toHaveProperty('status');
  });

  it('Should end the game when all the tiles are taken', async () => {
    const userId = 'user-a';
    const players = [];
    const playerTurn = { turn: 1 };
    const tiles = [{ status: 'taken' }];
    const currTile = { ref: '001' };
    const tileId = 'user-a';
    const moves = 0;
    const expectedStatus = 'ended';

    const res = await checkoutTile(userId, players, playerTurn, tiles, currTile, tileId, moves);

    expect(res.status).toBe(expectedStatus);
  });

  it('Should show the selected tile', async () => {
    const userId = 'user-a';
    const players = [];
    const playerTurn = { turn: 1 };
    const tileId = 1;
    const tiles = [{ status: 'hidden', id: tileId }];
    const currTile = { ref: '001' };
    const moves = 0;
    const expectedStatus = 'show';

    const res = await checkoutTile(userId, players, playerTurn, tiles, currTile, tileId, moves);

    expect(res.tiles[0].status).toBe(expectedStatus);
  });

  it('Should update the player turn', async () => {
    const userId = 'user-a';
    const players = [];
    const playerTurn = { turn: 1 };
    const tileId = 1;
    const tiles = [{ status: 'hidden', id: tileId }];
    const currTile = { ref: '001' };
    const moves = 0;
    const expectedPlayerTurn = playerTurn.turn + 1;

    const res = await checkoutTile(userId, players, playerTurn, tiles, currTile, tileId, moves);

    expect(res.playerTurn.turn).toBe(expectedPlayerTurn);
  });

  it('Should complete the player turn after 2 moves', async () => {
    const playerOneId = 'user-a';
    const playerTwoId = 'user-b';
    const players = [{ userId: playerOneId }, { userId: playerTwoId }];
    const playerTurn = { turn: 2, userId: playerOneId, currentPlaying: playerOneId };
    const tileId = 1;
    const tiles = [{ status: 'hidden', id: tileId }];
    const currTile = { ref: '001' };
    const moves = 1;
    const expectedPlayerTurn = {
      currentPlaying: playerOneId,
      userId: playerTwoId,
      status: 'idle',
      turn: 0,
      streak: 0,
    };

    const res = await checkoutTile(playerOneId, players, playerTurn, tiles, currTile, tileId, moves);

    expect(res.playerTurn).toStrictEqual(expectedPlayerTurn);
  });

  it('Should keep going with the current player when a match is found', async () => {
    const playerOneId = 'user-a';
    const playerTwoId = 'user-b';
    const players = [{ userId: playerOneId }, { userId: playerTwoId }];
    const currTile = { ref: '001' };
    const playerTurn = {
      turn: 2,
      userId: playerOneId,
      currentPlaying: playerOneId,
      status: 'playing',
      tileRef: currTile.ref,
    };
    const tileId = 1;
    const tiles = [{ status: 'hidden', id: tileId }];
    const moves = 1;
    const expectedPlayerTurn = {
      currentPlaying: playerOneId,
      userId: playerOneId,
      status: 'playing',
      turn: 1,
      streak: 1,
    };

    const res = await checkoutTile(playerOneId, players, playerTurn, tiles, currTile, tileId, moves);

    expect(res.playerTurn).toStrictEqual(expectedPlayerTurn);
  });

  it('Should record the longest streak to the player information', async () => {
    const playerOneId = 'user-a';
    const playerTwoId = 'user-b';
    const players = [{ userId: playerOneId, streak: 1 }, { userId: playerTwoId }];
    const currTile = { ref: '001' };
    const playerTurn = {
      turn: 2,
      userId: playerOneId,
      currentPlaying: playerOneId,
      status: 'playing',
      tileRef: currTile.ref,
      streak: 1,
    };
    const tileId = 1;
    const tiles = [{ status: 'hidden', id: tileId }];
    const moves = 1;
    const expectedPlayer = {
      userId: playerOneId,
      moves: 1,
      pairs: 1,
      streak: playerTurn.streak + 1,
    };

    const res = await checkoutTile(playerOneId, players, playerTurn, tiles, currTile, tileId, moves);

    expect(res.players[0]).toStrictEqual(expectedPlayer);
  });
});
