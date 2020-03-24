export interface Player {
  id: string;
  name: string;
  userId: string;
}

export interface GameData {
  id: string;
  name: string;
  players: Player[];
}
