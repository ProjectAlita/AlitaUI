import { CENTERED_CONTENT_BREAKPOINT } from '@/common/constants'

const deepGrey = '#1a1f28';
const primaryDefault = '#6ae8fa';
const white = '#FFFFFF'
const white5 = 'rgba(255, 255, 255, 0.05)';
const white10 = 'rgba(255, 255, 255, 0.10)';
const white20 = 'rgba(255, 255, 255, 0.20)';
const white50 = 'rgba(255, 255, 255, 0.50)';
const veryLightBlue = '#C7EBFF';
const skyBlue = '#29B8F5';
const gray00 = '#D3DBE2';
const gray10 = '#A9B7C1';
const gray20 = '#686C76';
const gray30 = '#3B3E46';
const gray40 = '#262b34';
const gray50 = '#181F2A';
const gray60 = '#0E131D';
const blue5 = 'rgba(41, 184, 245, 0.05)';
const blue10 = 'rgba(106, 232, 250, 0.10)'
const blue16 = 'rgba(106, 232, 250, 0.16)'
const blue20 = 'rgba(106, 232, 250, 0.20)';
const blue24 = 'rgba(106, 232, 250, 0.24)';
const blue30 = 'rgba(106, 232, 250, 0.30)';
const blue40 = 'rgba(41, 184, 245, 0.40)';
const darkBlue = '#006DD1';
const darkBlue40 = '#29B8F566';
const grey500 = '#ABB3B9';
const dangerRed = '#D71616';
const primaryHover = '#83EFFF';
const primaryPressed = '#2ABDD2';
const orange = '#F2994A';
const lightOrange = 'rgba(255, 235, 211, 1)';
const orangeFill5 = 'rgba(233, 121, 18, 0.05)';
const orangeOutline40 = 'rgba(233, 121, 18, 0.4)';
const green20 = 'rgba(43, 212, 141, 0.20)'
const green = '#2BD48D';
const purple20 = '#DE7EDA33';
const purple40 = '#DE7EDA66';



export const typographyVariants = {
  headingMedium: {
    color: white,
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '24px',
  },
  headingSmall: {
    color: white,
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
}

const darkModeComponents = {
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          scrollbarWidth: 'none',
        },
        body: {
          caretColor: 'transparent',
          height: '100%',
          '::-webkit-scrollbar': {
              display: 'none'
          },
          msOverflowStyle: 'none',
        },
        input: {
          caretColor: 'auto',
        },
        textArea: {
          caretColor: 'auto',
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
          color: white,
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
          color: white,
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
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          color: gray10,
          '& .MuiTablePagination-select.MuiSelect-standard': {
            color: gray10,
          }
        },
        selectLabel: {
          ...typographyVariants.labelSmall,
          color: gray20,
        },
        displayedRows: {
          ...typographyVariants.labelSmall,
          color: gray10,
        },
        menuItem: {
          fontSize: '0.75rem',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.MuiTab-textColorPrimary": {
            color: gray10,
          },
          "&.Mui-selected": {
            color: primaryDefault,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          backgroundColor: 'green',
          color: white
        },
        filledError: {
          backgroundColor: 'red',
          color: white
        },
        filledInfo: {
          backgroundColor: darkBlue,
          color: white
        },
        filledWarning: {
          backgroundColor: 'orange',
          color: white
        },
      }
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          size: 16,
          color: gray10,
          "&.Mui-checked": {
            color: white,
          },
          '& .MuiSvgIcon-root': {
            fontSize: 20,
          },
        },

      }
    }
  }
}

const getDesignTokens = mode => ({
  breakpoints: {
    values: {
      centered_content: CENTERED_CONTENT_BREAKPOINT,
      prompt_list_xs: 0,
      prompt_list_sm: 600,
      prompt_list_full_width_sm: 846,
      prompt_list_md: 1140,
      prompt_list_lg: 1530,
      prompt_list_xl: 1930,
      prompt_list_xxl: 2570,
      tablet: 1024,
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
    ...typographyVariants
  },
  palette: mode === 'dark' ? {
    mode: 'dark',
    primary: {
      main: primaryDefault,
    },
    secondary: {
      main: '#A9B7C1'
    },
    info: {
      main: darkBlue,
      secondary: darkBlue40
    },
    background: {
      default: gray60,
      secondary: gray50,
      userInputBackground: white5,
      activeBG: '#26323D',
      categoriesButton: {
        selected: {
          active: darkBlue,
          hover: darkBlue40
        }
      },
      tabButton: {
        active: white20,
        default: white5,
      },
      icon: {
        default: white10,
        trophy: '#48433F',
      },
      select: {
        hover: white10,
        selected: {
          default: blue16,
          hover: blue24,
        }
      },
      button: {
        default: white10,
        normal: white10,
        danger: dangerRed,
        primary: {
          default: primaryDefault,
          hover: primaryHover,
          pressed: primaryPressed,
          disabled: gray20,
        },
        secondary: {
          default: white10,
          hover: white20,
          pressed: gray60,
          disabled: gray20,
        }
      },
      tooltip: {
        default: gray00
      },
      tips: blue5,
      attention: orangeFill5,
      text: {
        highlight: orange,
      },
      aiAnswerActions: 'linear-gradient(270deg, #262B34 82.5%, rgba(38, 43, 52, 0.00) 100%)',
      userMessageActions: 'linear-gradient(270deg, #0E131D 82.5%, rgba(14, 19, 29, 0.00) 100%)',
      conversationStarters: {
        default: purple20,
        hover: purple40
      },
    },
    border: {
      lines: gray30,
      hover: gray10,
      activeBG: '#26323D',
      category: {
        selected: white20,
      },
      tips: blue40,
      attention: orangeOutline40,
      table: gray40,
    },
    text: {
      default: gray10,
      primary: gray10,
      secondary: white,
      button: {
        primary: gray60,
        secondary: gray60,
        disabled: gray20,
        showMore: primaryPressed,
      },
      input: {
        label: gray10,
        primary: gray60,
        placeholder: gray30,
        disabled: white50,
      },
      select: {
        selected: {
          primary: white,
          secondary: gray10,
        },
      },
      info: skyBlue,
      tips: veryLightBlue,
      attention: lightOrange,
      metrics: gray00,
      contextHighLight: '#3d3d3d',
    },
    icon: {
      main: gray10,
      fill: {
        default: gray10,
        primary: grey500,
        secondary: white,
        send: gray60,
        trophy: '#FFD3A0',
        tips: skyBlue,
        disabled: gray20,
        attention: orange,
        is_default: green20,
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
      published: green,
      rejected: dangerRed,
      userApproval: '#F1DB17',
    }
  } : {
    mode: 'light',
  },
  ...(mode === 'dark' ? darkModeComponents : {}),
});

export default getDesignTokens;