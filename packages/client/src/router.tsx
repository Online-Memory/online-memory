import React, { useCallback } from 'react';
import { Authenticator } from 'aws-amplify-react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { CircularProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Home } from './Home';
import { Game } from './Game';
import { GameSetup } from './GameSetup';
import { Dashboard } from './Dashboard';
import { About } from './About';
import { Profile } from './Profile';
import { UserData } from './Auth/useAuth';

const useStyles = makeStyles(theme => ({
  loading: {
    marginTop: theme.spacing(20),
  },
}));

interface Props {
  isAuthenticated: boolean;
  loading: boolean;
  user?: UserData;
}

export const Router: React.FC<Props> = ({ isAuthenticated, user, loading }) => {
  const classes = useStyles();

  if (loading || (isAuthenticated && !user)) {
    return (
      <Grid container justify="center" className={classes.loading}>
        <CircularProgress size={60} />
      </Grid>
    );
  }

  return (
    <Switch>
      <Route exact path="/">
        <Home user={user} />
      </Route>
      <PrivateRoute isAuthenticated={isAuthenticated} path="/game/:id">
        {user && <Game user={user} />}
      </PrivateRoute>
      <PrivateRoute isAuthenticated={isAuthenticated} path="/new">
        <GameSetup />
      </PrivateRoute>
      <PrivateRoute isAuthenticated={isAuthenticated} path="/profile">
        {user && <Profile user={user} />}
      </PrivateRoute>
      <PrivateRoute isAuthenticated={isAuthenticated} path="/dashboard">
        <Dashboard />
      </PrivateRoute>
      <Route path="/login">
        <Auth isAuthenticated={isAuthenticated} />
      </Route>
      <Route path="/about">
        <About />
      </Route>
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
