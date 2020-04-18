const { findItem } = require('./helpers/db-operations');
const { doesItemExist } = require('./helpers/does-item-exists');
const { gameTemplates } = require('./helpers/game-templates');
const { whoAmI } = require('./eventHandlers/who-am-i');
const { createGame } = require('./eventHandlers/create-game');
const { startGame } = require('./eventHandlers/start-game');
const { claimPlayer } = require('./eventHandlers/claim-player');
const { playTurn } = require('./eventHandlers/play-turn');
const { checkoutTile } = require('./eventHandlers/checkout-tile');
const { deleteGame } = require('./eventHandlers/delete-game');

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
      const { name, template, tiles } = input;

      let newGameData;
      try {
        newGameData = await createGame(owner, name, template, tiles);
        console.log('newGameData', newGameData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while generating a new game' });
        return null;
      }

      const { values, gameName } = newGameData;

      if (gameName) {
        callback(null, { id: gameName, values });
        return null;
      }
      callback(null, { error: 'Cannot find an available game name' });
      break;
    }

    case 'deleteGame': {
      const { gameId } = event;

      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return null;
      }

      const gameDataItem = gameData.Items[0];
      if (!gameDataItem) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return null;
      }

      let deleteGameData;
      try {
        deleteGameData = await deleteGame(owner, gameDataItem);
        console.log('deleteGameData', deleteGameData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while trying to delete the game' });
        return null;
      }

      if (deleteGameData.error) {
        callback(null, { error: deleteGameData.error });
        return null;
      }

      if (deleteGameData.allowRemoveUser) {
        callback(null, {
          allowRemoveUser: 'TRUE',
          id: gameId,
          users: deleteGameData.users,
          players: deleteGameData.players,
        });
        return null;
      }

      if (deleteGameData.allowDeletion) {
        callback(null, { allowDeletion: 'TRUE', id: gameId });
        return null;
      }

      callback(null, { error: 'Something went wrong while trying to delete the game' });
      break;
    }

    case 'startGame': {
      const { userId } = event;
      const { gameId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return null;
      }

      const gameDataItem = gameData.Items[0];

      if (!gameDataItem) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return null;
      }

      const { players } = gameDataItem;
      const gameOwner = gameDataItem.owner;
      const gameStatus = gameDataItem.status;

      if (!gameOwner || !players) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return null;
      }

      let startGameData;
      try {
        startGameData = await startGame(gameOwner === userId, gameStatus, players, userId);
        console.log('startGameData', startGameData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while trying to start the game' });
        return null;
      }

      if (startGameData) {
        callback(null, { id: gameId, values: startGameData });
        return null;
      }
      callback(null, { error: 'Cannot start the game' });
      break;
    }

    case 'getGame': {
      const { gameId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!(gameExists && gameData.Items && gameData.Items[0])) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return null;
      }

      callback(null, { id: gameId, values: {}, update: false });
      break;
    }

    case 'claimPlayer': {
      const { userId } = event;
      const { gameId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!(gameExists && gameData.Items && gameData.Items[0])) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return null;
      }

      const gameDataItem = gameData.Items[0];
      const { players, users, status } = gameDataItem;

      let claimPlayerData;
      try {
        claimPlayerData = await claimPlayer(userId, status, users, players);
        console.log('claimPlayerData', claimPlayerData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while trying to claim the player' });
        return null;
      }

      callback(null, { id: gameId, values: claimPlayerData });
      break;
    }

    case 'checkoutTile': {
      const { userId } = event;
      const { gameId, tileId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return null;
      }

      const gameDataItem = gameData.Items[0];
      const { tiles } = gameDataItem;
      const { playerTurn } = gameDataItem;
      const { moves } = gameDataItem;
      const { players } = gameDataItem;
      const gameStatus = gameDataItem.status;

      if (gameStatus === 'ended') {
        callback(null, { error: `Cannot update an already ended game` });
        return null;
      }
      if (userId !== playerTurn.userId) {
        callback(null, { error: `Invalid move` });
        return null;
      }

      const currTile = tiles.find(tile => `${tile.id}` === `${tileId}`);

      if (!currTile.status === 'hidden') {
        // Only hidden tile can be checked out. if already in show state. don't take any action
        callback(null, { error: `Invalid move. Cannot flip this tile` });
        return null;
      }

      if (playerTurn.status === 'idle' || !playerTurn.turn) {
        // Avoid player checking out more than 2 cards per turn
        callback(null, { error: `Invalid move. User not allowed to flip tiles` });
        return null;
      }

      let checkoutTileData;
      try {
        checkoutTileData = await checkoutTile(userId, players, playerTurn, tiles, currTile, tileId, moves);
        console.log('checkoutTileData', checkoutTileData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while trying to checkout the tile' });
        return null;
      }

      callback(null, { id: gameId, values: checkoutTileData });
      break;
    }

    case 'playTurn': {
      const { userId } = event;
      const { gameId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return null;
      }

      const gameDataItem = gameData.Items[0];
      const { playerTurn, tiles } = gameDataItem;

      let playTurnData;
      try {
        playTurnData = await playTurn(tiles, playerTurn, userId);
        console.log('playTurnData', playTurnData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while trying to play the turn' });
        return null;
      }

      if (playTurnData.error) {
        callback(null, { error: playTurnData.error });
        return null;
      }

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

  return null;
};
