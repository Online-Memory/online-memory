import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  deleteButton: {
    color: theme.palette.getContrastText(theme.palette.error.main),
    background: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.light,
    },
  },
}));
