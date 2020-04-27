import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  playerTurnOpen: {
    bottom: '40px',
  },
  turnAlert: {
    animation: 'turn-popup 15s cubic-bezier(.9,-1.2,.2,1.9) infinite forwards',
  },
  boardContainer: {
    margin: theme.spacing(6, 0),
    padding: theme.spacing(0, 1),
  },
}));
