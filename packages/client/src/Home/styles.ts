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
}));