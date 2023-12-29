import Button from '@mui/material/Button';

const TheStyledButton = styled(Button)(({theme}) => ({
  marginRight: '0.5rem',
  ...theme.typography.labelSmall,
  padding: '6px 16px',
  borderRadius: '28px',
  textTransform: 'none',
  '&.MuiButton-containedPrimary': {
    color: theme.palette.text.button.primary,
    background: theme.palette.background.button.primary.default,
    '&:hover': {
      background: theme.palette.background.button.primary.hover,
    },
    '&:active': {
      background: theme.palette.background.button.primary.pressed,
    },
    '&:disabled': {
      color: theme.palette.text.button.primary,
      background: theme.palette.background.button.primary.disabled,
    },
  },
  '&.MuiButton-containedSecondary': {
    color: 'white',
    background: theme.palette.background.button.secondary.default,
    '&:hover': {
      background: theme.palette.background.button.secondary.hover,
    },
    '&:active': {
      color: theme.palette.text.primary,
      background: theme.palette.background.button.secondary.pressed,
      border: `1px solid ${theme.palette.border.lines}`,
    },
    '&:disabled': {
      color: theme.palette.text.button.disabled,
      background: theme.palette.background.button.default,
    },
  }
}))

export default function StyledButton (props) {
  return <TheStyledButton {...props} />;
}