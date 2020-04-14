import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  scoreboardList: {
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.action.hover,
    maxHeight: '400px',
    overflowY: 'auto',
  },
  scoreboardListItem: {},
  loading: {
    marginTop: theme.spacing(20),
  },
  delete: {
    margin: theme.spacing(1),
    color: theme.palette.error.main,
  },
}));
