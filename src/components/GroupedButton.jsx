import { Typography, Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import styled from '@emotion/styled';

const StyledButton = styled(Button)(({ first, selected, theme, last }) => (`
  text-transform: none;
  display: flex;
  padding: 0.375rem 1rem;
  align-items: center;
  gap: 0.5rem;
  border-radius:${first ? '0.5rem 0rem 0rem 0.5rem' : last ? '0rem 0.5rem 0.5rem 0rem' : '0 0 0 0'};
  background:${selected ? theme.palette.background.tabButton.active : theme.palette.background.tabButton.default};
  color:${selected ? theme.palette.text.secondary : theme.palette.text.primary};
  border-right: 0px !important;
`));

const GroupedButton = ({
  buttonItems,
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
            onClick={item.onClick}
            selected={item.selected}
            first={index === 0 ?'true' : undefined}
            last={index === buttonItems.length -1 ?'true' : undefined}
          >
            <Typography variant='labelSmall'>{item.title}</Typography>
          </StyledButton>
        ))
      }
    </ButtonGroup>
  )
};

export default GroupedButton;