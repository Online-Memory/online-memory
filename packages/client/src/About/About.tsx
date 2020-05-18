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
            <Grid container alignContent="center" spacing={0}>
              <Grid container item xs={12}>
                <Typography align="center" component="h2" variant="h4" gutterBottom>
                  This Game has been made possible thanks to...
                </Typography>
              </Grid>
              <Grid item xs={4} className={`${classes.cardColorB7} ${classes.cardCommonStyle}`}>
                <div className={classes.cardInnerBorderBlack}>
                  <Typography component="h4" variant="h6" align="center">
                    Who are we?
                  </Typography>
                  <Typography paragraph>
                    We are a bunch of friends that has enjoyed playing board games together since the dawn of their
                    friendship. Memory has been a pillar of our gaming nights, with one particular person ALWAYS winning
                    and the rest of us losing, but everyone always having fun in the process.
                    <br />
                    We now live scattered around the globe but want to keep our love for board gaming alive. That’s how
                    we came up with the idea to create this neat little app and decided to share it with the rest of the
                    world.
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4} className={`${classes.cardColor222} ${classes.cardCommonStyle}`}>
                <div className={classes.cardInnerBorderWhite}>
                  <Typography component="h4" variant="h6" align="center">
                    <Link color="inherit" href="https://about.me/andreasonny83/">
                      Andrea Sonny
                    </Link>
                  </Typography>
                  <Typography paragraph>
                    The brain and the arm. The man behind it all. When he’s not coding maniacally or tending to his
                    furry beasts, you can find him enjoying tasty food or playing board games.. or doing both.
                    <br />
                    <br />
                    Software Development
                    <br />
                    UI/UX Design
                    <br />
                    QA / Testing
                    <br />
                    Beta Tester
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4} className={`${classes.cardColorDDD} ${classes.cardCommonStyle}`}>
                <div className={classes.cardInnerBorderBlack}>
                  <Typography component="h4" variant="h6" align="center">
                    <Link color="inherit" href="https://github.com/kamolins/">
                      Kārlis Amoliņš
                    </Link>
                  </Typography>
                  <Typography paragraph>
                    QA / Testing
                    <br />
                    UX Testing
                    <br />
                    Beta Tester
                  </Typography>
                </div>
              </Grid>
            </Grid>

            <Grid container item>
              <Grid item xs={4} className={`${classes.cardColorDDD} ${classes.cardCommonStyle}`}>
                <div className={classes.cardInnerBorderBlack}>
                  <Typography component="h4" variant="h6" align="center">
                    <Link color="inherit" href="https://github.com/Thetawaves">
                      Jessica "La Jeena" Granziera
                    </Link>
                  </Typography>
                  <Typography paragraph>
                    The next best thing after an actual web designer and a graphic designer.. a design enthusiast of
                    sorts.
                    <br />
                    <br />
                    UI/UX Design
                    <br />
                    Graphics
                    <br />
                    QA / Testing
                    <br />
                    Beta Tester
                    <br />
                    Copywriting
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4} className={`${classes.cardColor4B} ${classes.cardCommonStyle}`}>
                <div className={classes.cardInnerBorderWhite}>
                  <Typography component="h4" variant="h6" align="center">
                    <Link color="inherit" href="https://www.linkedin.com/in/eleonora-baio-900352a1/">
                      Eleonora "L" Baio
                    </Link>
                  </Typography>
                  <Typography paragraph>
                    Critique magnifique. The lady behind the man.
                    <br />
                    <br />
                    QA / Testing
                    <br />
                    Beta Tester
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={4} className={`${classes.cardColorB7} ${classes.cardCommonStyle}`}>
                <div className={classes.cardInnerBorderBlack}>
                  <Typography component="h4" variant="h6" align="center">
                    <Link color="inherit" href="https://github.com/liquidnero/">
                      Lorenzo "Enzo" Coronica
                    </Link>
                  </Typography>
                  <Typography paragraph>
                    Critique slightly less magnifique.
                    <br />
                    <br />
                    QA / Testing
                    <br />
                    Beta Tester
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};
