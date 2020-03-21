import { useState, useEffect } from 'react';

interface Tile {
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

export const useTiles = (rows: number, columns: number) => {
  const [gameTiles, setGameTiles] = useState<Tile[]>([]);
  const gridX = new Array(rows).fill('');
  const gridY = new Array(columns).fill('');
  const items = rows * columns;

  useEffect(() => {
    const tiles: Tile[] = new Array(items).fill('').reduce(
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

    setGameTiles(shuffle(tiles));
  }, [items]);

  const getTile = (tiles: Tile[], posX: number, posY: number, gridX: number): Tile => {
    const id = gridX * posY + posX;

    return tiles[id];
  };

  return {
    gridX,
    gridY,
    gameTiles,
    getTile,
  };
};
