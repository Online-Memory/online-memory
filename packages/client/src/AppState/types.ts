import { GameData } from '../Game/types';

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

export interface UserFriend {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  avatar: string;
  friends: UserFriend[];
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
  CREATE_MESSAGE = 'CREATE_MESSAGE',
  CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION',
  CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION',
  UPDATE_AVAILABLE = 'UPDATE_AVAILABLE',
  AUTHENTICATE_USER = 'AUTHENTICATE_USER',
  UPDATE_USER = 'UPDATE_USER',
  REFETCH_USER = 'REFETCH_USER',
  USER_INVITE = 'USER_INVITE',
  ACCEPT_INVITE = 'ACCEPT_INVITE',
  CLEAR_INVITE = 'CLEAR_INVITE',
  PLAY_AGAIN = 'PLAY_AGAIN',
  CLEAR_PLAY_AGAIN_DATA = 'CLEAR_PLAY_AGAIN_DATA',
  UPDATE_WORLD = 'UPDATE_WORLD',
  LOADING = 'LOADING',
  USER_INTERACTION = 'USER_INTERACTION',
  SET_USER_STATE = 'SET_USER_STATE',
}

export interface AppAction {
  type: Types;
  payload?: any;
}

export interface World {
  onlineUsers: number;
}

export enum UserStatus {
  'AVAILABLE',
  'BUSY',
  'OFFLINE',
}

export interface AppState {
  refetchUser: boolean;
  lastInteraction: number;
  userStatus: UserStatus;
  notifications: MessageState;
  userInvite: UserInvite;
  updateAvailable: boolean;
  user: User;
  loading: boolean;
  playAgain?: GameData;
  world: World;
}
