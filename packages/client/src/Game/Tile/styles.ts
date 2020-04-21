import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  tileWrapper: {
    background: theme.palette.type === 'dark' ? '#666' : '#FFF',
    boxSizing: 'content-box',
    padding: '4px',
  },
  tileBox: {
    background: theme.palette.type === 'dark' ? '#444' : '#CCC',
    width: '100%',
    height: '100%',
    borderRadius: '9px',
  },
  tile: {
    background: (props: any) => 'url(' + require(`../../assets/game_templates/${props.template || '001'}.png`) + ')',
  },
  tileDisabled: {
    cursor: 'not-allowed',
  },
  tileEnabled: {
    cursor: 'pointer',
  },
  tileLoading: {
    cursor: 'progress',
  },
}));
