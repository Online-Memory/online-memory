import { useCallback, useContext } from 'react';
import { AppStateContext } from './AppStateProvider';
import { useHistory } from 'react-router-dom';
import { MessageSeverity, Types } from './types';
import {
  awsSignOut,
  awsLogin,
  awsRegister,
  awsVerifyEmail,
  awsResendCode,
  awsForgottenPassword,
  awsResetPassword,
} from './AWS';
import { UPDATE_USER, GET_USER } from '../graphql';
import { useMutation } from '@apollo/react-hooks';
import { GameData } from '../Game/types';

export const useAppState = () => {
  const { state, dispatch } = useContext(AppStateContext);
  const history = useHistory();

  if (dispatch === undefined || state === undefined) {
    throw new Error('must be used within a Provider');
  }

  const [updateUserMutation, { loading: updateUserLoading }] = useMutation(UPDATE_USER, {
    onError: err => {
      console.warn(err);
    },
    refetchQueries: [{ query: GET_USER }],
  });

  const showMessage = useCallback(
    async (message: string, severity: MessageSeverity, title?: string) => {
      dispatch({ type: Types.CLEAR_NOTIFICATION });
      dispatch({ type: Types.CLOSE_NOTIFICATION });
      await new Promise(res => setTimeout(res, 250));
      dispatch({
        type: Types.CREATE_MESSAGE,
        payload: {
          message,
          severity,
          title,
          show: true,
        },
      });
    },
    [dispatch]
  );

  const showUserInvite = useCallback(
    (from: string, gameId: string) => {
      dispatch({
        type: Types.USER_INVITE,
        payload: { from, gameId },
      });
    },
    [dispatch]
  );

  const updateUser = useCallback(
    async (displayName: string, avatar: string) => {
      const res = await updateUserMutation({
        variables: {
          updateUserInput: { displayName, avatar },
        },
      });

      if (res.data.updateUser) {
        dispatch({ type: Types.UPDATE_USER, payload: res.data.updateUser });
      }
    },
    [dispatch, updateUserMutation]
  );

  const logOut = useCallback(async () => {
    try {
      const res = await awsSignOut();

      if (res && res.error) {
        return { error: res.error.message || res.error };
      }
    } catch (err) {
      return { error: err.message || err };
    }

    window.location.reload();
  }, []);

  const logIn = useCallback(async (username: string, password: string) => {
    try {
      const res = await awsLogin(username, password);

      if (res.error) {
        return { error: res.error.message || res.error };
      }

      if (res && res.confirmEmail) {
        return { confirmEmail: true };
      }

      if (res.username) {
        window.location.href = '/';
      }
    } catch (err) {
      return { error: err.message || err };
    }
  }, []);

  const register = useCallback(async (email: string, name: string, password: string) => {
    let res;
    try {
      res = await awsRegister(email, name, password);

      if (res.error) {
        return { error: res.error.message || res.error };
      }
    } catch (err) {
      return { error: err.message || err };
    }

    return res;
  }, []);

  const verifyEmail = useCallback(async (username: string, code: string) => {
    let res;
    try {
      res = await awsVerifyEmail(username, code);

      if (res.error) {
        return { error: res.error.message || res.error };
      }
    } catch (err) {
      return { error: err.message || err };
    }

    return res;
  }, []);

  const resendCode = useCallback(async (username: string) => {
    try {
      await awsResendCode(username);
    } catch (err) {
      return { error: err.message };
    }

    return { status: true };
  }, []);

  const forgottenPassword = useCallback(async (username: string) => {
    try {
      await awsForgottenPassword(username);
    } catch (err) {
      return { error: err.message };
    }

    return { status: true };
  }, []);

  const passwordReset = useCallback(async (username: string, code: string, password: string) => {
    try {
      await awsResetPassword(username, code, password);
    } catch (err) {
      return { error: err.message };
    }

    return { status: true };
  }, []);

  const playAgain = useCallback(
    (gameData: GameData) => {
      dispatch({ type: Types.PLAY_AGAIN, payload: gameData });
      history.push('/new');
    },
    [dispatch, history]
  );

  const clearPlayAgainData = useCallback(() => {
    dispatch({ type: Types.CLEAR_PLAY_AGAIN_DATA });
  }, [dispatch]);

  return {
    showMessage,
    showUserInvite,
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user,
    world: state.world,
    authLoading: state.user.loading,
    updateUser,
    updateUserLoading,
    logIn,
    register,
    verifyEmail,
    forgottenPassword,
    passwordReset,
    resendCode,
    logOut,
    playAgain,
    clearPlayAgainData,
    playAgainData: state.playAgain,
  };
};
