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
  usersList: {
    width: '100%',
    marginTop: theme.spacing(1),
    border: `1px solid ${theme.palette.text.secondary}`,
  },
  friendsList: {
    maxHeight: '500px',
    overflowY: 'auto',
  },
  avatarWrapper: {
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  avatarIcon: {
    position: 'relative',

    '& svg': {
      filter: 'drop-shadow(1px -1px 0 rgba(0,0,0,0.3))',
    },
  },
  listItemText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    minWidth: '120px',
    maxWidth: '160px',
    whiteSpace: 'nowrap',
  },
}));
