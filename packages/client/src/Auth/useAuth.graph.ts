import gql from 'graphql-tag';

export const GET_USER = gql`
  query GetUser {
    user @client {
      isLoggedIn
      email
      error
      info
    }
  }
`;

export const GET_USER_DATA = gql`
  query GetUserData {
    whoAmI {
      id
      username
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser {
    createUser {
      id
    }
  }
`;

export const LOG_OUT = gql`
  mutation LogOut {
    logOut @client
  }
`;
