import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

const pink = '#ff0083'
const bg = '#1b242e'

let theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: { paper: '#151c24', default: bg },
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
      main: bg,
    },
  },
  typography: {
    fontFamily: 'IBM Plex Sans, sans-serif',
    h1: { fontFamily: 'Poppins, sans-serif', fontSize: '70%', color: pink },
    h2: { fontFamily: 'Poppins, sans-serif', fontSize: '40%' },
    h3: { fontFamily: 'Poppins, sans-serif', fontSize: '30%', marginBottom: '.2em' },
    h4: { fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '25%', fontWeight: 'normal' },
    subtitle1: { fontSize: '40%' },
  },
})
theme = responsiveFontSizes(theme, { factor: 3 })

export default theme
