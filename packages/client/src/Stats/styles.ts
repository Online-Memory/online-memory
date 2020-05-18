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
  avatarWrapper: {
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
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
  listItemText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    minWidth: '120px',
    maxWidth: '160px',
    whiteSpace: 'nowrap',
  },
  usersList: {
    width: '100%',
    marginTop: theme.spacing(1),
    border: `1px solid ${theme.palette.text.secondary}`,
  },
  avatarIcon: {
    position: 'relative',

    '& svg': {
      filter: 'drop-shadow(1px -1px 0 rgba(0,0,0,0.3))',
    },
  },
  radarChart: {
    height: '600px',
    [theme.breakpoints.down('sm')]: {
      height: '400px',
    },
    color: theme.palette.secondary.dark,
  },
  radarLabelTitle: {
    ...theme.typography.body1,
    fill: theme.palette.text.primary,
  },
  radarLabelValue: {
    ...theme.typography.subtitle1,
    fill: theme.palette.primary.light,
  },
}));
