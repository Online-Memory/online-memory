const { findItem } = require('./helpers/db-operations');
const { doesItemExist } = require('./helpers/does-item-exists');
const { gameTemplates } = require('./helpers/game-templates');
const { whoAmI } = require('./eventHandlers/who-am-i');
const { createGame } = require('./eventHandlers/create-game');
const { startGame } = require('./eventHandlers/start-game');
const { claimPlayer } = require('./eventHandlers/claim-player');
const { playTurn } = require('./eventHandlers/play-turn');
const { checkoutTile } = require('./eventHandlers/checkout-tile');

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

      callback(null, userData);
      break;
    }

    case 'createGame': {
      const { name, template } = input;
      const gameTemplate = gameTemplates.find(currTemplate => currTemplate.id === template);

      let newGameData;
      try {
        newGameData = await createGame(owner, name, template, gameTemplate);
      } catch (err) {
        callback(null, { error: 'Something went wrong while generating a new game' });
        return;
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
        return;
      }

      const gameDataItem = gameData.Items[0];

      if (!gameDataItem) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return;
      }

      const players = gameDataItem.players || [];
      const gameOwner = gameDataItem.owner;
      const gameStatus = gameDataItem.status;

      const startGameData = await startGame(gameOwner === userId, gameStatus, players, userId);
      console.log(startGameData);

      if (startGameData) {
        callback(null, { id: gameId, values: startGameData });
      } else {
        callback(null, { error: 'Cannot start the game' });
      }

      break;
    }

    case 'claimPlayer': {
      const { input, userId } = event;
      const { gameId, playerName } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return;
      }

      const gameDataItem = gameData.Items[0];
      const players = (gameDataItem && gameDataItem.players) || [];

      const claimPlayerData = await claimPlayer(userId, players, playerName);

      callback(null, { id: gameId, values: claimPlayerData });
      break;
    }

    case 'checkoutTile': {
      const { input, userId } = event;
      const { gameId, tileId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return;
      }

      const gameDataItem = gameData.Items[0];
      const tiles = gameDataItem.tiles;
      const playerTurn = gameDataItem.playerTurn;
      const moves = gameDataItem.moves;
      const players = gameDataItem.players;
      const gameStatus = gameDataItem.status;

      if (gameStatus === 'ended') {
        callback(null, { error: `Cannot update an already ended game` });
        return;
      }
      if (userId !== playerTurn.userId) {
        callback(null, { error: `Invalid move` });
        return;
      }

      const currTile = tiles.find(tile => `${tile.id}` === `${tileId}`);

      if (!currTile.status === 'hidden') {
        // Only hidden tile can be checked out. if already in show state. don't take any action
        callback(null, { error: `Invalid move. Cannot flip this tile` });
        return;
      }

      if (playerTurn.status === 'idle' || !playerTurn.turn) {
        // Avoid player checking out more than 2 cards per turn
        callback(null, { error: `Invalid move. User not allowed to flip tiles` });
        return;
      }

      const checkoutTileData = await checkoutTile(
        userId,
        gameStatus,
        players,
        playerTurn,
        tiles,
        currTile,
        tileId,
        moves
      );
      console.log('checkoutTileData', checkoutTileData);

      callback(null, { id: gameId, values: checkoutTileData });
      break;
    }

    case 'playTurn': {
      const { input, userId } = event;
      const { gameId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return;
      }

      const gameDataItem = gameData.Items[0];

      if (!gameDataItem.playerTurn) {
        callback(null, { error: `Cannot update this game. A playerTurn must be available in the game first` });
        return;
      }
      if (gameDataItem.playerTurn.status !== 'idle') {
        callback(null, { error: `Player cannot play turn at this point since they're not in idle state` });
        return;
      }

      const playTurnData = await playTurn(gameDataItem.tiles, gameDataItem.playerTurn, userId);

      console.log('playTurnData', playTurnData);
      callback(null, { id: gameId, values: playTurnData });

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
