import React from 'react';
import { Typography, AppBar, Toolbar, Button, Link } from '@material-ui/core';
import { useAuth } from '../Auth/useAuth';
import { Router } from './router';
import { useStyles } from './styles';

export const AppComponent = () => {
  const classes = useStyles();
  const { logOut } = useAuth();

  return (
    <div className="App">
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title} noWrap>
            <Link href="/" color="inherit">
              OnLine Memory
            </Link>
          </Typography>
          <Button color="inherit" onClick={logOut}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <Router />
      </main>
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom></Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Copyright&copy;{' '}
          <Link color="inherit" href="https://github.com/andreasonny83/">
            andreasonny83
          </Link>
          {' ' + new Date().getFullYear()}. Built with ❤️
        </Typography>
      </footer>
    </div>
  );
};
