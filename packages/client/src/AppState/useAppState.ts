import { useCallback, useContext } from 'react';
import { AppStateContext } from './AppStateProvider';
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

export const useAppState = () => {
  const { state, dispatch } = useContext(AppStateContext);

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
    (message: string, severity: MessageSeverity, title?: string) => {
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

  const updateUser = useCallback(
    async (username: string, avatar: string) => {
      const res = await updateUserMutation({
        variables: {
          updateUserInput: { username, avatar },
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

  const register = useCallback(async (username: string, password: string) => {
    let res;
    try {
      res = await awsRegister(username, password);

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

  return {
    showMessage,
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user,
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
  };
};
