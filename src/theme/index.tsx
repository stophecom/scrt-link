import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

const pink = '#ff0083'

let theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: { paper: '#1b242e', default: '#1b242e' },
    primary: {
      main: pink,
    },
    error: {
      main: pink,
    },
    text: {
      primary: '#dddddd',
    },
    secondary: {
      main: '#1b242e',
    },
  },
  typography: {
    fontFamily: 'IBM Plex Sans, sans-serif',
    h1: { fontFamily: 'Poppins, sans-serif', fontSize: '80%', color: pink },
    h2: { fontFamily: 'Poppins, sans-serif' },
    h3: { fontFamily: 'Poppins, sans-serif' },
    subtitle1: { fontSize: '32%' },
  },
})
theme = responsiveFontSizes(theme, { factor: 3 })

export default theme
