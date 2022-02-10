import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export const pink = '#ff0083'
const bg = '#1b242e'

let darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: bg, paper: '#151c24' },
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
    body1: {
      fontSize: 17,
    },
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
    subtitle2: { fontSize: '22%', lineHeight: '1.55', marginBottom: '1em' },
  },

  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: { fontWeight: 'bold' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

darkTheme = responsiveFontSizes(darkTheme, { factor: 3 })

export default darkTheme
