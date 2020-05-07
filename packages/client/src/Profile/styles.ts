import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  loader: {
    marginRight: theme.spacing(1),
  },
  avatar: {
    background: theme.palette.background.default,
    border: '1px solid hsla(0, 0%, 15%, 0.5)',
    borderRadius: '6px',
    padding: '8px 8px 0px',
    overflow: 'hidden',

    '& > svg': {
      filter: `drop-shadow(1px 1px 3px ${theme.palette.action.active})`,
    },
  },
}));
