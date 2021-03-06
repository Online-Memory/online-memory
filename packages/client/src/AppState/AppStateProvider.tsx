import React, { useReducer, createContext, useCallback, useEffect, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useBrowserNotifications } from 'use-browser-notifications';
import { Snackbar, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { GET_USER, GET_WORLD } from '../graphql';
import { currentAuthenticatedUser } from './AWS';
import { AppState, AppAction, UserData, Types, World, UserStatus } from './types';
import { reducer } from './reducer';
import * as serviceWorker from '../serviceWorker';

const initialState: AppState = {
  darkMode: false,
  refetchUser: false,
  lastInteraction: Date.now(),
  userStatus: UserStatus.AVAILABLE,
  notifications: {
    message: undefined,
    severity: undefined,
    show: false,
  },
  browserNotifications: {
    show: false,
  },
  userInvite: {
    show: false,
    from: undefined,
    gameId: undefined,
  },
  world: {
    onlineUsers: 1,
  },
  updateAvailable: false,
  loading: false,
  user: {
    isAuthenticated: false,
    loading: true,
    user: {
      id: '',
      avatar: '',
      username: '',
      email: '',
      emailVerified: false,
      displayName: '',
      createdAt: 0,
      friends: [],
      stats: {
        wins: 0,
        gamesPlayed: 0,
        totalPairs: 0,
        totalMoves: 0,
        streak: 0,
        gamePairs: 0,
        gameStreak: 0,
      },
    },
  },
};

interface AppContextType {
  state?: AppState;
  dispatch?: React.Dispatch<AppAction>;
}

export const AppStateContext = createContext<AppContextType>({});

export const AppStateProvider: React.FC = memo(({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();
  const { show } = useBrowserNotifications({
    title: 'WMC',
    requireInteraction: true,
    disableActiveWindow: false,
    badge: 'https://raw.githubusercontent.com/Online-Memory/online-memory/master/assets/img/WMC_icon_192.png',
    icon: 'https://raw.githubusercontent.com/Online-Memory/online-memory/master/assets/img/WMC_icon_192.png',
  });
  const { loading: userDataLoading, data: whoAmIData, refetch: refetchWhoAmI } = useQuery<{
    whoAmI: UserData;
  }>(GET_USER, {
    onError: err => {
      console.warn(err);
    },
  });

  const { startPolling, stopPolling } = useQuery<{ world: World }>(GET_WORLD, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: worldData => {
      dispatch({ type: Types.UPDATE_WORLD, payload: worldData });
    },
    onError: () => {
      dispatch({ type: Types.REFETCH_USER });
    },
  });

  useEffect(() => {
    serviceWorker.register({
      onUpdate: (reg: any) => {
        const registrationWaiting = reg.waiting;
        if (registrationWaiting) {
          registrationWaiting.postMessage({ type: 'SKIP_WAITING' });
          registrationWaiting.addEventListener('statechange', (e: any) => {
            if (e.target.state === 'activated') {
              dispatch({ type: Types.UPDATE_AVAILABLE });
            }
          });
        }
      },
    });
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await currentAuthenticatedUser();

        if (user) {
          if (!whoAmIData?.whoAmI?.id) {
            dispatch({ type: Types.REFETCH_USER });
          }

          if (!state.user.isAuthenticated) {
            startPolling(7000);
          }
          dispatch({
            type: Types.AUTHENTICATE_USER,
            payload: {
              isAuthenticated: true,
              user: whoAmIData && whoAmIData.whoAmI,
            },
          });
        } else {
          dispatch({
            type: Types.AUTHENTICATE_USER,
            payload: {
              isAuthenticated: false,
              user: initialState.user.user,
            },
          });
          stopPolling();
        }
      } catch (err) {
        dispatch({
          type: Types.AUTHENTICATE_USER,
          payload: {
            isAuthenticated: false,
            user: initialState.user.user,
          },
        });
        stopPolling();
      }
    };

    if (!userDataLoading) {
      getUser();
    }

    if (state.refetchUser) {
      refetchWhoAmI()
        .then(() => {
          getUser();
        })
        .catch(_err => {
          getUser();
        });
    }
  }, [
    refetchWhoAmI,
    startPolling,
    state.refetchUser,
    state.user.isAuthenticated,
    stopPolling,
    userDataLoading,
    whoAmIData,
  ]);

  useEffect(() => {
    if (state.browserNotifications.show) {
      show({
        tag: `${state.userInvite.from}-${state.userInvite.gameId}`,
        body: `User ${state.userInvite.from} is inviting you to play a game`,
        onClick: () => {
          dispatch({ type: Types.BROWSER_NOTIFICATION_SHOWED });
          dispatch({ type: Types.ACCEPT_INVITE });
          window.open(`/game/${state.userInvite.gameId}`);
        },
      });
    }
  }, [history, show, state.browserNotifications.show, state.userInvite.from, state.userInvite.gameId]);

  const ignoreInvite = useCallback(() => {
    dispatch({ type: Types.CLEAR_INVITE });
  }, []);

  const acceptInvite = useCallback(() => {
    dispatch({ type: Types.ACCEPT_INVITE });
    window.location.href = `/game/${state.userInvite.gameId}`;
  }, [state.userInvite.gameId]);

  const clearNotification = useCallback(() => {
    dispatch({ type: Types.CLEAR_NOTIFICATION });
  }, []);

  const closeNotification = useCallback((_event: any, reason: string) => {
    if (reason === 'timeout') {
      dispatch({ type: Types.CLOSE_NOTIFICATION });
    }
  }, []);

  const updateApp = useCallback(() => {
    window.location.reload();
  }, []);

  const { notifications, updateAvailable } = state;

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      <Snackbar
        open={notifications.show}
        autoHideDuration={4000}
        onClose={closeNotification}
        onExited={clearNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert elevation={8} variant="filled" severity={notifications.severity} color={notifications.severity}>
          {notifications.title && <AlertTitle>{notifications.title}</AlertTitle>}
          {notifications.message}
        </Alert>
      </Snackbar>
      <Snackbar open={updateAvailable} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          severity="info"
          variant="filled"
          color="info"
          elevation={8}
          action={
            <Button color="inherit" size="small" variant="outlined" onClick={updateApp}>
              UPDATE
            </Button>
          }
        >
          A new version of Online Memory is available.
        </Alert>
      </Snackbar>
      <Snackbar
        open={state.userInvite.show}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        style={{ top: '80px' }}
      >
        <Alert
          severity="info"
          color="warning"
          variant="filled"
          elevation={8}
          action={
            <>
              <Button color="secondary" size="small" variant="outlined" onClick={ignoreInvite}>
                IGNORE
              </Button>
              <Button
                style={{ marginLeft: '0.5em' }}
                color="inherit"
                size="small"
                variant="outlined"
                onClick={acceptInvite}
              >
                ACCEPT
              </Button>
            </>
          }
        >
          <AlertTitle>
            <span role="img" aria-label="hello emoji">
              👋
            </span>{' '}
            Hello!
          </AlertTitle>
          {state.userInvite.from} has invited you to play a game
        </Alert>
      </Snackbar>
      {children}
    </AppStateContext.Provider>
  );
});
