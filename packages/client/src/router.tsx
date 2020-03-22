import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { withAuthenticator } from 'aws-amplify-react';
import { App } from './App';
import { Game } from './Game/Game';

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/game">
          <Game />
        </Route>
        <Route path="/">
          <App />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export const Router = withAuthenticator(RouterComponent, {
  signUpConfig: {
    hiddenDefaults: ['phone_number'],
  },
} as any);
