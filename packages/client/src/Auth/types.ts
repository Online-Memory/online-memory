export interface User {
  __typename: string;
  isLoggedIn: boolean;
  username: string;
  email: string;
  error: string;
  info: string;
  id?: string;
}
