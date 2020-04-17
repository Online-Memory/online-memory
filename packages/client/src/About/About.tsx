import React from 'react';
import { Container, Card, CardHeader, CardContent, Grid, Typography, Link } from '@material-ui/core';
import { useStyles } from './styles';

export const About = () => {
  const classes = useStyles();

  return (
    <div className={`About ${classes.container}`}>
      <Container maxWidth="lg">
        <Card elevation={3}>
          <CardHeader title="About" subheader="Game Contributors" />
          <CardContent>
            <Grid container alignContent="center" direction="column" spacing={4}>
              <Grid item>
                <Typography align="center" component="h2" variant="h4" gutterBottom>
                  This Game has been made possible thanks to...
                </Typography>
              </Grid>

              <Grid item>
                <Typography component="h4" variant="h6" align="center">
                  <Link color="inherit" href="https://github.com/Thetawaves">
                    Jessica Granziera
                  </Link>
                </Typography>
                <Typography paragraph>UI/UX Design</Typography>
                <Typography paragraph>Graphics</Typography>
                <Typography paragraph>QA / Testing</Typography>
                <Typography paragraph>Beta Tester</Typography>
                <Typography paragraph>Copywriting</Typography>
              </Grid>

              <Grid item>
                <Typography component="h4" variant="h6" align="center">
                  <Link color="inherit" href="https://www.linkedin.com/in/eleonora-baio-900352a1/">
                    Eleonora Baio
                  </Link>
                </Typography>
                <Typography paragraph>QA / Testing</Typography>
                <Typography paragraph>Beta Tester</Typography>
              </Grid>

              <Grid item>
                <Typography component="h4" variant="h6" align="center">
                  <Link color="inherit" href="https://github.com/liquidnero/">
                    Lorenzo Coronica
                  </Link>
                </Typography>
                <Typography paragraph>QA / Testing</Typography>
                <Typography paragraph>Beta Tester</Typography>
              </Grid>

              <Grid item>
                <Typography component="h4" variant="h6" align="center">
                  <Link color="inherit" href="https://github.com/kamolins/">
                    Kārlis Amoliņš
                  </Link>
                </Typography>
                <Typography paragraph>QA / Testing</Typography>
                <Typography paragraph>UX Testing</Typography>
                <Typography paragraph>Beta Tester</Typography>
              </Grid>

              <Grid item>
                <Typography component="h4" variant="h6" align="center">
                  <Link color="inherit" href="https://about.me/andreasonny83/">
                    Andrea Sonny
                  </Link>
                </Typography>
                <Typography paragraph>Software Development</Typography>
                <Typography paragraph>UI/UX Design</Typography>
                <Typography paragraph>QA / Testing</Typography>
                <Typography paragraph>Beta Tester</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};
