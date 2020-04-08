const { generateUniqueName } = require('../helpers/generate-unique-name');
const { gameTemplates } = require('../helpers/game-templates');

const tilesBase = {
  id: 0,
  ref: '01',
  status: 'hidden',
};

const shuffle = input => input.sort(() => Math.random() - 0.5);

const getRef = index => {
  const ref = Math.floor((index + 2) / 2);
  return ref < 10 ? `00${ref}` : `0${ref}`;
};

const newBoard = (rows, columns) => {
  const items = rows * columns;

  const tiles = new Array(items).fill('').reduce(
    (acc, _, currIndex) => [
      ...acc,
      {
        ...tilesBase,
        id: currIndex,
        ref: getRef(currIndex),
      },
    ],
    []
  );

  return shuffle(tiles);
};

const getBoardSizeFromTiles = (tiles = 100, gameTemplate) => {
  const maxTiles = gameTemplate.tiles;

  if (tiles > maxTiles) {
    return {
      gridX: gameTemplate.board[0],
      gridY: gameTemplate.board[1],
    };
  }

  switch (tiles) {
    case 100:
      return {
        gridX: 10,
        gridY: 10,
      };

    case 72:
      return {
        gridX: 8,
        gridY: 9,
      };

    case 48:
      return {
        gridX: 6,
        gridY: 8,
      };

    case 36:
      return {
        gridX: 6,
        gridY: 6,
      };

    default:
      return {
        gridX: gameTemplate.board[0],
        gridY: gameTemplate.board[1],
      };
  }
};

exports.createGame = async (owner, name, template, gameTiles) => {
  const gameTemplate = gameTemplates.find(currTemplate => currTemplate.id === template);
  const board = getBoardSizeFromTiles(gameTiles, gameTemplate);
  const players = [
    {
      id: 1,
      status: 'offline',
      userId: owner,
      moves: 0,
      pairs: 0,
    },
  ];
  const gameName = await generateUniqueName();
  const createdAt = new Date().toISOString();
  const tiles = newBoard(board.gridX, board.gridY);
  const values = {
    __typename: 'Game',
    createdAt,
    status: 'new',
    moves: 0,
    players,
    board,
    tiles,
    template,
    name,
    owner,
  };

  return { values, gameName };
};
