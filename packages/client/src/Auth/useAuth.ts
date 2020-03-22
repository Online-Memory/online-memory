import { useEffect, useCallback } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';

import { resolvers } from './useAuth.resolvers';
import { User } from './types';
import { GET_USER, GET_USER_DATA, LOG_OUT, CREATE_USER } from './useAuth.graph';

interface UserData {
  id: string;
  username: string;
}

export const useAuth = () => {
  const client = useApolloClient();
  client.addResolvers(resolvers);

  const { loading: userLoading, data } = useQuery<{ user: User }>(GET_USER);
  const { loading: userDataLoading, data: whoAmIData } = useQuery<{ whoAmI: UserData }>(GET_USER_DATA);
  const [_logOut, { loading: logOutLoading }] = useMutation<void>(LOG_OUT, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_USER }],
  });
  const [createUser, { loading: createUserLoading, called: createUserCalled }] = useMutation<void>(CREATE_USER, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_USER }, { query: GET_USER_DATA }],
  });

  const user = data && data.user;
  const userData = whoAmIData && whoAmIData.whoAmI;
  const isLoggedIn = Boolean(user && user.isLoggedIn);

  useEffect(() => {
    if (
      !createUserCalled &&
      user &&
      isLoggedIn &&
      !userLoading &&
      !userDataLoading &&
      !userData &&
      !createUserLoading &&
      typeof userData === 'object'
    ) {
      createUser();
    }
  }, [user, userData, userLoading, userDataLoading, isLoggedIn, createUserLoading, createUserCalled, createUser]);

  return {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    user: {
      ...user,
      ...userData,
    } as User,
    isLoggedIn,
    loading: userLoading || userDataLoading || createUserLoading,
    operationLoading: userLoading || userDataLoading || createUserLoading || logOutLoading || isLoggedIn,
    logOut: useCallback(async () => {
      _logOut();
    }, [_logOut]),
  };
};
