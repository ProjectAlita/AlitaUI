const midnightBlack = '#0E131D';
const deepGrey = '#1a1f28';
const powderBlue = '#A9B7C1';
const cyan = '#6ae8fa';
const darkslateGray = '#262b34';
const white5 = 'rgba(255, 255, 255, 0.05)';
const white10 = 'rgba(255, 255, 255, 0.10)';
const white20 = 'rgba(255, 255, 255, 0.20)';
const skyBlue = '#29B8F5';
const gray10 = '#A9B7C1';
const gray60 = '#0E131D';
const blue20 = 'rgba(106, 232, 250, 0.20)';
const grey500 = '#ABB3B9';

const darkModeComponents = {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          height: '100%',
          '::-webkit-scrollbar': {
              display: 'none'
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: deepGrey,
          color: powderBlue,
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: deepGrey,
        },
        outlined: {
          background: midnightBlack,
          color: 'white',
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: midnightBlack,
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: 'white',
        }
      }
    }
  }
}

const getDesignTokens = mode => ({
  typography: {
    fontFamily: '"Montserrat", Roboto, Arial, sans-serif',
  },
  palette: mode === 'dark' ? {
    mode: 'dark',
    primary: {
      main: cyan,
    },
    secondary: {
      main: darkslateGray,
    },
    background: {
      default: midnightBlack,
      secondary: '#181F2A',
      userInputBackground: white5,
      activeBG: '#26323D',
      secondaryBg: '#181F2A',
      tabButton: {
        active: white20,
        default: white5,
      },
      icon: {
        default: white10,
        trophy: '#48433F',
      },
      splitButton: blue20,
    },
    border: {
      lines: '#3B3E46',
      activeBG: '#26323D',
      category: {
        selected: white20,
      }
    },
    text: {
      primary: powderBlue,
      secondary: 'white',
      button: {
        primary: '#0E131D',
        secondary: gray60,
      },
      input: {
        label: gray10,
        primary: midnightBlack,
      },
      info: skyBlue,
      contextHighLight: '#3d3d3d',
    },
    icon: {
      fill: {
        default: gray10,
        primary: grey500,
        secondary: 'white',
        send: midnightBlack,
        trophy: '#FFD3A0'
      }
    }
  } : {
    mode: 'light',
  },
  ...(mode === 'dark' ? darkModeComponents : {}),
});

export default getDesignTokens;