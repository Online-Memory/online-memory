const { startGame } = require('../src/eventHandlers/start-game');

describe('start game', () => {
  describe('single player game', () => {
    const isOwner = true;
    const gameStatus = 'new';
    const userId = 'testUserId';
    const players = [{ userId, id: 1, status: 'offline' }];

    it(`should start the game`, async () => {
      const res = await startGame(isOwner, gameStatus, players, userId);

      expect(res.status).toBe('started');
    });

    it(`should set the player status to 'ready'`, async () => {
      const res = await startGame(isOwner, gameStatus, players, userId);

      expect(res.players).toBeDefined();
      expect(res.players[0].status).toBe('ready');
    });

    it(`should set the player turn`, async () => {
      const res = await startGame(isOwner, gameStatus, players, userId);

      expect(res.playerTurn).toBeDefined();
      expect(res.playerTurn.status).toBe('idle');
      expect(res.playerTurn.turn).toBe(0);
      expect(res.playerTurn.currentPlaying).toBe(userId);
    });

    it(`should record the starting game time`, async () => {
      const res = await startGame(isOwner, gameStatus, players, userId);

      expect(res.startedAt).toBeDefined();
      expect(typeof res.startedAt).toBe('string');
    });
  });

  describe('multi player game', () => {
    const isOwner = true;
    const gameStatus = 'new';
    const userId = 'testUserId';
    const players = [
      { id: 1, userId: userId, status: 'offline' },
      { id: 2, userId: 'user#2', status: 'offline' },
    ];

    it(`should set the game status to 'idle' when the host starts the game`, async () => {
      const res = await startGame(isOwner, gameStatus, players, userId);

      expect(res.status).toBeDefined();
      expect(res.status).toBe('idle');
    });

    it(`should switch the player status to 'ready'`, async () => {
      const res = await startGame(isOwner, gameStatus, players, userId);

      expect(res.players).toBeDefined();
      expect(res.players.find(player => player.userId === userId).status).toBe('ready');
      expect(res.players.find(player => player.userId !== userId).status).toBe('offline');
    });

    it(`should start the game when the game is idle and there are no pending players left`, async () => {
      const playersReady = [
        { id: 1, userId: userId, status: 'offline' },
        { id: 2, userId: 'user#2', status: 'ready' },
      ];
      const gameStatusIdle = 'idle';
      const res = await startGame(isOwner, gameStatusIdle, playersReady, userId);

      expect(res.status).toBe('started');
    });

    it(`should set the player turn when the game starts`, async () => {
      const playersReady = [
        { id: 1, userId: userId, status: 'offline' },
        { id: 2, userId: 'user#2', status: 'ready' },
      ];
      const gameStatusIdle = 'idle';
      const res = await startGame(isOwner, gameStatusIdle, playersReady, userId);

      expect(res.playerTurn).toBeDefined();
      expect(res.playerTurn.status).toBe('idle');
      expect(res.playerTurn.turn).toBe(0);
      expect(res.playerTurn.currentPlaying).toBe(userId);
    });

    it(`should record the starting game time`, async () => {
      const playersReady = [
        { id: 1, userId: userId, status: 'offline' },
        { id: 2, userId: 'user#2', status: 'ready' },
      ];
      const gameStatusIdle = 'idle';
      const res = await startGame(isOwner, gameStatusIdle, playersReady, userId);

      expect(res.startedAt).toBeDefined();
      expect(typeof res.startedAt).toBe('string');
    });
  });
});
