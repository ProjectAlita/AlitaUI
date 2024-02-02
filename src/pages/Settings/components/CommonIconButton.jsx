import styled from "@emotion/styled";
import IconButton from '@/components/IconButton';

const CommonIconButton = styled(IconButton)(({ theme, disabled }) => (`
  width: 28px;
  height: 28px;
  display: inline-flex;
  padding: 0.375rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.75rem;
  background: ${!disabled ? theme.palette.background.button.primary.default : theme.palette.background.button.disabled}; 
  background-color: ${!disabled ? theme.palette.background.button.primary.default : theme.palette.background.button.disabled}  !important; 
  color: white;
`));

export default CommonIconButton;