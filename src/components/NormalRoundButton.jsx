import styled from "@emotion/styled";
import Button from '@/components/Button';

const NormalRoundButton = styled(Button)(({ theme }) => ({
  height: '28px',
  background: theme.palette.background.button.normal,
  '&.Mui-disabled': {
    background: theme.palette.background.button.normal,
    color: theme.palette.text.button.disabled,
  },
  '&:hover': {
    background: theme.palette.background.button.secondary.hover,
  }
}));

export default NormalRoundButton;
