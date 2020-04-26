import { AppState, AppAction, Types } from './types';

export const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case Types.CREATE_MESSAGE:
      return {
        ...state,
        notifications: {
          show: true,
          message: action.payload.message,
          severity: action.payload.severity,
          title: action.payload.title,
        },
      };

    case Types.CLEAR_NOTIFICATION:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          message: undefined,
          severity: undefined,
          title: undefined,
        },
      };

    case Types.CLOSE_NOTIFICATION:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          show: false,
        },
      };

    case Types.UPDATE_AVAILABLE:
      return { ...state, updateAvailable: true };

    case Types.AUTHENTICATE_USER:
      return {
        ...state,
        user: action.payload,
      };

    case Types.USER_INVITE:
      return {
        ...state,
        userInvite: {
          show: true,
          from: action.payload.from,
          gameId: action.payload.gameId,
        },
      };

    case Types.ACCEPT_INVITE:
      return {
        ...state,
        userInvite: {
          show: false,
          from: undefined,
          gameId: undefined,
        },
      };

    case Types.CLEAR_INVITE:
      return {
        ...state,
        userInvite: {
          show: false,
          from: undefined,
          gameId: undefined,
        },
      };

    case Types.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          user: {
            ...state.user.user,
            displayName: action.payload.displayName,
            avatar: action.payload.avatar,
          },
        },
      };

    case Types.PLAY_AGAIN:
      return {
        ...state,
        playAgain: action.payload,
      };

    case Types.CLEAR_PLAY_AGAIN_DATA:
      return {
        ...state,
        playAgain: undefined,
      };

    default:
      return state;
  }
};
