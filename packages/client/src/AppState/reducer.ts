import { AppState, AppAction, Types } from './types';

const userIsAlive = () => {
  return {
    lastInteraction: Date.now(),
  };
};

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
        ...userIsAlive(),
        loading: false,
        refetchUser: false,
        user: {
          ...action.payload,
          loading: false,
        },
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
        ...userIsAlive(),
        userInvite: {
          show: false,
          from: undefined,
          gameId: undefined,
        },
      };

    case Types.CLEAR_INVITE:
      return {
        ...state,
        ...userIsAlive(),
        userInvite: {
          show: false,
          from: undefined,
          gameId: undefined,
        },
      };

    case Types.UPDATE_USER:
      return {
        ...state,
        ...userIsAlive(),
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
        ...userIsAlive(),
        playAgain: action.payload,
      };

    case Types.CLEAR_PLAY_AGAIN_DATA:
      return {
        ...state,
        ...userIsAlive,
        playAgain: undefined,
      };

    case Types.UPDATE_WORLD:
      return {
        ...state,
        world: action.payload?.getWorld,
      };

    case Types.LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case Types.USER_INTERACTION:
      return {
        ...state,
        ...userIsAlive(),
      };

    case Types.SET_USER_STATE:
      return {
        ...state,
        ...userIsAlive(),
        userStatus: action.payload,
      };

    case Types.REFETCH_USER:
      return {
        ...state,
        ...userIsAlive(),
        refetchUser: true,
        loading: true,
      };

    default:
      return state;
  }
};
