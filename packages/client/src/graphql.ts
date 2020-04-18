import gql from 'graphql-tag';

export const GET_USER = gql`
  query GetUser {
    whoAmI {
      id
      username
      avatar
    }
  }
`;

export const GET_USER_GAMES = gql`
  query GetUserGames {
    getUserGames {
      completedGames {
        id
        name
        createdAt
      }
      activeGames {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_GAME = gql`
  mutation DeleteGame($gameId: String!) {
    deleteGame(gameId: $gameId) {
      id
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(input: $updateUserInput) {
      username
      avatar
    }
  }
`;

export const CREATE_GAME = gql`
  mutation CreateGame($createGameInput: CreateGameInput!) {
    createGame(input: $createGameInput) {
      id
    }
  }
`;

export const GET_TEMPLATES = gql`
  query GetTemplates {
    templates {
      id
      name
      tiles
      board
    }
  }
`;

export const CLAIM_PLAYER = gql`
  mutation ClaimPlayer($claimPlayerInput: ClaimPlayerInput!) {
    claimPlayer(input: $claimPlayerInput) {
      id
      name
      owner
      status
      template
      moves
      createdAt
      updatedAt
      startedAt
      users {
        id
        item {
          username
          avatar
        }
      }
      playerTurn {
        turn
        id
        userId
        currentPlaying
        status
      }
      players {
        id
        status
        name
        userId
        moves
        pairs
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

export const START_GAME = gql`
  mutation StartGame($startGameInput: StartGameInput!) {
    startGame(input: $startGameInput) {
      id
      name
      owner
      status
      template
      moves
      createdAt
      updatedAt
      startedAt
      users {
        id
        item {
          username
          avatar
        }
      }
      playerTurn {
        turn
        id
        userId
        currentPlaying
        status
      }
      players {
        id
        status
        name
        userId
        moves
        pairs
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
      status
      template
      moves
      createdAt
      updatedAt
      startedAt
      users {
        id
        item {
          username
          avatar
        }
      }
      playerTurn {
        turn
        id
        userId
        currentPlaying
        status
      }
      players {
        id
        status
        name
        userId
        moves
        pairs
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
      status
      template
      moves
      createdAt
      updatedAt
      startedAt
      users {
        id
        item {
          username
          avatar
        }
      }
      playerTurn {
        turn
        id
        userId
        currentPlaying
        status
      }
      players {
        id
        status
        name
        userId
        moves
        pairs
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
      status
      template
      moves
      createdAt
      updatedAt
      startedAt
      users {
        id
        item {
          username
          avatar
        }
      }
      playerTurn {
        turn
        id
        userId
        currentPlaying
        status
      }
      players {
        id
        status
        name
        userId
        moves
        pairs
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
      status
      template
      moves
      createdAt
      updatedAt
      startedAt
      users {
        id
        item {
          username
          avatar
        }
      }
      playerTurn {
        turn
        id
        userId
        currentPlaying
        status
      }
      players {
        id
        status
        name
        userId
        moves
        pairs
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
