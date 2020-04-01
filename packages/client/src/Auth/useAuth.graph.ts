import gql from 'graphql-tag';

export const GET_USER = gql`
  query GetUser {
    whoAmI {
      id
      username
    }
  }
`;
export const LOG_OUT = gql`
  mutation LogOut {
    logOut @client
  }
`;
