import RouteDefinitions from '@/routes';
import {
  Divider,
  IconButton,
  List, ListItem,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import UserIcon from "@/components/Icons/UserIcon.jsx";
import CloseIcon from "@/components/Icons/CloseIcon.jsx";
import LogoutIcon from '@mui/icons-material/Logout';
import { DrawerMenuItem, StyledBox } from "@/components/Drawers/common.jsx";
import { logout } from "@/slices/user.js";
import GearIcon from '../Icons/GearIcon';
import IntegrationIcon from '../Icons/IntegrationIcon';


const RightDrawer = ({ open, onClose, onKeyDown, anchor }) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    setOpenDrawer(open)
  }, [open])

  const onCloseHandler = useCallback(
    () => {
      setOpenDrawer(false);
      if (onClose) {
        onClose();
      }
    },
    [onClose],
  )

  const navigateToPage = useCallback((pagePath, breadCrumb) => () => {
    if (pagePath !== pathname) {
      navigate(pagePath, {
        state: {
          routeStack: [{
            breadCrumb,
            pagePath,
          }]
        }
      });
    }
    if (onClose) {
      onClose();
    }
  },
    [navigate, onClose, pathname],
  )

  const buildMenuItems = ({ menuIcon, menuTitle, onClick, selected, display }) => (
    <DrawerMenuItem
      key={menuTitle}
      display={display}
      menuTitle={menuTitle}
      menuIcon={menuIcon}
      selected={selected}
      onClick={onClick}
    />
  )


  const handleLogout = useCallback(() => {
    setOpenDrawer(false)
    dispatch(logout())
    window.location.href = window.location.origin.toString() + '/forward-auth/logout'
  }, [dispatch, setOpenDrawer])


  const menuData = [
    {
      menuTitle: 'Profile',
      menuIcon: <UserIcon />,
      onClick: navigateToPage(`${RouteDefinitions.Settings}/profile`, 'Settings'),
      selected: pathname.startsWith(`${RouteDefinitions.Settings}/profile`)
    },
    {
      menuTitle: 'Configuration',
      menuIcon: <GearIcon />,
      onClick: navigateToPage(`${RouteDefinitions.Settings}/configuration`, 'Settings'),
      selected: pathname.startsWith(`${RouteDefinitions.Settings}/configuration`)
    },
    {
      menuTitle: 'Deployments',
      menuIcon: <IntegrationIcon />,
      onClick: navigateToPage(`${RouteDefinitions.Settings}/deployments`, 'Settings'),
      selected: pathname.startsWith(`${RouteDefinitions.Settings}/deployments`)
    },
  ]


  const footerMenu = [
    {
      menuTitle: 'Log out',
      menuIcon: <LogoutIcon />,
      onClick: handleLogout,
      selected: false
    },
  ]

  return (
    <Drawer
      anchor={anchor}
      open={openDrawer}
      onClose={onCloseHandler}
    >
      <StyledBox
        role="presentation"
        onKeyDown={onKeyDown}
      >
        <List sx={{ paddingX: '8px' }}>
          <ListItem sx={{ justifyContent: 'space-between' }}>
            <Typography variant={"subtitle2"} fontWeight={500} color={'text.secondary'}>Settings</Typography>
            <IconButton onClick={onClose} size={"small"} disableRipple>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </ListItem>
        </List>

        <Divider />

        <List>
          {menuData.map(buildMenuItems)}
        </List>

        <Divider />

        <List>
          {footerMenu.map(buildMenuItems)}
        </List>

      </StyledBox>
    </Drawer>
  )
}

RightDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onKeyDown: PropTypes.func,
  anchor: PropTypes.string
}

export default RightDrawer;