import { Resolvers } from 'apollo-client';

import { awsSignOut } from './AWS';

export const resolvers: Resolvers = {
  Mutation: {
    async logOut(): Promise<void> {
      try {
        await awsSignOut();
      } catch (err) {
        console.error('Error', err);

        return;
      }
    },
  },
};
