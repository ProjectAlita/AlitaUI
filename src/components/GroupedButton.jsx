import { typographyVariants } from '@/MainTheme';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';

const StyledButton = styled(Button)(({ theme }) => ({
  ...typographyVariants.labelSmall,
  textTransform: 'none',
  display: 'flex',
  padding: '0.375rem 1rem',
  alignItems: 'center',
  gap: '0.5rem',
  borderRadius: '0.5rem',
  background: theme.palette.background.tabButton.default,
  color: theme.palette.text.primary,
  '&.Mui-selected': {
    color: theme.palette.text.secondary,
    '&.Mui-disabled': {
      color: theme.palette.text.primary,
    },
    '&:not(:hover)': {
      background: theme.palette.background.tabButton.active,
    }
  },
  border: 'none',
  borderRight: '0px !important',
}));

const GroupedButton = ({
  value,
  onChange,
  buttonItems,
  readOnly,
}) => {
  return (
    <ButtonGroup
      disableElevation
      variant="contained"
      aria-label="chat action buttons"
    >
      {
        buttonItems.map((item, index) => (
          <StyledButton
            key={index}
            disabled={readOnly}
            onClick={onChange}
            value={item.value}
            className={`MuiToggleButtonGroup-grouped ${
              value === item.value ? ' Mui-selected' : ''}`}
          >
            {item.label}
          </StyledButton>
        ))
      }
    </ButtonGroup>
  )
};

export default GroupedButton;