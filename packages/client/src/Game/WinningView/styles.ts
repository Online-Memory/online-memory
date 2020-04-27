import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
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
  scoreboardList: {
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.action.hover,
    width: '100%',
  },
  grid: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  listWrapper: {
    padding: theme.spacing(1),
  },
  listItemMatches: {
    textAlign: 'right',
  },
}));
