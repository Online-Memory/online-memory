import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as LinkUI } from 'react-router-dom';
import { Container, Typography, AppBar, Toolbar, Grid, Button, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  image: {
    maxWidth: '300px',
    boxShadow: '0px 1px 0px 4px white, 0px 1px 30px 2px black',
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  linkButon: {
    textDecoration: 'none',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export const App = () => {
  const classes = useStyles();
  return (
    <div className="App">
      {/* Header unit */}
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            OnLine Memory
          </Typography>
        </Toolbar>
      </AppBar>
      {/* End Header unit */}

      <main>
        <div className={classes.heroContent}>
          {/* Hero unit */}
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              OnLine Memory
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              COVID-19 solution for playing memory online with your friends while you're home
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <LinkUI to="/game" className={classes.linkButon}>
                    <Button variant="contained" color="primary">
                      Start new game
                    </Button>
                  </LinkUI>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Join a game
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        {/* End Hero unit */}

        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <img alt="Memory Italia" src="./memory-italia.jpg" width="100%" className={classes.image} />
            </Grid>
          </Grid>
        </Container>
      </main>

      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          {/* Footer */}
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Copyright&copy;{' '}
          <Link color="inherit" href="https://github.com/andreasonny83/">
            andreasonny83
          </Link>
          {' ' + new Date().getFullYear()}. Built with ❤️.
        </Typography>
      </footer>
      {/* End Footer */}
    </div>
  );
};
