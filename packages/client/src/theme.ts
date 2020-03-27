import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/lightBlue';
import grey from '@material-ui/core/colors/grey';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blue[600],
    },
    secondary: grey,
    background: {
      default: grey[900],
    },
  },
});
