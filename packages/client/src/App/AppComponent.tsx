import React, { useCallback, useEffect, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { useSubscription } from '@apollo/react-hooks';
import { USER_INVITE } from '../graphql';
import { Avatar } from 'react-avataaars';
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
  Menu,
  MenuItem,
} from '@material-ui/core';
import Sun from '@material-ui/icons/Brightness7';
import Moon from '@material-ui/icons/Brightness4';
import catButt from '../assets/img/catButt.png';
import gitHub from './github.svg';
import { useAppState } from '../AppState';
import { Router } from '../router';
import { version } from '../version';
import { useStyles } from './styles';

interface Props {
  darkTheme: boolean;
  toggleDarkTheme: () => void;
}

export const AppComponent: React.FC<Props> = memo(({ darkTheme, toggleDarkTheme }) => {
  const history = useHistory();
  const classes = useStyles();
  const { isAuthenticated, user, logOut, showUserInvite } = useAppState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const { data: subData } = useSubscription(USER_INVITE, {
    variables: {
      userId: user?.id,
    },
    shouldResubscribe: true,
  });

  useEffect(() => {
    if (subData?.invites?.gameId && subData?.invites?.from) {
      showUserInvite(subData.invites.from, subData.invites.gameId);
    }
  }, [showUserInvite, subData]);

  const handleLogout = useCallback(() => {
    logOut();
  }, [logOut]);

  const handleMenu = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleProfile = useCallback(() => {
    handleClose();
    history.push('/profile');
  }, [handleClose, history]);

  const handleSettings = useCallback(() => {
    handleClose();
    history.push('/settings');
  }, [handleClose, history]);

  const handleDashboard = useCallback(() => {
    handleClose();
    history.push('/dashboard');
  }, [handleClose, history]);

  const handleHomepage = useCallback(() => {
    handleClose();
    history.push('/');
  }, [handleClose, history]);

  return (
    <Grid className={`App ${classes.app}`} direction="column" container>
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
          {isAuthenticated && user ? (
            <>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                size="small"
                className="userMenu"
                onClick={handleMenu}
              >
                <div className={classes.avatarWrapper}>
                  <Avatar size="40px" hash={user.avatar} className={classes.avatarIcon} />
                </div>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem className="profile" onClick={handleHomepage}>
                  Home
                </MenuItem>
                <MenuItem className="dashboard" onClick={handleDashboard}>
                  Dashboard
                </MenuItem>
                <MenuItem className="profile" onClick={handleProfile}>
                  User Profile
                </MenuItem>

                <MenuItem divider className={classes.divider} disabled />

                <MenuItem className="settings" onClick={handleSettings}>
                  Settings
                </MenuItem>
                <MenuItem className="logOut" onClick={handleLogout}>
                  Log Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Link href="/login" underline="none" color="inherit">
              <Button color="inherit">Login</Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
      <Grid container component="main" direction="column" className={classes.main}>
        <Router />
      </Grid>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
                Online Memory v{version} Copyright &copy;{' '}
                <Link color="inherit" href="https://github.com/andreasonny83/">
                  andreasonny83
                </Link>
                {' ' + new Date().getFullYear()}. Made with <img src={catButt} height={32} alt="cat butt" />
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
                What's new in v{version}? Read the{' '}
                <Link color="inherit" href="https://github.com/Online-Memory/online-memory/blob/master/CHANGELOG.md">
                  CHANGELOG
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <Link color="inherit" href="https://github.com/Online-Memory">
                <img src={gitHub} className={classes.gitHubLogo} height={38} alt="GitHub-logo" />
              </Link>
            </Grid>
          </Grid>
        </Container>
      </footer>
    </Grid>
  );
});
