import { useCallback } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';

import { resolvers } from './useAuth.resolvers';
import { GET_USER, LOG_OUT } from './useAuth.graph';

interface UserData {
  id: string;
  username: string;
}

export const useAuth = () => {
  const client = useApolloClient();
  client.addResolvers(resolvers);

  const { loading: userDataLoading, data: whoAmIData } = useQuery<{ whoAmI: UserData }>(GET_USER);
  const [_logOut, { loading: logOutLoading }] = useMutation<void>(LOG_OUT);

  const logOut = useCallback(async () => {
    await _logOut();
  }, [_logOut]);

  const user = whoAmIData && whoAmIData.whoAmI;

  return {
    user,
    loading: userDataLoading,
    operationLoading: userDataLoading || logOutLoading,
    logOut,
  };
};
