import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  zoom: {
    zIndex: 99,
    position: 'fixed',
    padding: '12px',
    right: '-28px',
    top: '95px',
    opacity: '0.4',
    transition: 'opacity .25s ease-in-out, right .25s ease-in-out',

    '&:hover': {
      opacity: '1',
      right: '0',
    },
  },
}));
