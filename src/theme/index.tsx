import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

export const pink = '#ff0083'
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
      main: '#9e9e9e',
    },
  },
  typography: {
    fontFamily: 'IBM Plex Sans, sans-serif',
    h1: { fontFamily: 'Poppins, sans-serif', lineHeight: 1.3, fontSize: '66%', color: pink },
    h2: { fontFamily: 'Poppins, sans-serif', fontSize: '44%', marginBottom: '.7em' },
    h3: { fontFamily: 'Poppins, sans-serif', fontSize: '26%', marginBottom: '1em' },
    h4: {
      fontFamily: 'IBM Plex Sans, sans-serif',
      fontSize: '25%',
      fontWeight: 'normal',
      marginBottom: '.5em',
    },
    h5: {
      fontFamily: 'IBM Plex Sans, sans-serif',
      fontSize: '20%',
      fontWeight: 'normal',
      marginBottom: '.5em',
    },
    subtitle1: { fontSize: '34%', lineHeight: '1.55' },
    subtitle2: { fontSize: '20%', lineHeight: '1.55', marginBottom: '1em' },
  },
  overrides: {
    MuiFormLabel: {
      root: {
        fontWeight: 'bold',
      },
    },
  },
})
theme = responsiveFontSizes(theme, { factor: 3 })

export default theme
