import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    minWidth: '300px',
    maxWidth: '400px',
    padding: theme.spacing(4, 2),
    background: theme.palette.type === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
    transition: 'min-width .3s ease-in-out, max-width .3s ease-in-out, padding .3s ease-in-out',
  },
  containerMinimized: {
    maxWidth: 0,
    minWidth: 0,
    padding: 0,
    transitionDelay: '.4s',
  },
  toggleDashboardButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    transition: 'transform .3s ease-in-out',
  },
  toggleDashboardButtonMinimized: {
    transform: 'translateX(60px)',
    background: theme.palette.background.paper,
  },
  toggleDashboardIcon: {
    transition: 'transform .3s ease-in-out',
  },
  toggleDashboardIconMinimized: {
    transform: 'rotateZ(180deg)',
  },
  dashboardContent: {
    transition: 'opacity .25s ease-in-out',
    opacity: 0,
  },
  dashboardContentHidden: {
    opacity: 0,
  },
  dashboardContentVisible: {
    opacity: 1,
  },
  scoreboardTitle: {
    marginBottom: theme.spacing(6),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  scoreboardList: {
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  currentPlayer: {
    background: theme.palette.primary.light,
  },
  listItemCurrentPlayer: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    minWidth: '120px',
    maxWidth: '160px',
    whiteSpace: 'nowrap',
    fontWeight: theme.typography.fontWeightBold,
  },
  listItemText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    minWidth: '120px',
    maxWidth: '160px',
    whiteSpace: 'nowrap',
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
