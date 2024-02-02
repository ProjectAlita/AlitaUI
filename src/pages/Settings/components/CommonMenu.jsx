import { Menu } from '@mui/material';

export const CommonMenu = styled(Menu)(({ theme }) => ({
  width: 'auto !important',
  '& .MuiPaper-root': {
    borderRadius: '8px',
    marginTop: '8px',
    border: `1px solid ${theme.palette.border.lines}`,
    background: theme.palette.background.secondary,
  },
  '& .MuiList-root': {
    padding: 0,
  },
  '& .MuiMenuItem-root': {
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '24px',
    padding: '8px 20px 8px 20px',

    '&:hover': {
      backgroundColor: theme.palette.background.select.hover,
    },

    '&.Mui-selected': {
      backgroundColor: theme.palette.background.select.selected.default,
    },

    '&.Mui-selected:hover': {
      backgroundColor: theme.palette.background.select.selected.hover,
    },
  }
}));