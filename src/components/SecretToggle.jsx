import {
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  padding: '8px 16px',
  height: '28px',
  border: 'none',
  color: theme.palette.icon.fill.primary,
  background: theme.palette.background.tabButton.default,
  '&.Mui-selected': {
    color: theme.palette.icon.fill.secondary,
    background: theme.palette.background.tabButton.active,
  },
  '& svg': {
    fontSize: '1rem',
  }
}));

export default function SecretToggle({ showPlainText, onChange, id, name }) {
  return <ToggleButtonGroup
    size="small"
    id={id}
    name={name}
    value={showPlainText}
    onChange={onChange}
    exclusive={true}
    aria-label="secret view toggler"
    sx={{ ml: 1 }}
  >
    <StyledToggleButton
      value={false}
      key={'false'}
      sx={{ borderRadius: '8px 0 0 8px' }}
    >
      <Typography variant={'labelSmall'}>
        Secret
      </Typography>
    </StyledToggleButton>
    <StyledToggleButton
      value={true}
      key={'true'}
      sx={{ borderRadius: '0 8px 8px 0' }}
    >
      <Typography variant={'labelSmall'}>
        Plain
      </Typography>
    </StyledToggleButton>
  </ToggleButtonGroup>
}