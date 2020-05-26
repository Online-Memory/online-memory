import React from 'react';
import { Container, Grid, Typography, Link } from '@material-ui/core';
import { useStyles } from './styles';

export const PrivacyPolicy = () => {
  const classes = useStyles();

  return (
    <div className={`PrivacyPolicy ${classes.container}`}>
      <Container maxWidth="md">
        <Grid container direction="column" spacing={2} alignContent="center">
          <Typography component="h2" variant="h3" gutterBottom>
            Privacy Policy
          </Typography>

          <Typography paragraph>
            It is World Memory Challenge policy to respect your privacy regarding any information we may collect while
            operating our website. This Privacy Policy applies to{' '}
            <Link href="https://master.d3czed5ma25sw0.amplifyapp.com">
              https://master.d3czed5ma25sw0.amplifyapp.com
            </Link>
            , a website developed and operated by World Memory Challenge, (hereinafter, "us", "we", or
            "https://master.d3czed5ma25sw0.amplifyapp.com"). We respect your privacy and are committed to protecting
            personally identifiable information you may provide us through the Website. We have adopted this privacy
            policy ("Privacy Policy") to explain what information may be collected on our Website, how we use this
            information, and under what circumstances we may disclose the information to third parties. This Privacy
            Policy applies only to information we collect through the Website and does not apply to our collection of
            information from other sources.
          </Typography>
          <Typography paragraph>
            This Privacy Policy, together with the Terms and conditions posted on our Website, set forth the general
            rules and policies governing your use of our Website. Depending on your activities when visiting our
            Website, you may be required to agree to additional terms and conditions.
          </Typography>
          <Typography variant="h5">Website Visitors</Typography>
          <Typography paragraph>
            Like most website operators, World Memory Challenge, collects non-personally-identifying information of the
            sort that web browsers and servers typically make available, such as the browser type, language preference,
            referring site, and the date and time of each visitor request. World Memory Challenge purpose in collecting
            non-personally identifying information is to better understand how World Memory Challenge visitors use its
            website. From time to time, World Memory Challenge, may release non-personally-identifying information in
            the aggregate, e.g., by publishing a report on trends in the usage of its website.
          </Typography>
          <Typography paragraph>
            World Memory Challenge, also collects potentially personally-identifying information like Internet Protocol
            (IP) addresses for logged in users and for users leaving comments on https://openbase.io. World Memory
            Challenge, only discloses logged in user and commenter IP addresses under the same circumstances that it
            uses and discloses personally-identifying information as described below.
          </Typography>
          <Typography variant="h5">Security</Typography>
          <Typography paragraph>
            The security of your Personal Information is important to us, but remember that no method of transmission
            over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially
            acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
          </Typography>
          <Typography variant="h5">Links To External Sites</Typography>
          <Typography paragraph>
            Our Service may contain links to external sites that are not operated by us. If you click on a third party
            link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy
            and terms and conditions of every site you visit.
          </Typography>
          <Typography paragraph>
            We have no control over, and assume no responsibility for the content, privacy policies or practices of any
            third party sites, products or services.
          </Typography>
          <Typography variant="h5">Aggregated Statistics</Typography>
          <Typography paragraph>
            World Memory Challenge, may collect statistics about the behavior of visitors to its website. World Memory
            Challenge, may display this information publicly or provide it to others. However, World Memory Challenge,
            does not disclose your personally-identifying information.
          </Typography>
          <Typography variant="h5">Cookies</Typography>
          <Typography paragraph>
            To enrich and perfect your online experience, World Memory Challenge, uses "Cookies", similar technologies
            and services provided by others to display personalized content, appropriate advertising and store your
            preferences on your computer.
          </Typography>
          <Typography paragraph>
            A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's
            browser provides to the website each time the visitor returns. World Memory Challenge, uses cookies to help
            World Memory Challenge, identify and track visitors, their usage of https://openbase.io, and their website
            access preferences. World Memory Challenge, visitors who do not wish to have cookies placed on their
            computers should set their browsers to refuse cookies before using World Memory Challenge websites, with the
            drawback that certain features of World Memory Challenge websites may not function properly without the aid
            of cookies.
          </Typography>
          <Typography paragraph>
            By continuing to navigate our website without changing your cookie settings, you hereby acknowledge and
            agree to World Memory Challenge use of cookies.
          </Typography>
          <Typography variant="h5">Privacy Policy Changes</Typography>
          <Typography paragraph>
            Although most changes are likely to be minor, World Memory Challenge, may change its Privacy Policy from
            time to time, and in World Memory Challenge sole discretion. World Memory Challenge, encourages visitors to
            frequently check this page for any changes to its Privacy Policy. Your continued use of this site after any
            change in this Privacy Policy will constitute your acceptance of such change.
          </Typography>
          <Typography variant="h5">Contact Information</Typography>
          <Typography paragraph>
            If you have any questions about this Privacy Policy, please contact us via{' '}
            <Link href="mailto:andreasonny83@gmail.com">email</Link>.
          </Typography>
        </Grid>
      </Container>
    </div>
  );
};
