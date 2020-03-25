import gql from 'graphql-tag';

export const CREATE_GAME = gql`
  mutation CreateGame($createGameInput: CreateGameInput!) {
    createGame(input: $createGameInput) {
      id
    }
  }
`;

export const CLAIM_PLAYER = gql`
  mutation ClaimPlayer($claimPlayerInput: ClaimPlayerInput!) {
    claimPlayer(input: $claimPlayerInput) {
      id
      name
      owner
      teams
      createdAt
      playerTurn {
        id
        name
        userId
      }
      players {
        id
        name
        userId
      }
      board {
        gridX
        gridY
      }
      tiles {
        id
        ref
        status
        owner
      }
    }
  }
`;

export const CHECKOUT_TILE = gql`
  mutation CheckoutTile($checkoutTileInput: CheckoutTileInput!) {
    claimPlayer(input: $checkoutTileInput) {
      id
      name
      owner
      teams
      createdAt
      playerTurn {
        id
        name
        userId
      }
      board {
        gridX
        gridY
      }
      tiles {
        id
        ref
        status
        owner
      }
      players {
        id
        name
        userId
      }
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
      playerTurn {
        id
        name
        userId
      }
      players {
        id
        name
        userId
      }
      board {
        gridX
        gridY
      }
      tiles {
        id
        ref
        status
        owner
      }
    }
  }
`;

export const GAME_UPDATED = gql`
  subscription GameUpdated($id: String!) {
    gameUpdated(id: $id) {
      id
      name
      owner
      teams
      createdAt
      playerTurn {
        id
        name
        userId
      }
      players {
        id
        name
        userId
      }
      board {
        gridX
        gridY
      }
      tiles {
        id
        ref
        status
        owner
      }
    }
  }
`;
