import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  zoom: {
    zIndex: 0,
    position: 'absolute',
    padding: theme.spacing(0, 1, 1),
    right: '-55px',
    top: '0px',
    opacity: '0.35',
    transition: 'opacity .25s ease-in-out, right .25s ease-in-out',

    '&:hover': {
      opacity: '1',
      right: '-60px',
    },
  },
}));
