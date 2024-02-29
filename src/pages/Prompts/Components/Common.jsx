import Button from '@/components/Button';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { Box, Grid, Skeleton, TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';

export const LeftContentContainer = styled(Box)(() => ({
  overflowY: 'scroll',
  height: 'calc(100vh - 11.7rem)',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '::-webkit-scrollbar': {
    display: 'none',
  }
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    overflowY: 'scroll',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    height: 'calc(100vh - 165px)',
    '::-webkit-scrollbar': {
      display: 'none',
    }
  }
}));

export const StyledGridContainer = styled(Grid)(({ theme }) => ({
  padding: 0,
  [theme.breakpoints.down('lg')]: {
    overflowY: 'scroll',
    height: 'calc(100vh - 8.6rem)',
    '::-webkit-scrollbar': {
      display: 'none'
    }
  }
}));

export const VersionSelectContainer = styled('div')(() => ({
  display: 'inline-block',
  marginRight: '2rem',
  minWidth: '4rem',
  paddingTop: '0.16rem',
}));

export const LeftGridItem = styled(Grid)(() => ({
  position: 'relative',
  padding: '0 0 0 0',
}));

export const RightGridItem = styled(Grid)(() => ({
  padding: '0 0 0 0',
}));

export const StyledInput = styled(TextField)(({ theme }) => ({
  padding: `8px 0 0 0`,
  '& .MuiFormLabel-root': {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: 400,
    left: '12px',
  },
  '& .MuiInputLabel-shrink': {
    fontSize: '16px',
    lineHeight: '21px',
    fontWeight: 400,
    top: '12px',
  },
  '& .MuiInputBase-root': {
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& textarea::-webkit-scrollbar': {
    display: 'none'
  },
  '& #prompt-context': {
    overflowY: 'scroll',
  },
  '& label': {
    color: theme.palette.text.primary
  },
  '& input': {
    color: theme.palette.text.secondary,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '24px',
    height: '24px',
    boxSizing: 'border-box',
    marginBottom: '8px',
  },
  '& textarea': {
    color: theme.palette.text.secondary,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '24px',
    boxSizing: 'border-box',
    marginBottom: '8px',
  },
  '& .MuiInput-underline': {
    padding: '0 12px'
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: theme.palette.border.lines,
  },
}));

export const TabBarItems = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'reverse-row',
}));

export const VersionContainer = styled(Box)(() => (`
  box-sizing: border-box;
  height: 100%;
  padding-top: 0.16rem;
`));

export const SelectLabel = styled(Typography)(() => ({
  display: 'inline-block',
}));

export const StyledUnfoldLessIcon = styled(UnfoldLessIcon)(({ theme }) => ({
  color: theme.palette.icon.fill.default,
  fontSize: 'inherit',
}));

export const StyledUnfoldMoreIcon = styled(UnfoldMoreIcon)(({ theme }) => ({
  color: theme.palette.icon.fill.default,
  fontSize: 'inherit',
}));

export const StyledIconButton = styled(IconButton)(() => ({
  zIndex: 100,
  marginRight: '-1.096rem',
  position: 'absolute',
  top: '0',
  right: '8px'
}));

export const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.button.secondary,
  '&.Mui-disabled': {
    backgroundColor: theme.palette.background.button.primary.disabled,
    color: theme.palette.text.button.secondary
  },
  '&:hover': {
    background: theme.palette.primary.main,
  }
}));

export const TabContentDiv = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
}))

export const PromptDetailSkeleton = ({sx}) => (<Grid sx={sx} container spacing={2}>
  <Grid item xs={6}>
    <Skeleton animation="wave" variant="rectangular" width={'100%'} height={700} />
  </Grid>
  <Grid item xs={6}>
    <Skeleton animation="wave" variant="rectangular" width={'100%'} height={700} />
  </Grid>
</Grid>);