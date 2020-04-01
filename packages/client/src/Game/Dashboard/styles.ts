import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  scoreboardTitle: {
    marginBottom: theme.spacing(6),
  },
  scoreboardList: {
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  currentPlayer: {
    background: theme.palette.primary.light,
    fontSize: theme.typography.h6.fontSize,
  },
}));
