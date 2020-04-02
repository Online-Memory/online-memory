export interface Player {
  id: string;
  name: string;
  moves: number;
  pairs: number;
  status?: string;
  userId?: string;
  turn?: number;
  score?: number;
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
  status: string;
  template: string;
  moves: number;
  players: Player[];
  playerTurn: Player;
  board: Board;
  tiles: Tile[];
  createdAt: string;
  startedAt: string;
  updatedAt: string;
}
