import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: { paper: '#1b242e', default: '#1b242e' },
    primary: {
      main: '#ff0083',
    },
    error: {
      main: '#ff0083',
    },
    text: {
      primary: '#dddddd',
    },
    secondary: {
      main: '#1b242e',
    },
  },
});
theme = responsiveFontSizes(theme);

export default theme;
