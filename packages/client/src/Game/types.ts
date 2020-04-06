export interface Player {
  id: string;
  name: string;
  moves: number;
  pairs: number;
  status?: string;
  userId?: string;
  turn?: number;
}

export interface PlayerTurn {
  name: string;
  id: string;
  status: string;
  userId: string;
  turn?: number;
  tileRef?: string;
  currentPlaying?: string;
}

export interface Tile {
  id: number;
  ref: string;
  status: 'hidden' | 'show' | 'taken';
  owner?: string;
}

export interface Board {
  gridX: number;
  gridY: number;
}

export interface GameData {
  id: string;
  name: string;
  status: 'new' | 'idle' | 'started' | 'ended';
  template: string;
  moves: number;
  owner: string;
  players: Player[];
  playerTurn: PlayerTurn;
  board: Board;
  tiles: Tile[];
  createdAt: string;
  startedAt: string;
  updatedAt: string;
}
