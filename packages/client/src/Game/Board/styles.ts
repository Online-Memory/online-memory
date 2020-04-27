import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  boardWrapper: {
    boxShadow: '0px 0px 40px #000',
    borderRadius: theme.spacing(1),
    background: theme.palette.type === 'dark' ? '#666' : '#fff',
    position: 'relative',
  },
  boardContainer: {
    position: 'relative',
    padding: theme.spacing(1),
    zIndex: 10,
  },
}));
