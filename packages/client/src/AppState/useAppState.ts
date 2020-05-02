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
  // awsUpdateUsername,
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
      await new Promise(res => setTimeout(res, 300));
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
      dispatch({ type: Types.LOADING, payload: true });
      const res = await updateUserMutation({
        variables: {
          updateUserInput: { displayName, avatar },
        },
      });

      if (res.data.updateUser) {
        dispatch({ type: Types.UPDATE_USER, payload: res.data.updateUser });
      }
      dispatch({ type: Types.LOADING, payload: false });
    },
    [dispatch, updateUserMutation]
  );

  // const updateUsername = useCallback(
  //   async (username: string) => {
  //     dispatch({ type: Types.LOADING, payload: true });
  //     try {
  //       await awsUpdateUsername(username);
  //     } catch (err) {
  //       dispatch({
  //         type: Types.CREATE_MESSAGE,
  //         payload: {
  //           message: err?.message || 'Something went wrong. Cannot update user information right now',
  //           severity: 'error',
  //           title: 'Error',
  //           show: true,
  //         },
  //       });
  //       dispatch({ type: Types.LOADING, payload: false });
  //       return false;
  //     }

  //     dispatch({
  //       type: Types.CREATE_MESSAGE,
  //       payload: {
  //         message: 'User information correctly updated',
  //         severity: 'success',
  //         title: 'Success',
  //         show: true,
  //       },
  //     });
  //     dispatch({ type: Types.LOADING, payload: false });
  //     return true;
  //   },
  //   [dispatch]
  // );

  const logOut = useCallback(async () => {
    dispatch({ type: Types.LOADING, payload: true });
    try {
      const res = await awsSignOut();

      if (res && res.error) {
        return { error: res.error.message || res.error };
      }
    } catch (err) {
      return { error: err.message || err };
    }

    window.location.reload();
  }, [dispatch]);

  const logIn = useCallback(
    async (username: string, password: string) => {
      dispatch({ type: Types.LOADING, payload: true });
      try {
        const res = await awsLogin(username, password);

        if (res.error) {
          dispatch({ type: Types.LOADING, payload: false });
          return { error: res.error.message || res.error };
        }

        if (res && res.confirmEmail) {
          dispatch({ type: Types.LOADING, payload: false });
          return { confirmEmail: true };
        }

        if (res.username) {
          window.location.href = '/';
        }
      } catch (err) {
        dispatch({ type: Types.LOADING, payload: false });
        return { error: err.message || err };
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (email: string, name: string, password: string) => {
      dispatch({ type: Types.LOADING, payload: true });

      let res;
      try {
        res = await awsRegister(email, name, password);

        if (res.error) {
          dispatch({ type: Types.LOADING, payload: false });
          return { error: res.error.message || res.error };
        }
      } catch (err) {
        dispatch({ type: Types.LOADING, payload: false });
        return { error: err.message || err };
      }

      dispatch({ type: Types.LOADING, payload: false });
      return res;
    },
    [dispatch]
  );

  const verifyEmail = useCallback(
    async (username: string, code: string) => {
      dispatch({ type: Types.LOADING, payload: true });

      let res;
      try {
        res = await awsVerifyEmail(username, code);

        if (res.error) {
          dispatch({ type: Types.LOADING, payload: false });
          return { error: res.error.message || res.error };
        }
      } catch (err) {
        dispatch({ type: Types.LOADING, payload: false });
        return { error: err.message || err };
      }

      dispatch({ type: Types.LOADING, payload: false });
      return res;
    },
    [dispatch]
  );

  const resendCode = useCallback(
    async (username: string) => {
      dispatch({ type: Types.LOADING, payload: true });

      try {
        await awsResendCode(username);
      } catch (err) {
        dispatch({ type: Types.LOADING, payload: false });
        return { error: err.message };
      }

      dispatch({ type: Types.LOADING, payload: false });
      return { status: true };
    },
    [dispatch]
  );

  const forgottenPassword = useCallback(
    async (username: string) => {
      dispatch({ type: Types.LOADING, payload: true });
      try {
        await awsForgottenPassword(username);
      } catch (err) {
        dispatch({ type: Types.LOADING, payload: false });
        return { error: err.message };
      }

      dispatch({ type: Types.LOADING, payload: false });
      return { status: true };
    },
    [dispatch]
  );

  const passwordReset = useCallback(
    async (username: string, code: string, password: string) => {
      dispatch({ type: Types.LOADING, payload: true });
      try {
        await awsResetPassword(username, code, password);
      } catch (err) {
        dispatch({ type: Types.LOADING, payload: false });
        return { error: err.message };
      }

      dispatch({ type: Types.LOADING, payload: false });
      return { status: true };
    },
    [dispatch]
  );

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
    userLoading: state.user.loading,
    updateUser,
    updateUserLoading,
    // updateUsername,
    loading: state.loading,
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
