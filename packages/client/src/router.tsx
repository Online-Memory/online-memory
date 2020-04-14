import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CircularProgress, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Home } from './Home';
import { Game } from './Game';
import { GameSetup } from './GameSetup';
import { Dashboard } from './Dashboard';
import { About } from './About';
import { Profile } from './Profile';
import { LogIn } from './Auth/Login';
import { Register } from './Auth/Register';
import { VerifyEmail } from './Auth/VerifyEmail';
import { ForgottenPassword } from './Auth/ForgottenPassword';
import { useAppState } from './AppState';

const useStyles = makeStyles(theme => ({
  loading: {
    marginTop: theme.spacing(20),
  },
}));

export const Router: React.FC = () => {
  const classes = useStyles();
  const { isAuthenticated, authLoading } = useAppState();

  if (authLoading) {
    return (
      <Grid container justify="center" className={classes.loading}>
        <CircularProgress size={60} />
      </Grid>
    );
  }

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <PrivateRoute isAuthenticated={isAuthenticated} path="/game/:id">
        <Game />
      </PrivateRoute>
      <PrivateRoute isAuthenticated={isAuthenticated} path="/new">
        <GameSetup />
      </PrivateRoute>
      <PrivateRoute isAuthenticated={isAuthenticated} path="/profile">
        <Profile />
      </PrivateRoute>
      <PrivateRoute isAuthenticated={isAuthenticated} path="/dashboard">
        <Dashboard />
      </PrivateRoute>
      {!isAuthenticated && (
        <>
          <Route path="/login">
            <LogIn />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/verify-email">
            <VerifyEmail />
          </Route>
          <Route path="/forgot-password">
            <ForgottenPassword />
          </Route>
        </>
      )}

      <Redirect to="/" />
    </Switch>
  );
};

const PrivateRoute: React.FC<any> = ({ isAuthenticated, children, ...rest }) => (
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
