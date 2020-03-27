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
  boardContainer: {
    width: 'fit-content',
    boxShadow: '0px 0px 40px #000',
    padding: '4px',
    background: '#666',
  },
  tileWrapper: {
    width: '80px',
    height: '80px',
    background: '#666',
    boxSizing: 'content-box',
    padding: '4px',
  },
  tileBox: {
    background: '#444',
    width: '100%',
    height: '100%',
    borderRadius: '9px',
  },
  loading: {
    marginTop: theme.spacing(20),
    marginBottom: theme.spacing(20),
  },
  tileDisabled: {
    cursor: 'not-allowed',
  },
  tileEnabled: {
    cursor: 'pointer',
  },
  tileLoading: {
    cursor: 'progress',
  },
}));
