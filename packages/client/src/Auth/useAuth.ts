import { useCallback, useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';

import { currentAuthenticatedUser } from './AWS';
import { resolvers } from './useAuth.resolvers';
import { GET_USER, LOG_OUT } from './useAuth.graph';

export interface UserData {
  id: string;
  username: string;
}

export const useAuth = () => {
  const client = useApolloClient();
  client.addResolvers(resolvers);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const { loading: userDataLoading, data: whoAmIData } = useQuery<{ whoAmI: UserData }>(GET_USER);
  const [_logOut, { loading: logOutLoading }] = useMutation<void>(LOG_OUT);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await currentAuthenticatedUser();
        if (user) {
          if (!isAuthenticatedUser) {
            setIsAuthenticatedUser(true);
            // redirect
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
    logOut,
  };
};
