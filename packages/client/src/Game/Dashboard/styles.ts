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
  },
  listItemCurrentPlayer: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    minWidth: '120px',
    maxWidth: '160px',
    whiteSpace: 'nowrap',
    fontWeight: theme.typography.fontWeightBold,
  },
  listItemText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    minWidth: '120px',
    maxWidth: '160px',
    whiteSpace: 'nowrap',
  },
}));
