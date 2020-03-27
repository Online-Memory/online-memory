import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  app: {
    minHeight: '100%',
    flexWrap: 'nowrap',
  },
  title: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  linkButon: {
    textDecoration: 'none',
  },
  gitHubLogo: {
    height: '42px',
    opacity: '0.6',
    transition: 'opacity .25s ease-in-out',

    '&:hover': {
      opacity: '1',
    },
  },
  main: {
    flex: '1 1 auto',
  },
}));
