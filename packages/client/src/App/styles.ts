import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  app: {
    minHeight: '100%',
    flexWrap: 'nowrap',
    backgroundImage: theme.palette.type === 'dark' ? `url('/Background_Dark.png')` : `url('/Background_Light.png')`,
  },
  title: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  linkButton: {
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
  divider: {
    margin: theme.spacing(0, 0, 1),
  },
  navbar: {
    background:
      theme.palette.type === 'dark'
        ? 'linear-gradient(90deg, rgba(129,251,136,1) 0%, rgba(40,199,111,1) 100%)'
        : 'linear-gradient(90deg, rgba(156,39,176,1) 0%, rgba(175,73,255,1) 100%)',
    height: 100,
  },
  titleStyle: {
    fontFamily: 'Bungee',
    fontSize: 40,
    color: theme.palette.type === 'dark' ? '#AF49FF' : '#81FB88',
  },
  wmcIcon: {
    height: 80,
    width: 80,
    padding: 0,
    marginTop: 10,
  },
}));
