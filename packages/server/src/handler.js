const { findItem } = require('./helpers/db-operations');
const { doesItemExist } = require('./helpers/does-item-exists');
const { whoAmI } = require('./eventHandlers/who-am-i');
const { createGame } = require('./eventHandlers/create-game');
const { startGame } = require('./eventHandlers/start-game');

const gameTemplates = [
  { id: '001', name: 'Italy', tiles: 100, board: [10, 10] },
  { id: '002', name: 'Food', tiles: 100, board: [10, 10] },
  { id: '003', name: 'World', tiles: 100, board: [10, 10] },
  { id: '004', name: 'Animals', tiles: 100, board: [10, 10] },
];

exports.graphqlHandler = async (event, context, callback) => {
  const { field, owner, input } = event;
  console.log('event', event);

  switch (field) {
    case 'whoAmI': {
      const { userId } = event;

      let userData;
      try {
        userData = await whoAmI(userId);
      } catch (err) {
        console.log(err);
        return null;
      }

      return userData;
    }

    case 'createGame': {
      const { name, size, players, template } = input;
      const gameTemplate = gameTemplates.find(currTemplate => currTemplate.id === template);

      let newGameData;
      try {
        newGameData = await createGame(owner, name, size, players, template, gameTemplate);
      } catch (err) {
        callback(null, { error: 'Something went wrong while generating a new game' });
      }

      console.log('newGameData', newGameData);

      const { values, gameName } = newGameData;

      if (gameName) {
        callback(null, { id: gameName, values });
      } else {
        callback(null, { error: 'Cannot find an available game name' });
      }

      break;
    }

    case 'startGame': {
      const { input, userId } = event;
      const { gameId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
      }

      const gameDataItem = gameData.Items[0];
      const players = (gameDataItem && gameDataItem.players) || [];

      let startGameData;
      try {
        startGameData = await startGame(players, userId);
      } catch (err) {
        callback(null, { error: 'Something went wrong while starting the game' });
      }

      if (startGameData) {
        callback(null, { id: gameId, values: startGameData });
      } else {
        callback(null, { error: 'Cannot start the game' });
      }

      break;
    }

    case 'claimPlayer': {
      const { input, userId } = event;
      const { gameId, playerId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
      }

      const gameDataItem = gameData.Items[0];
      const players = (gameDataItem && gameDataItem.players) || [];
      const teams = gameDataItem.teams;

      const playersUpdated = players.map(player => {
        if (`${player.id}` === `${playerId}`) {
          return {
            ...player,
            userId,
          };
        }
        return player;
      });

      const assignedPlayers = playersUpdated.filter(player => player.userId);
      let playerTurnUpdated = gameDataItem.playerTurn;

      if (assignedPlayers.length === teams) {
        playerTurnUpdated = playersUpdated[0];
      }

      const values = {
        players: playersUpdated,
        playerTurn: {
          ...playerTurnUpdated,
          turn: 0,
        },
      };

      callback(null, { id: gameId, values });

      break;
    }

    case 'checkoutTile': {
      const { input, userId } = event;
      const { gameId, tileId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
      }

      const gameDataItem = gameData.Items[0];
      const tiles = gameDataItem.tiles;
      const playerTurn = gameDataItem.playerTurn;
      const moves = gameDataItem.moves;
      const players = gameDataItem.players;
      let playersUpdated = players;

      if (userId !== playerTurn.userId) {
        callback(null, { error: `Invalid move` });
      }

      const currTile = tiles.find(tile => `${tile.id}` === `${tileId}`);
      const shouldUpdate = currTile.status === 'hidden';
      const isWin = playerTurn.turn === 2 && `${currTile.ref}` === playerTurn.tileRef;

      if (!shouldUpdate) {
        // Only hidden tile can be checked out. if already in show state. don't take any action
        callback(null, { id: gameId, values: {} });
      }

      if (!playerTurn.turn) {
        // Avoid player checking out more than 2 cards per turn
        callback(null, { id: gameId, values: {} });
      }

      let tilesUpdated = tiles.map(tile => {
        if (`${tile.id}` === `${tileId}` && !isWin) {
          return {
            ...tile,
            status: 'show',
          };
        }
        return tile;
      });

      const currPlayer = players.findIndex(player => player.id === playerTurn.id);
      const nextPlayer = currPlayer < players.length - 1 ? players[currPlayer + 1] : players[0];

      const updatePlayerTurn = () => {
        if (playerTurn.turn > 1 && !isWin) {
          return {
            ...nextPlayer,
            turn: 0,
          };
        } else if (playerTurn.turn > 1 && isWin) {
          return {
            ...playerTurn,
            turn: 1,
          };
        }

        return {
          ...playerTurn,
          turn: (playerTurn.turn || 0) + 1,
          tileRef: `${currTile.ref}`,
        };
      };

      const playerTurnUpdated = updatePlayerTurn();

      if (isWin) {
        tilesUpdated = tiles.map(tile => {
          if (`${tile.ref}` === `${currTile.ref}`) {
            return {
              ...tile,
              status: 'taken',
            };
          }
          return tile;
        });

        playersUpdated = players.map(player => {
          if (player.userId === userId) {
            return {
              ...player,
              score: (player.score || 0) + 1,
            };
          }

          return player;
        });
      }

      const values = {
        moves: moves + 1,
        tiles: tilesUpdated,
        playerTurn: playerTurnUpdated,
        players: playersUpdated,
      };

      callback(null, { id: gameId, values });

      break;
    }

    case 'playTurn': {
      const { input } = event;
      const { gameId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
      }

      const gameDataItem = gameData.Items[0];
      const tiles = gameDataItem.tiles.map(tile => ({
        ...tile,
        status: tile.status === 'taken' ? 'taken' : 'hidden',
      }));

      const playerTurnUpdated = {
        ...gameDataItem.playerTurn,
        turn: 1,
      };

      const values = {
        playerTurn: playerTurnUpdated,
        tiles,
      };

      console.log('values', values);
      callback(null, { id: gameId, values });

      break;
    }

    case 'templates': {
      callback(null, gameTemplates);
      break;
    }

    default: {
      callback(null, { error: `Unknown field, unable to resolve ${event.field}` });
      break;
    }
  }
};
