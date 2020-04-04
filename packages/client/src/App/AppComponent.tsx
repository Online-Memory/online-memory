import React, { useEffect, useState, useCallback } from 'react';
import * as serviceWorker from '../serviceWorker';
import {
  Typography,
  AppBar,
  Toolbar,
  Button,
  Link,
  Grid,
  Container,
  IconButton,
  Tooltip,
  Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Sun from '@material-ui/icons/Brightness7';
import Moon from '@material-ui/icons/Brightness4';
import { version } from '../version';
import gitHub from './github.svg';
import { Router } from './router';
import { useAuth } from '../Auth/useAuth';
import { useStyles } from './styles';

interface Props {
  darkTheme: boolean;
  toggleDarkTheme: () => void;
}

export const AppComponent: React.FC<Props> = ({ darkTheme, toggleDarkTheme }) => {
  const classes = useStyles();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { isAuthenticated, logOut } = useAuth();

  useEffect(() => {
    serviceWorker.register({
      onUpdate: (reg: any) => {
        const registrationWaiting = reg.waiting;
        if (registrationWaiting) {
          registrationWaiting.postMessage({ type: 'SKIP_WAITING' });
          registrationWaiting.addEventListener('statechange', (e: any) => {
            if (e.target.state === 'activated') {
              setUpdateAvailable(true);
            }
          });
        }
      },
    });
  }, []);

  const handleUpdateApp = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <Grid className={`App ${classes.app}`} direction="column" container>
      <Snackbar open={updateAvailable} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          severity="info"
          action={
            <Button color="default" size="small" onClick={handleUpdateApp}>
              UPDATE
            </Button>
          }
        >
          A new version of Online Memory is available.
        </Alert>
      </Snackbar>

      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title} noWrap>
            <Link href="/" color="inherit">
              OnLine Memory
            </Link>
          </Typography>

          <IconButton aria-label="Toggle light/dark theme" color="inherit" onClick={toggleDarkTheme}>
            <Tooltip title="Toggle light/dark theme" aria-label="Toggle light/dark theme">
              {darkTheme ? <Sun /> : <Moon />}
            </Tooltip>
          </IconButton>
          <Link href="/about" underline="none" color="inherit">
            <Button color="inherit">About</Button>
          </Link>
          {isAuthenticated ? (
            <Link href="/" underline="none" color="inherit">
              <Button color="inherit" onClick={logOut}>
                Logout
              </Button>
            </Link>
          ) : (
            <Link href="/login" underline="none" color="inherit">
              <Button color="inherit">Login</Button>
            </Link>
          )}
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
                Online Memory v{version} Copyright &copy;{' '}
                <Link color="inherit" href="https://github.com/andreasonny83/">
                  andreasonny83
                </Link>
                {' ' + new Date().getFullYear()}. Made with <img src="/img/catButt.png" height={32} alt="cat butt" />
              </Typography>
            </Grid>
            <Grid item>
              <Link color="inherit" href="https://github.com/andreasonny83/online-memory/">
                <img src={gitHub} className={classes.gitHubLogo} height={38} alt="GitHub-logo" />
              </Link>
            </Grid>
          </Grid>
        </Container>
      </footer>
    </Grid>
  );
};
