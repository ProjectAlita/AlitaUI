import {Box, ListItem, ListItemButton, ListItemIcon} from "@mui/material";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

export const StyledBox = styled(Box)(() => ({
  width: 260,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: 20
}));

export const StyledMenuItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0, 2.5),
  marginBottom: 8,
  marginTop: 8,
}));

export const StyledListItemIcon = styled(ListItemIcon)(() => ({
  marginRight: 8,
  minWidth: 24,
  '& .MuiSvgIcon-root': {
    fontSize: '1rem'
  }
}));

export const StyledListItemButton = styled(ListItemButton)(({ selected, theme }) => ({
  paddingLeft: 12,
  paddingRight: 16,
  paddingBottom: 8,
  paddingTop: 8,
  borderRadius: 8,
  '& path': {
    fill: selected ? theme.palette.icon.fill.secondary : theme.palette.icon.fill.default
  },
  '& span': {
    color: selected ? theme.palette.text.secondary : theme.palette.text.primary
  }
}));

export const StyledMenuHeader = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2.5),
}));

export const StyledActivityContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2.5, 2.5),
  flex: 1,
  flexGrow: 1
}));

export const StyledActivityTitleContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
}));

export const StyledActivityItemContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1, 1),
  height: 24,
  display: 'box',
  lineClamp: 1,
}));

export const StyledActivityTitle = styled(Typography)(({ theme }) => `
  color: ${theme.palette.text.secondary};
`
);

export const StyledActivityItem = styled(Typography)(({ theme }) => `
  overflow: hidden;
  white-space: nowrap;
  color: ${theme.palette.text.primary};
  height: 24px;
  text-overflow: ellipsis;`
);

export const SectionHeader = styled('div')(({ theme }) => ({
  margin: '1.5rem 1.25rem 0.5rem 1.25rem',
  '& .MuiTypography-root': {
    fontSize: theme.typography.overline.fontSize,
  }
}));

export const DrawerMenuItem = (props) => {
  const { menuTitle, menuIcon, onClick, selected, display } = props;
  return (
    <StyledMenuItem sx={{ display }}>
      <StyledListItemButton selected={selected} onClick={onClick}>
        <StyledListItemIcon>
          {
            menuIcon
          }
        </StyledListItemIcon>
        <Typography variant='labelMedium'>{menuTitle}</Typography>
      </StyledListItemButton>
    </StyledMenuItem>
  )
}
DrawerMenuItem.propTypes = {
  menuTitle: PropTypes.string,
  menuIcon: PropTypes.element,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
}
