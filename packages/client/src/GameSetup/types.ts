export interface Player {
  id: number;
  name: string;
  active: boolean;
}

export interface Template {
  id: string;
  name: string;
  tiles: number;
  board: number[];
}
