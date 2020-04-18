const { claimPlayer } = require('../src/eventHandlers/claim-player');

describe('Claim Player', () => {
  it('should return an empty object by default', async () => {
    const res = await claimPlayer();

    expect(res).toEqual({});
  });

  it.each(['idle', 'started', 'ended', 'test'])(
    'should return an empty object when the game is not new but %p',
    async gameStatus => {
      const userId = '';
      const users = [];
      const players = [];

      const res = await claimPlayer(userId, gameStatus, users, players);

      expect(res).toEqual({});
    }
  );

  it('should return an empty object when the user is already in the game', async () => {
    const userId = 'test-user-id';
    const gameStatus = 'new';
    const users = [userId];
    const players = [];

    const res = await claimPlayer(userId, gameStatus, users, players);

    expect(res).toEqual({});
  });

  it('should add the user to the game when missing', async () => {
    const userId = 'test-user-id';
    const gameStatus = 'new';
    const users = [];
    const players = [];

    const res = await claimPlayer(userId, gameStatus, users, players);

    expect(res.users).toEqual([userId]);
  });

  it('should add the player to the game when missing', async () => {
    const userId = 'test-user-id';
    const gameStatus = 'new';
    const users = [];
    const players = [];

    const res = await claimPlayer(userId, gameStatus, users, players);

    expect(res.players.length).toEqual(1);
  });

  it('should initialise the new player information', async () => {
    const userId = 'test-user-id';
    const gameStatus = 'new';
    const users = [];
    const players = [];
    const expectedPlayerData = {
      id: 1,
      userId,
      status: 'offline',
      moves: 0,
      pairs: 0,
      streak: 0,
    };
    const res = await claimPlayer(userId, gameStatus, users, players);

    expect(res.players.length).toEqual(1);
    expect(res.players[0]).toStrictEqual(expectedPlayerData);
  });
});
