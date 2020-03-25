export interface Player {
  id: string;
  name: string;
  userId: string;
  turn?: number;
}

export interface Tile {
  id: number;
  ref: string;
  status: 'hidden' | 'show' | 'taken';
  owner: string;
}

export interface Board {
  gridX: number;
  gridY: number;
}

export interface GameData {
  id: string;
  name: string;
  players: Player[];
  playerTurn: Player;
  board: Board;
  tiles: Tile[];
}
