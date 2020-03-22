export const API_URL = process.env.REACT_APP_API_URL || '';
export const APP_NAME = process.env.REACT_APP_APP_NAME || 'APP NAME';
export const APP_VERSION = process.env.REACT_APP_VERSION || 'dev';
export const AMPLIFY = {
  Auth: {
    mandatorySignIn: true,
    region: process.env.REACT_APP_REGION || '',
    userPoolId: process.env.REACT_APP_USER_POOL_ID || '',
    userPoolWebClientId: process.env.REACT_APP_APP_CLIENT_ID || '',
  },
};
