import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4, 2),
    background: theme.palette.type === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)',
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
