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
  avatarWrapper: {
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  avatarIcon: {
    position: 'relative',

    '& svg': {
      filter: 'drop-shadow(1px -1px 0 rgba(0,0,0,0.3))',
    },
  },
}));
