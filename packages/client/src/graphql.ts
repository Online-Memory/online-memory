import gql from 'graphql-tag';

export const CREATE_GAME = gql`
  mutation CreateGame($createGameInput: CreateGameInput!) {
    createGame(input: $createGameInput) {
      id
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($gameId: String!) {
    getGame(gameId: $gameId) {
      id
      name
      owner
      teams
      createdAt
      players {
        name
      }
    }
  }
`;
