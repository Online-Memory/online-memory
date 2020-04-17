const { graphqlHandler } = require('../src/handler');
const dbOperation = require('../src/helpers/db-operations');
const startGame = require('../src/eventHandlers/start-game');

jest.mock('../src/helpers/db-operations');
jest.mock('../src/eventHandlers/start-game');

describe('handler', () => {
  describe('start game', () => {
    it(`should return a 'Game does not exist' error when the game is not found in the database`, async () => {
      const mockGameData = {};
      const gameId = 'test-game-id';
      const event = {
        field: 'startGame',
        userId: 'testUserId',
        input: { gameId },
      };

      jest.spyOn(dbOperation, 'findItem').mockReturnValue(mockGameData);
      let res;
      await graphqlHandler(event, {}, (_error, response) => {
        res = response;
      });

      expect(res).toEqual({ error: `Game ${gameId} does not exist` });
    });

    it(`should return a 'Game does not exist' error when the game is not a valid game object`, async () => {
      const mockGameData = {
        Count: 1,
        Items: [{}],
      };
      const gameId = 'test-game-id';
      const event = {
        field: 'startGame',
        userId: 'testUserId',
        input: {
          gameId,
        },
      };

      jest.spyOn(dbOperation, 'findItem').mockReturnValue(mockGameData);
      let res;
      await graphqlHandler(event, {}, (_error, response) => {
        res = response;
      });

      expect(res).toEqual({ error: `Game ${gameId} does not exist` });
    });

    it(`should invoke 'startGame' with the correct attributes`, async () => {
      const mockGameData = {
        Count: 1,
        Items: [
          {
            owner: 'player-owner-id',
            status: 'game-status',
            players: [{}],
          },
        ],
      };
      const gameId = 'test-game-id';
      const event = {
        field: 'startGame',
        userId: 'testUserId',
        input: {
          gameId,
        },
      };

      jest.spyOn(startGame, 'startGame').mockReturnValue({});
      jest.spyOn(dbOperation, 'findItem').mockReturnValue(mockGameData);

      await graphqlHandler(event, {}, () => {});

      expect(startGame.startGame).toHaveBeenCalledWith(
        false,
        mockGameData.Items[0].status,
        mockGameData.Items[0].players,
        event.userId
      );
    });

    it(`should return an error when 'startGame' doesn't return a startGameData`, async () => {
      const mockGameData = {
        Count: 1,
        Items: [
          {
            owner: 'player-owner-id',
            status: 'game-status',
            players: [{}],
          },
        ],
      };
      const gameId = 'test-game-id';
      const event = {
        field: 'startGame',
        userId: 'testUserId',
        input: {
          gameId,
        },
      };

      jest.spyOn(startGame, 'startGame').mockReturnValue();
      jest.spyOn(dbOperation, 'findItem').mockReturnValue(mockGameData);

      let res;
      await graphqlHandler(event, {}, (_error, response) => {
        res = response;
      });

      expect(res).toEqual({ error: 'Cannot start the game' });
    });

    it(`should return a valid startGameData when the request is successful`, async () => {
      const mockGameData = {
        Count: 1,
        Items: [
          {
            owner: 'player-owner-id',
            status: 'game-status',
            players: [{}],
          },
        ],
      };
      const gameId = 'test-game-id';
      const event = {
        field: 'startGame',
        userId: 'testUserId',
        input: {
          gameId,
        },
      };
      const mockResponse = { status: 'ok' };
      const expectedResult = {
        id: gameId,
        values: mockResponse,
      };
      jest.spyOn(startGame, 'startGame').mockReturnValue(mockResponse);
      jest.spyOn(dbOperation, 'findItem').mockReturnValue(mockGameData);

      let res;
      await graphqlHandler(event, {}, (_error, response) => {
        res = response;
      });

      expect(res).toEqual(expectedResult);
    });
  });
});
