import { useCallback, useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import {
  currentAuthenticatedUser,
  awsLogin,
  awsRegister,
  awsVerifyEmail,
  awsResendCode,
  awsForgottenPassword,
  awsResetPassword,
} from './AWS';
import { resolvers } from './useAuth.resolvers';
import { GET_USER, LOG_OUT } from '../graphql';

export interface UserData {
  id: string;
  username: string;
  avatar: string;
  completedGames: {
    id: string;
  }[];
  activeGames: {
    id: string;
  }[];
}

export const useAuth = () => {
  const client = useApolloClient();
  client.addResolvers(resolvers);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const { loading: userDataLoading, data: whoAmIData } = useQuery<{ whoAmI: UserData }>(GET_USER);
  const [_logOut, { loading: logOutLoading }] = useMutation<void>(LOG_OUT);

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

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await currentAuthenticatedUser();
        if (user) {
          if (!isAuthenticatedUser) {
            setIsAuthenticatedUser(true);
          }
        } else {
          setIsAuthenticatedUser(false);
        }
      } catch (err) {
        setIsAuthenticatedUser(false);
      }
    };

    getUser();
  }, [isAuthenticatedUser]);

  const logOut = useCallback(async () => {
    await _logOut();
  }, [_logOut]);

  const user = whoAmIData && whoAmIData.whoAmI;

  return {
    user,
    isAuthenticated: isAuthenticatedUser,
    loading: userDataLoading,
    operationLoading: userDataLoading || logOutLoading,
    logIn,
    register,
    verifyEmail,
    forgottenPassword,
    passwordReset,
    resendCode,
    logOut,
  };
};
