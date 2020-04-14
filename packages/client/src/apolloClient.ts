import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createAuthLink, AuthOptions } from 'aws-appsync-auth-link';
import { onError } from 'apollo-link-error';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { Auth } from 'aws-amplify';

import { AMPLIFY, API_URL } from './config';

const cache = new InMemoryCache();

const httpUri = `${API_URL}/graphql`;

const httpLink = createHttpLink({
  uri: httpUri,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const auth: AuthOptions = {
  type: 'AMAZON_COGNITO_USER_POOLS',
  jwtToken: async () => {
    let jwt;

    try {
      const session = await Auth.currentSession();
      const accessToken = await session.getAccessToken();
      jwt = accessToken.getJwtToken();
    } catch (err) {
      jwt = '';
    }

    return jwt;
  },
};

const link = ApolloLink.from([
  errorLink,
  createAuthLink({ url: httpUri, region: AMPLIFY.Auth.region, auth }),
  createSubscriptionHandshakeLink(httpUri, httpLink),
]);

export const client = new ApolloClient({
  link,
  cache,
});
