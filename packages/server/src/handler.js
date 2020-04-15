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
        return;
      }

      const { values, gameName } = newGameData;

      if (gameName) {
        callback(null, { id: gameName, values });
      } else {
        callback(null, { error: 'Cannot find an available game name' });
      }

      break;
    }

    case 'deleteGame': {
      const { gameId } = event;

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

      let deleteGameData;
      try {
        deleteGameData = await deleteGame(owner, gameDataItem);
        console.log('deleteGameData', deleteGameData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while trying to delete the game' });
        return;
      }

      if (deleteGameData.error) {
        callback(null, { error: deleteGameData.error });
        return;
      }

      if (deleteGameData.allowRemoveUser) {
        callback(null, {
          allowRemoveUser: 'TRUE',
          id: gameId,
          users: deleteGameData.users,
          players: deleteGameData.players,
        });
        return;
      }

      if (deleteGameData.allowDeletion) {
        callback(null, { allowDeletion: 'TRUE', id: gameId });
        return;
      }

      callback(null, { error: 'Something went wrong while trying to delete the game' });
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

      let startGameData;
      try {
        startGameData = await startGame(gameOwner === userId, gameStatus, players, userId);
        console.log('startGameData', startGameData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while trying to start the game' });
      }

      if (startGameData) {
        callback(null, { id: gameId, values: startGameData });
      } else {
        callback(null, { error: 'Cannot start the game' });
      }

      break;
    }

    case 'getGame': {
      const { input } = event;
      const { gameId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!(gameExists && gameData.Items && gameData.Items[0])) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return;
      }

      const gameDataItem = gameData.Items[0];
      const { players = [], users = [], status } = gameDataItem;

      let claimPlayerData;
      try {
        claimPlayerData = await claimPlayer(owner, status, users, players, false);
        console.log('claimPlayerData', claimPlayerData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while trying to get the game information' });
      }

      if (!claimPlayerData.users) {
        callback(null, { id: gameId, values: claimPlayerData, update: false });
        return;
      }

      callback(null, { id: gameId, values: claimPlayerData });
      break;
    }

    case 'claimPlayer': {
      const { input, userId } = event;
      const { gameId } = input;
      const gameData = await findItem(gameId);
      const gameExists = doesItemExist(gameData);

      if (!(gameExists && gameData.Items && gameData.Items[0])) {
        callback(null, { error: `Game ${gameId} does not exist` });
        return;
      }

      const gameDataItem = gameData.Items[0];
      const { players = [], users = [], status } = gameDataItem;

      let claimPlayerData;
      try {
        claimPlayerData = await claimPlayer(userId, status, users, players, true);
        console.log('claimPlayerData', claimPlayerData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while trying to claim the player' });
      }

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

      let checkoutTileData;
      try {
        checkoutTileData = await checkoutTile(userId, gameStatus, players, playerTurn, tiles, currTile, tileId, moves);
        console.log('checkoutTileData', checkoutTileData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while trying to checkout the tile' });
      }

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

      let playTurnData;
      try {
        playTurnData = await playTurn(gameDataItem.tiles, gameDataItem.playerTurn, userId);
        console.log('playTurnData', playTurnData);
      } catch (err) {
        console.log(err);
        callback(null, { error: 'Something went wrong while trying to play the turn' });
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
};
