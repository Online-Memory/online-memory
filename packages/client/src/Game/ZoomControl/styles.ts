import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  zoom: {
    zIndex: 999,
    position: 'fixed',
    padding: '12px',
    right: '-33px',
    top: '90px',
    opacity: '0.35',
    transition: 'opacity .25s ease-in-out, right .25s ease-in-out',

    '&:hover': {
      opacity: '1',
      right: '0',
    },
  },
}));
