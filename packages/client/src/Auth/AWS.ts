import { Auth } from 'aws-amplify';

export interface AWSUser {
  attributes: {
    email: string;
    email_verified: boolean;
  };
  username: string;
}

export const awsSignOut = () => Auth.signOut();

export const getCurrentUser = () => Auth.currentUserInfo();
