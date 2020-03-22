import { Resolvers } from 'apollo-client';

import { awsSignOut, getCurrentUser, AWSUser } from './AWS';
import { GET_USER } from './useAuth.graph';
import { User } from './types';

const userInitialState: User = {
  __typename: 'UserSession',
  isLoggedIn: false,
  username: '',
  email: '',
  error: '',
  info: '',
};

export const resolvers: Resolvers = {
  Query: {
    async user(parent, _, { cache }) {
      const currUser = parent.user;

      const data: User = {
        ...userInitialState,
        ...currUser,
      };

      let user: AWSUser | void = undefined;
      try {
        user = await getCurrentUser();
      } catch (err) {
        data.error = err.message || 'Error';
      }

      if (user) {
        data.isLoggedIn = true;
        data.email = user.attributes.email;
      }

      cache.writeData({ data: { user: data } });
      return data;
    },
  },

  Mutation: {
    async logOut(_, __, { cache }): Promise<void> {
      const currState = cache.readQuery({ query: GET_USER });
      const userData: User = { ...currState.user };

      try {
        await awsSignOut();
      } catch (err) {
        userData.error = err.message || 'Error';
        cache.writeData({ data: { user: userData } });
        return;
      }

      userData.isLoggedIn = false;
      userData.username = '';
      userData.email = '';
      userData.error = '';
      userData.info = 'You are now logged out';

      cache.writeData({ data: { user: userData } });
    },
  },
};
