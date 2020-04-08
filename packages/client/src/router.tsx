import React, { useCallback } from 'react';
import { useAuth } from './Auth/useAuth';
import { Authenticator } from 'aws-amplify-react';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { Home } from './Home/Home';
import { Game } from './Game/Game';
import { GameSetup } from './GameSetup/GameSetup';
import { About } from './About';

export const Router: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home user={user} />
        </Route>

        <PrivateRoute isAuthenticated={isAuthenticated} path="/game/:id">
          <Game user={user} />
        </PrivateRoute>
        <PrivateRoute isAuthenticated={isAuthenticated} path="/new">
          <GameSetup />
        </PrivateRoute>
        <Route path="/login">
          <Auth isAuthenticated={isAuthenticated} />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};

interface AuthProps {
  isAuthenticated: boolean;
}

export const Auth: React.FC<AuthProps> = ({ isAuthenticated }) => {
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

const PrivateRoute: React.FC<any> = ({ isAuthenticated, children, ...rest }) => {
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
