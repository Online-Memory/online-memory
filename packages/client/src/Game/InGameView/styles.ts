import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  gameContainer: {
    display: 'flex',
    flex: '1 1 auto',
  },
  playerTurnOpen: {
    bottom: '40px',
  },
  turnAlert: {
    animation: 'turn-popup 15s cubic-bezier(.9,-1.2,.2,1.9) infinite forwards',
  },
  boardContainer: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: theme.spacing(0, 1),
  },
}));
