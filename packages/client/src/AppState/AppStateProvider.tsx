import React, { useReducer, createContext, useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Snackbar, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { GET_USER } from '../graphql';
import { currentAuthenticatedUser } from './AWS';
import { AppState, AppAction, UserData, Types } from './types';
import { reducer } from './reducer';
import * as serviceWorker from '../serviceWorker';

const initialState: AppState = {
  notifications: {
    message: undefined,
    severity: undefined,
    show: false,
  },
  userInvite: {
    show: false,
    from: undefined,
    gameId: undefined,
  },
  updateAvailable: false,
  user: {
    isAuthenticated: false,
    loading: true,
    user: {
      id: '',
      avatar: '',
      username: '',
    },
  },
};

interface AppContextType {
  state?: AppState;
  dispatch?: React.Dispatch<AppAction>;
}

export const AppStateContext = createContext<AppContextType>({});

export const AppStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading: userDataLoading, data: whoAmIData } = useQuery<{ whoAmI: UserData }>(GET_USER);

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
          if (!state.user.isAuthenticated) {
            dispatch({
              type: Types.AUTHENTICATE_USER,
              payload: { isAuthenticated: true, loading: false, user: whoAmIData && whoAmIData.whoAmI },
            });
          }
        } else {
          dispatch({
            type: Types.AUTHENTICATE_USER,
            payload: { isAuthenticated: false, loading: false, user: initialState.user.user },
          });
        }
      } catch (err) {
        dispatch({
          type: Types.AUTHENTICATE_USER,
          payload: { isAuthenticated: false, loading: false, user: initialState.user.user },
        });
      }
    };

    if (!userDataLoading) {
      getUser();
    } else {
      dispatch({
        type: Types.AUTHENTICATE_USER,
        payload: { isAuthenticated: false, loading: true, user: initialState.user.user },
      });
    }
  }, [state.user.isAuthenticated, userDataLoading, whoAmIData]);

  const ignoreInvite = useCallback(() => {
    dispatch({ type: Types.CLEAR_INVITE });
  }, []);

  const acceptInvite = useCallback(() => {
    dispatch({ type: Types.ACCEPT_INVITE });
    window.location.href = `/game/${state.userInvite.gameId}`;
  }, [state.userInvite]);

  const clearNotification = useCallback(() => {
    dispatch({ type: Types.CLEAR_NOTIFICATION });
  }, [dispatch]);

  const closeNotification = useCallback(
    (_event: any, reason: string) => {
      if (reason === 'timeout') {
        dispatch({ type: Types.CLOSE_NOTIFICATION });
      }
    },
    [dispatch]
  );

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
};
