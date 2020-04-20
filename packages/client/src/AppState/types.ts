export type MessageSeverity = 'info' | 'success' | 'warning' | 'error';

export interface MessageState {
  message?: string;
  title?: string;
  severity?: MessageSeverity;
  show: boolean;
}

export interface UserInvite {
  show: boolean;
  from?: string;
  gameId?: string;
}

export interface UserData {
  id: string;
  username: string;
  avatar: string;
}

export interface UserGames {
  completedGames: {
    id: string;
    name: string;
    createdAt: string;
  }[];
  activeGames: {
    id: string;
    name: string;
    createdAt: string;
    startedAt: string;
  }[];
}

export interface User {
  isAuthenticated: boolean;
  loading: boolean;
  user: UserData;
}

export enum Types {
  'CREATE_MESSAGE',
  'CLEAR_NOTIFICATION',
  'CLOSE_NOTIFICATION',
  'UPDATE_AVAILABLE',
  'AUTHENTICATE_USER',
  'UPDATE_USER',
  'USER_INVITE',
  'ACCEPT_INVITE',
  'CLEAR_INVITE',
}

export interface AppAction {
  type: Types;
  payload?: any;
}

export interface AppState {
  notifications: MessageState;
  userInvite: UserInvite;
  updateAvailable: boolean;
  user: User;
}
