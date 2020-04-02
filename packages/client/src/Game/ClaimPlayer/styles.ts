import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  gameContainer: {
    margin: theme.spacing(6, 0),
  },
  claimPlayerList: {
    marginTop: theme.spacing(6),
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
}));
