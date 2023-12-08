import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';

const SearchPanel = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 27,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3),
  flexGrow: 1,
  width: 'auto',
  maxWidth: '445px',
  height: '36px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.75, 1, 0.75, 1.5),
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    fontSize: '12px',
    lineHeight: '16px',
    padding: theme.spacing(1, 1, 1, 5.5),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '250px',
    },
    height: '20px',
  },
}));

export { SearchIconWrapper, SearchPanel, StyledInputBase };
