import React, { useEffect } from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import { useStyles } from './styles';

export const CookieDeclaration = () => {
  const classes = useStyles();

  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://consent.cookiebot.com/4a20b373-e3d0-41c2-968d-be9a8eab8c78/cd.js';
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return (
    <div className={`CookieDeclaration ${classes.container}`}>
      <Container maxWidth="md">
        <Grid container direction="column" spacing={2} alignContent="center">
          <Typography component="h2" variant="h3" gutterBottom>
            Cookie Declaration
          </Typography>
        </Grid>
      </Container>
    </div>
  );
};
