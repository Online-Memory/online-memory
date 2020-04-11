import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  scoreboardList: {
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.action.hover,
  },
  scoreboardListItem: {},
}));
