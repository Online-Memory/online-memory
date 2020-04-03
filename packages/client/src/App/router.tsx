import React, { useCallback } from 'react';
import { useAuth } from '../Auth/useAuth';
import { Authenticator } from 'aws-amplify-react';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { Home } from '../Home/Home';
import { Game } from '../Game/Game';
import { GameSetup } from '../GameSetup/GameSetup';
import { About } from '../About';

export const Auth: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const history = useHistory();

  const handleStateChange = useCallback(
    state => {
      if (state === 'signedIn') {
        history.push(`/`);
        window.location.reload();
      }
    },
    [history]
  );

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <Authenticator onStateChange={handleStateChange} />;
};

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute path="/game/:id">
          <Game />
        </PrivateRoute>
        <PrivateRoute path="/new">
          <GameSetup />
        </PrivateRoute>
        <Route path="/login">
          <Auth />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/">
          <Home />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

const PrivateRoute: React.FC<any> = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
