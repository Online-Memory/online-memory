import React, { useReducer, createContext, useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Snackbar, Slide, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { GET_USER } from '../graphql';
import { currentAuthenticatedUser } from './AWS';
import { AppState, AppAction, UserData, Types } from './types';
import * as serviceWorker from '../serviceWorker';
import { reducer } from './reducer';

const initialState: AppState = {
  notifications: {
    message: undefined,
    severity: undefined,
    show: false,
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

type Direction = 'down' | 'left' | 'right' | 'up';

const Transition = ({ ...props }) => {
  return <Slide {...props} direction="down" />;
};

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

  const clearNotification = useCallback(() => {
    dispatch({ type: Types.CLEAR_NOTIFICATION });
  }, [dispatch]);

  const closeNotification = useCallback(() => {
    dispatch({ type: Types.CLOSE_NOTIFICATION });
  }, [dispatch]);

  const updateApp = useCallback(() => {
    window.location.reload();
  }, []);

  const { notifications, updateAvailable } = state;

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      <Snackbar
        open={notifications.show}
        autoHideDuration={3000}
        onClose={closeNotification}
        onExited={clearNotification}
        TransitionComponent={Transition}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert variant="standard" severity={notifications.severity} color={notifications.severity}>
          {notifications.title && <AlertTitle>{notifications.title}</AlertTitle>}
          {notifications.message}
        </Alert>
      </Snackbar>

      <Snackbar open={updateAvailable} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          severity="info"
          action={
            <Button color="default" size="small" onClick={updateApp}>
              UPDATE
            </Button>
          }
        >
          A new version of Online Memory is available.
        </Alert>
      </Snackbar>

      {children}
    </AppStateContext.Provider>
  );
};
