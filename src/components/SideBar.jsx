import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AlitaIcon from './Icons/AlitaIcon';
import CloseIcon from './Icons/CloseIcon';
import FolderIcon from './Icons/FolderIcon';
import GearIcon from './Icons/GearIcon';
import RocketIcon from './Icons/RocketIcon';
import UserIcon from './Icons/UserIcon';

const StyledBox = styled(Box)(() => ({
  width: 260,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: 20
}));

const StyledMenuItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0, 2.5),
  marginBottom: 8,
}));

const StyledListItemIcon = styled(ListItemIcon)(() => ({
  marginRight: 8,
  minWidth: 24
}));

const StyledListItemButton = styled(ListItemButton)(({ selected }) => ({
  paddingLeft: 12,
  paddingRight: 16,
  paddingBottom: 8,
  paddingTop: 8,
  borderRadius: 8,
  '& path': {
    fill: selected ? 'white' : '#A9B7C1'
  },
  '& span': {
    color: selected ? 'white' : '#A9B7C1'
  }
}));

const StyledMenuHeader = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2.5),
}));

const StyledActivityContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2.5, 2.5),
  flex: 1,
  flexGrow: 1
}));

const StyledActivityTitleContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
}));

const StyledActivityItemContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1, 1),
  height: 24,
  display: 'box',
  lineClamp: 1,
}));

const StyledActivityTitle = styled(Typography)(() => `
  color: white;
`
);

const StyledActivityItem = styled(Typography)(({theme}) => `
  overflow: hidden;
  white-space: nowrap;
  color: ${theme.palette.text.primary};
  height: 24px;
  text-overflow: ellipsis;`
);

const MenuItem = (props) => {
  const { menuTitle, menuIcon, onClick, selected } = props;
  return (
    <StyledMenuItem>
      <StyledListItemButton selected={selected} onClick={onClick}>
        <StyledListItemIcon>
          {
            menuIcon
          }
        </StyledListItemIcon>
        <ListItemText primary={menuTitle} />
      </StyledListItemButton>
    </StyledMenuItem>
  )
}
MenuItem.propTypes = {
  menuTitle: PropTypes.string,
  menuIcon: PropTypes.element,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
}

const SideBarBody = ({ onKeyDown, onClose }) => {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const navToSettings = useCallback(() => {
    navigate('/settings');
  }, [navigate]);

  const navigateToPage = useCallback(
    (pagePath) => () => {
      const paths = pathname.split('/');
      if (!pagePath.includes(paths[1]) ) {
        navigate(pagePath);
      }
      if (onClose) {
        onClose();
      }
    },
    [navigate, onClose, pathname],
  )


  const menuData = useMemo(() => [
    { 
      menuTitle: 'Discover', 
      menuIcon: <RocketIcon />, 
      onClick: navigateToPage('/discover'), 
      selected: pathname.startsWith('/discover')
    },
    { 
      menuTitle: 'My prompts', 
      menuIcon: <UserIcon />, 
      onClick: navigateToPage('/my-prompts'), 
      selected: pathname.startsWith('/my-prompts') },
    { 
      menuTitle: 'My collections', 
      menuIcon: <FolderIcon selected />,
      onClick: navigateToPage('/my-collections'),  
      selected: pathname.startsWith('/my-collections') },
  ], [pathname, navigateToPage])

  const activities = useMemo(() => [
    'Help me choose software for [task]',
    'HTML / CSS Table With CTA',
    'Plagiarism Checker Tool Development',
    'Learning [New Technology/',
    'Choose software for [task]'
  ], [])

  return (
    <StyledBox
      role="presentation"
      onKeyDown={onKeyDown}
    >
      <StyledMenuHeader>
        <IconButton
          size="large"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 0, paddingTop: 0.8, paddingBottom: 0.8, paddingLeft: 0.8 }}
          disabled
        >
          <AlitaIcon sx={{fontSize: 36}}/>
        </IconButton>
        <CloseIcon onClick={onClose} />
      </StyledMenuHeader>
      <Divider />
      <List>
        {
          menuData.map(({ menuIcon, menuTitle, onClick, selected }) => (
            <MenuItem
              key={menuTitle}
              menuTitle={menuTitle}
              menuIcon={menuIcon}
              selected={selected}
              onClick={onClick}
            />
          ))
        }
      </List>
      <Divider />

      <StyledActivityContainer>
        <StyledActivityTitleContainer>
          <StyledActivityTitle variant="subtitle1" gutterBottom>
            Recent activity
          </StyledActivityTitle>
        </StyledActivityTitleContainer>
        <StyledActivityItemContainer>
          {
            activities.map(
              (activity, index) => (
                <StyledActivityItem
                  key={index + activity}
                  variant="body2" gutterBottom>
                  {activity}
                </StyledActivityItem>))
          }
        </StyledActivityItemContainer>
      </StyledActivityContainer>
      <StyledMenuItem>
        <StyledListItemButton onClick={navToSettings}>
          <StyledListItemIcon>
            <GearIcon />
          </StyledListItemIcon>
          <ListItemText primary='Quick access settings' />
        </StyledListItemButton>
      </StyledMenuItem>
    </StyledBox>
  )
};

SideBarBody.propTypes = {
  onClose: PropTypes.func,
  onKeyDown: PropTypes.func,
}

const SideBar = ({
  open,
  onClose,
  onKeyDown
}) => {
  const [showSideBar, setShowSideBar] = useState(false)

  const onCloseHandler = useCallback(
    () => {
      setShowSideBar(false);
      if (onClose) {
        onClose();
      }
    },
    [onClose],
  )

  useEffect(() => {
    setShowSideBar(open);
  }, [open])

  return (
    <Drawer
      anchor={'left'}
      open={showSideBar}
      onClose={onCloseHandler}
    >
      <SideBarBody
        onKeyDown={onKeyDown}
        onClose={onCloseHandler}
      />
    </Drawer>
  )
}

SideBar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onKeyDown: PropTypes.func,
}

export default SideBar;