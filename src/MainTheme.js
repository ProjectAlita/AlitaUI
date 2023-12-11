import { CENTERED_CONTENT_BREAKPOINT } from '@/common/constants'

const deepGrey = '#1a1f28';
const cyan = '#6ae8fa';
const darkslateGray = '#262b34';
const white5 = 'rgba(255, 255, 255, 0.05)';
const white10 = 'rgba(255, 255, 255, 0.10)';
const white20 = 'rgba(255, 255, 255, 0.20)';
const skyBlue = '#29B8F5';
const gray10 = '#A9B7C1';
const gray20 = '#686C76';
const gray30 = '#3B3E46';
const gray50 = '#181F2A';
const gray60 = '#0E131D';
const blue10 = 'rgba(106, 232, 250, 0.10)'
const blue20 = 'rgba(106, 232, 250, 0.20)';
const blue30 = 'rgba(106, 232, 250, 0.30)';
const grey500 = '#ABB3B9';
const dangerRed = '#D71616';
const primaryHover = '#83EFFF';
const primaryPressed = '#2ABDD2';

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
          color: gray10,
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: deepGrey,
        },
        outlined: {
          background: gray60,
          color: 'white',
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: gray60,
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: 'white',
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: gray50,
          borderRadius: '0.5rem',
          border: `1px solid ${gray30}`,
        },
      },
    },
  }
}

const getDesignTokens = mode => ({
  breakpoints: {
    values: {
      centered_content: CENTERED_CONTENT_BREAKPOINT,
      prompt_list_xs: 0,
      prompt_list_sm: 600,
      prompt_list_md: 1140,
      prompt_list_lg: 1530,
      prompt_list_xl: 1930,
      prompt_list_xxl: 2570,
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: '"Montserrat", Roboto, Arial, sans-serif',
    fontFeatureSettings: '"clig" 0, "liga" 0',
    headingMedium: {
      color: 'white',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '24px',
    },
    headingSmall: {
      color: 'white',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '24px',
    },
    labelMedium: {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '24px',
    },
    labelSmall: {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '16px',
    },
    bodyMedium: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '24px',
    },
    bodySmall: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '16px',
    },
    subtitle: {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '16px',
      letterSpacing: '0.72px',
      textTransform: 'uppercase',
    },
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
      default: gray60,
      secondary: gray50,
      userInputBackground: white5,
      activeBG: '#26323D',
      secondaryBg: gray50,
      tabButton: {
        active: white20,
        default: white5,
      },
      icon: {
        default: white10,
        trophy: '#48433F',
      },
      button: {
        default: white10,
        normal: white10,
        danger: dangerRed,
        primary: {
          hover: primaryHover,
          pressed: primaryPressed,
          disabled: gray20,
        },
        secondary: {
          hover: white20,
          pressed: gray60,
          disabled: gray20,
        }
      }
    },
    border: {
      lines: gray30,
      activeBG: '#26323D',
      category: {
        selected: white20,
      }
    },
    text: {
      primary: gray10,
      secondary: 'white',
      button: {
        primary: gray60,
        secondary: gray60,
        disabled: gray20
      },
      input: {
        label: gray10,
        primary: gray60,
      },
      select: {
        hover: white10,
        selected: {
          primary: 'white',
          secondary: gray10,
        },
      },
      info: skyBlue,
      contextHighLight: '#3d3d3d',
    },
    icon: {
      fill: {
        default: gray10,
        primary: grey500,
        secondary: 'white',
        send: gray60,
        trophy: '#FFD3A0'
      }
    },
    split: {
      default: blue20,
      hover: blue30,
      pressed: blue10,
    },
    status: {
      draft: skyBlue,
      onModeration: '#E97912',
      published: '#2BD48D',
      rejected: dangerRed,
      userApproval: '#F1DB17',
    }
  } : {
    mode: 'light',
  },
  ...(mode === 'dark' ? darkModeComponents : {}),
});

export default getDesignTokens;