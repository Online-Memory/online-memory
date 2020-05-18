import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  cardInnerBorderWhite: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: theme.palette.type === 'dark' ? '#FFF' : '#000',
    borderRadius: 10,
    height: '100%',
    padding: 10,
  },
  cardInnerBorderBlack: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: theme.palette.type === 'dark' ? '#000' : '#FFF',
    borderRadius: 10,
    height: '100%',
    padding: 10,
  },
  cardCommonStyle: {
    padding: 10,
    minWidth: 150,
  },
  cardColorDDD: {
    backgroundColor: theme.palette.type === 'dark' ? '#DDD' : '#222',
    color: theme.palette.type === 'dark' ? '#000' : '#FFF',
  },
  cardColorB7: {
    backgroundColor: theme.palette.type === 'dark' ? '#B7B7B7' : '#3B3B3B',
    color: theme.palette.type === 'dark' ? '#000' : '#FFF',
  },
  cardColor222: {
    backgroundColor: theme.palette.type === 'dark' ? '#222' : '#DDD',
    color: theme.palette.type === 'dark' ? '#FFF' : '#000',
  },
  cardColor4B: {
    backgroundColor: theme.palette.type === 'dark' ? '#4B4B4B' : '#B4B4B4',
    color: theme.palette.type === 'dark' ? '#FFF' : '#000',
  },
}));
