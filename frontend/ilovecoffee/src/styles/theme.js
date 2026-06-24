import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#8b572a',
      dark: '#5f3717',
      light: '#ead0ad',
    },

    secondary: {
      main: '#d9903d',
    },

    background: {
      default: '#f7efe4',
      paper: '#fffaf3',
    },

    text: {
      primary: '#2b1d12',
      secondary: '#7b624d',
    },
  },

  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },

  shape: {
    borderRadius: 18,
  },
});

export default theme;