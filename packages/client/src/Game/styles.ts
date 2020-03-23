import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  tileBox: {
    width: '80px',
    height: '80px',
  },
  tile: {
    width: '100%',
    height: '100%',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.1), 1px 1px 2px 1px rgba(0, 0, 0, 0.25)',
    borderRadius: '8px',
    cursor: 'pointer',
  },
}));
