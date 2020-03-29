import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  boardContainer: {
    width: 'fit-content',
    boxShadow: '0px 0px 40px #000',
    padding: '4px',
    borderRadius: '5px',
    background: theme.palette.type === 'dark' ? '#666' : '#fff',
  },
}));
