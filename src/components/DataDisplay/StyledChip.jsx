import { RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE } from "@/common/constants";
import { filterProps } from "@/common/utils";
import { Chip } from "@mui/material";

const StyledChip = styled(Chip, filterProps('isSelected'))(({ theme, isSelected }) => ({
  maxWidth: `calc(${RIGHT_PANEL_WIDTH_OF_CARD_LIST_PAGE} - 16px)`,
  margin: '0 0.5rem 0.5rem 0',
  padding: '0.5rem 1.25rem',
  borderRadius: '0.625rem',
  background: isSelected ? theme.palette.background.categoriesButton.selected.active : '',
  color: isSelected? theme.palette.text.secondary: '',

  '&.MuiChip-outlined': {
    border: `1px solid ${theme.palette.border.category.selected}`,
    backdropFilter: 'blur(0.375rem)',
  },
  '& label': {
    fontSize: '0.74rem',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '1rem',
    opacity: '0.8',
  },
  '& span': {
    padding: 0
  },
  '&:hover': {
    background: isSelected ? theme.palette.background.categoriesButton.selected.hover : '',
    color: theme.palette.text.secondary
  }
}));

export default StyledChip