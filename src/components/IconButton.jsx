
import MuiIconButton from '@mui/material/IconButton';

const IconButton = styled(MuiIconButton)(({ theme }) => (`
  display: flex;
  height: 28px;
  width: 28px;
  padding: 0.375rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.75rem;
  background: ${theme.palette.background.tabButton.active};
  margin-left: 0.5rem;
`));

export default IconButton;