import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  boardWrapper: {
    boxShadow: '0px 0px 40px #000',
    borderRadius: theme.spacing(1),
    background: theme.palette.type === 'dark' ? '#666' : '#fff',
    position: 'relative',
  },
  boardContainer: {
    padding: theme.spacing(1),
  },
  tileItem: {
    position: 'relative',
  },
  tileBackground: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateX(calc(-50% + 1px)) translateY(-50%)',
    background: theme.palette.type === 'dark' ? '#444' : '#CCC',
    borderRadius: '9px',
  },
  clickToStart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    background: '#fff',
    color: '#000',
    transform: 'translateX(-50%) translateY(-50%)',
    pointerEvents: 'none',
    cursor: 'pointer',
    zIndex: 9999,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[12],
    ...theme.typography.h5,
  },
}));
