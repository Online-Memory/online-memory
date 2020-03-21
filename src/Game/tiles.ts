export interface Tile {
  id: number;
  ref: string;
  status: 'hidden' | 'show' | 'taken';
  owner: string;
}

const tilesBase: Tile = {
  id: 0,
  ref: '01',
  status: 'hidden',
  owner: '',
};

const shuffle = (array: Tile[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const getRef = (index: number) => {
  const ref = Math.floor((index + 2) / 2);
  return ref < 10 ? `00${ref}` : `0${ref}`;
};

export const getTiles = (rows: number, columns: number): { gridX: number[]; gridY: number[]; gameTiles: Tile[] } => {
  const gridX = new Array(rows).fill('');
  const gridY = new Array(columns).fill('');

  const items = rows * columns;

  const tiles: Tile[] = new Array(items).fill('').reduce((acc, _, currIndex) => {
    return [
      ...acc,
      {
        ...tilesBase,
        id: currIndex,
        ref: getRef(currIndex),
      },
    ];
  }, []);

  const gameTiles = shuffle(tiles);

  return {
    gridX,
    gridY,
    gameTiles,
  };
};
