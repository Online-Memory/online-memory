import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  tileWrapper: {
    position: 'relative',
    zIndex: (props: any) => (props.tileStatus === 'show' || props.tileStatus === 'taken' ? 999 : 99),
    boxSizing: 'content-box',
    padding: '4px',
  },
  tile: {
    background: (props: any) => 'url(' + require(`../../assets/game_templates/${props.template || '001'}.png`) + ')',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.25), 1px 1px 2px 1px rgba(0, 0, 0, 0.3)',
    transition: 'transform .3s ease-in-out, box-shadow .2s ease-in-out, opacity 1s ease-in-out 1.5s',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 0',
    borderRadius: '8px',
    width: '100%',
    height: '100%',
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
  firstMove: {
    backgroundBlendMode: 'luminosity',
    backgroundColor: 'gray!important',
  },
}));
