import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  slider: {
    marginTop: theme.spacing(5),
  },
  loading: {
    marginTop: theme.spacing(20),
    marginBottom: theme.spacing(20),
  },
  tileSamplesContainer: {
    position: 'relative',
    height: '230px',
    marginLeft: '3px',
    marginTop: '20px',
  },
  tileSample: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fieldComponent: {
    marginTop: theme.spacing(1),
  },
}));
