import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { App } from './App';
import { Game } from './Game/Game';

export const Router = () => {
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
