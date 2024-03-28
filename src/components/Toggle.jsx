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

export default function Toggle({ 
  value, 
  onChange, 
  id, 
  name, 
  sx={}, 
  leftValue,
  leftLabel = 'Yes', 
  rightValue,
  rightLabel = 'No'
}) {
  return <ToggleButtonGroup
    size="small"
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    exclusive={true}
    aria-label="secret view toggler"
    sx={{ ml: 1, ...sx }}
  >
    <StyledToggleButton
      value={leftValue}
      key={'true'}
      sx={{ borderRadius: '8px 0 0 8px' }}
      disableRipple
    >
      <Typography variant={'labelSmall'}>
        { leftLabel }
      </Typography>
    </StyledToggleButton>
    <StyledToggleButton
      value={rightValue}
      key={'false'}
      sx={{ borderRadius: '0 8px 8px 0' }}
      disableRipple
    >
      <Typography variant={'labelSmall'}>
        { rightLabel }
      </Typography>
    </StyledToggleButton>
  </ToggleButtonGroup>
}