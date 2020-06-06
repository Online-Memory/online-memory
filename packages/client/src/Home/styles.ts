import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
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
    background: 'white',
    maxWidth: '300px',
    boxShadow: '0px 1px 0px 4px white, 0px 1px 30px 2px black',
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  linkButton: {
    textDecoration: 'none',
  },
  underTitle: {
    textTransform: 'uppercase',
  },
  punchLine: {
    fontWeight: 500,
  },
  buttonHome: {
    padding: '10px 24px',
    fontSize: 24,

    [theme.breakpoints.down('sm')]: {
      padding: '8px 21px',
      fontSize: 18,
    },
  },
}));
