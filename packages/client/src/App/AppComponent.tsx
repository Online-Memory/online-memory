import React from 'react';
import { Typography, AppBar, Toolbar, Button, Link, Grid, Container } from '@material-ui/core';
import { useAuth } from '../Auth/useAuth';
import { Router } from './router';
import gitHub from './github.svg';
import { useStyles } from './styles';

export const AppComponent = () => {
  const classes = useStyles();
  const { logOut } = useAuth();

  return (
    <Grid className={`App ${classes.app}`} direction="column" container>
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
      <main className={classes.main}>
        <Router />
      </main>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Grid container direction="column" alignItems="center" spacing={4}>
            <Grid item>
              <Typography variant="h6" align="center" gutterBottom></Typography>
              <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                Copyright &copy;{' '}
                <Link color="inherit" href="https://github.com/andreasonny83/">
                  andreasonny83
                </Link>
                {' ' + new Date().getFullYear()}. Made with <img src="/catButt.png" alt="cat butt" />
              </Typography>
            </Grid>
            <Grid item>
              <Link color="inherit" href="https://github.com/andreasonny83/online-memory/">
                <img src={gitHub} className={classes.gitHubLogo} alt="GitHub-logo" />
              </Link>
            </Grid>
          </Grid>
        </Container>
      </footer>
    </Grid>
  );
};
