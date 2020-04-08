const { generateUniqueName } = require('../helpers/generate-unique-name');

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

exports.createGame = async (owner, name, template, gameTemplate) => {
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
  const board = {
    gridX: gameTemplate.board[0],
    gridY: gameTemplate.board[1],
  };
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
