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
      updatedAt
      playerTurn {
        turn
        id
        name
        userId
      }
      players {
        id
        name
        userId
        score
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

export const PLAY_TURN = gql`
  mutation PlayTurn($playTurnInput: PlayTurnInput!) {
    playTurn(input: $playTurnInput) {
      id
      name
      owner
      teams
      createdAt
      updatedAt
      playerTurn {
        turn
        id
        name
        userId
      }
      players {
        id
        name
        userId
        score
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
    checkoutTile(input: $checkoutTileInput) {
      id
      name
      owner
      teams
      createdAt
      updatedAt
      playerTurn {
        turn
        id
        name
        userId
      }
      players {
        id
        name
        userId
        score
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

export const GET_GAME = gql`
  query GetGame($gameId: String!) {
    getGame(gameId: $gameId) {
      id
      name
      owner
      teams
      createdAt
      updatedAt
      playerTurn {
        turn
        id
        name
        userId
      }
      players {
        id
        name
        userId
        score
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
      updatedAt
      playerTurn {
        turn
        id
        name
        userId
      }
      players {
        id
        name
        userId
        score
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
