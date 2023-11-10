import { createTheme } from "@mui/material";

const defaultBackgroundColor = '#0E131D';
const white5 = 'rgba(255, 255, 255, 0.05)';
const white10 = 'rgba(255, 255, 255, 0.10)';
const white20 = 'rgba(255, 255, 255, 0.20)';

const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", Roboto, Arial, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#6ae8fa',
    },
    secondary: {
      main: '#262b34',
    },
    background: {
      default: defaultBackgroundColor,
      userInputBackground: white5,
      activeBG: '#26323D',
      tabButton: {
        active: white20,
        default: white5,
      },
      icon: {
        default: white10
      }
    },
    border: {
      lines: '#3B3E46',
      activeBG: '#26323D',
    },
    text: {
      primary: '#A9B7C1',
      secondary: '#FFF',
      button: {
        primary: '#0E131D'
      }
    },
    icon: {
      fill: {
        default: 'white'
      }
    }
  },
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: '#1a1f28',
          color: '#A9B7C1',
          display: 'flex',
          padding: '8px',
          alignItems: 'center',
          gap: '8px',
          fontSize: '16px'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: '#1a1f28',
          margin: '0 8px 8px 0',
          padding: '8px 20px',
          borderRadius: '10px',
        },
        outlined: {
          border: '1px solid rgba(255, 255, 255, 0.40)',
          background: defaultBackgroundColor,
          backdropFilter: 'blur(6px)',
          color: '#FFF',
        },
        label: {
          fontSize: '12px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '16px',
          opacity: '0.8',
        }
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '32px',
          fontSize: '14px',
          fontWeight: '500',
          '& button': {
            minHeight: '30px',
            textTransform: 'capitalize',
          },
          '& button>svg': {
            fontSize: '16px',
          }
        },

      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: defaultBackgroundColor,
        }
      }
    }
  }
});

export default theme