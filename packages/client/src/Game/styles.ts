import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  mainContainer: {
    background: 'rgba(3,3,3,.1)',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  scoreCurrentPlayer: {
    color: theme.palette.primary.main,
  },
  tileBox: {
    width: '80px',
    height: '80px',
    background: 'rgba(0, 0, 0, 0.07)',
    boxSizing: 'content-box',
    padding: '3px',
    margin: '1px',
  },
  tile: {
    width: '100%',
    height: '100%',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.1), 1px 1px 2px 1px rgba(0, 0, 0, 0.25)',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  tileDisabled: {
    cursor: 'not-allowed',
  },
  loading: {
    marginTop: theme.spacing(20),
    marginBottom: theme.spacing(20),
  },
}));
