import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from '../Home/Home';
import { Game } from '../Game/Game';
import { GameSetup } from '../GameSetup/GameSetup';
import { About } from '../About';

export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/game/:id">
          <Game />
        </Route>
        <Route path="/new">
          <GameSetup />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
