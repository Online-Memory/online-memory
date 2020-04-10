import React, { useCallback } from 'react';
import { Authenticator } from 'aws-amplify-react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { Home } from './Home/Home';
import { Game } from './Game/Game';
import { GameSetup } from './GameSetup/GameSetup';
import { About } from './About';
import { Profile } from './Profile';
import { UserData } from './Auth/useAuth';

interface Props {
  isAuthenticated: boolean;
  loading: boolean;
  user?: UserData;
}

export const Router: React.FC<Props> = ({ isAuthenticated, user, loading }) => {
  if (loading || (isAuthenticated && !user)) {
    return <div>loading...</div>;
  }

  return (
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
      <PrivateRoute isAuthenticated={isAuthenticated} path="/profile">
        {user && <Profile user={user} />}
      </PrivateRoute>
      <Redirect to="/" />
    </Switch>
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
