import { withAuthenticator } from 'aws-amplify-react';
import { AppComponent } from './AppComponent';

export const App = withAuthenticator(AppComponent, {
  signUpConfig: {
    hiddenDefaults: ['phone_number'],
  },
} as any);
