import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import { useStyles } from './styles';

export const CookieDeclaration = () => {
  const classes = useStyles();

  return (
    <div className={`CookieDeclaration ${classes.container}`}>
      <Container maxWidth="md">
        <Grid container direction="column" spacing={2} alignContent="center">
          <Typography component="h2" variant="h3" gutterBottom>
            Cookie Declaration
          </Typography>

          <script
            id="CookieDeclaration"
            src="https://consent.cookiebot.com/e9be435d-3b73-472c-a503-01ee4fe8fd56/cd.js"
            type="text/javascript"
            async
          ></script>
        </Grid>
      </Container>
    </div>
  );
};
