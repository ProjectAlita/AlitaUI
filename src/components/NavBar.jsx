import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search.js';
import {
    AppBar,
    Box,
    Breadcrumbs,
    Divider,
    ListItem,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../reducers/user';
import HeaderSplitButton from './HeaderSplitButton';
import AlitaIcon from './Icons/AlitaIcon';
import NotificationButton from './NotificationButton';
import { SearchIconWrapper, SearchPanel, StyledInputBase } from './SearchPanel.jsx';
import SideBar from './SideBar';

const StyledPersonIcon = styled(PersonIcon)(({ theme }) => `
    fill: ${theme.palette.text.primary}
`)

const StyledSearchIcon = styled(SearchIcon)(({ theme }) => `
    fill: ${theme.palette.text.primary}
`)

const NavActions = () => {
    const [anchorEl, setAnchorEl] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleClick = useCallback(event => {
        setAnchorEl(event.currentTarget)
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null)
    }, [])

    const handleLogout = useCallback(() => {
        handleClose()
        dispatch(logout())
        navigate('/forward-auth/oidc/logout')
    }, [dispatch, handleClose, navigate])

    const handleProfile = useCallback(() => {
        handleClose()
        navigate('/profile')
    }, [handleClose, navigate]);

    const { email } = useSelector(state => state.user)

    return (
        <>
            <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleClick}
                color="inherit"
                sx={{ marginRight: 0 }}
            >
                <StyledPersonIcon />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <ListItem sx={{ justifyContent: 'center' }}>
                    <Typography variant='caption'>
                        {email}
                    </Typography>
                </ListItem>
                <Divider />
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
        </>
    )
};

const PathSessionMap = {
    '/discover/prompts': 'Discover',
    '/discover/collections': 'Discover',
    '/discover': 'Discover',
    '/my-prompts': 'My prompts',
    '/my-collections': 'My collections',
    '/prompt/create': 'My library / New prompt',
    '/profile': 'Profile',
}

const TitleBread = () => {
    const { pathname } = useLocation();
    const { name } = useSelector(state => state.prompts.currentPrompt);

    const breadCrumbString = useMemo(() => {
      const result = PathSessionMap[pathname];
      if (result) return result;
    
      const promptDetailRegex = /^\/prompt\/\d+$/;
      if (promptDetailRegex.test(pathname)) {
        return 'My library / ' + name;
      }
    }, [name, pathname]);

    return (
        <Breadcrumbs aria-label="breadcrumb" color={'text.primary'}>
            <Typography 
              textTransform={'capitalize'} 
              sx={{ fontSize: '0.875rem', fontWeight: '500'}}
            >{breadCrumbString}</Typography>
        </Breadcrumbs>
    )
}

const NameText = styled(Typography)(({ theme }) => `
    max-width: 130px;
    margin-left: 16px;
    margin-right: 16px;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 160%; 
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: ${theme.palette.text.primary}
`)

const UserInfo = () => {
    const { name } = useSelector(state => state.user);
    return name ? (
        <NameText>
            {name}
        </NameText>)
        : null;
}

const NavBar = () => {
    const [openSideMenu, setOpenSideMenu] = useState(false)
    const onClickIcon = useCallback(
        () => {
            setOpenSideMenu((prevState) => !prevState)
        },
        [],
    )
    const toggleDrawer = useCallback((open) => (event) => {
        if (event?.type === 'keydown' &&
            (event?.key === 'Tab' ||
                event?.key === 'Shift')) {
            return;
        }
        setOpenSideMenu(open);
    }, []);

    return (
        <AppBar position="fixed" sx={{ mb: 1 }}>
            <Toolbar variant={'regular'}>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={onClickIcon}
                    >
                        <AlitaIcon sx={{ fontSize: 36 }} />
                    </IconButton>
                    <SideBar
                        open={openSideMenu}
                        anchor={'left'}
                        onClose={toggleDrawer(false)}
                    />
                    <TitleBread />
                </Box>
                <Box sx={{ flex: 1.5 }}>
                    <SearchPanel>
                        <SearchIconWrapper>
                            <StyledSearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Let’s find something amaizing!"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </SearchPanel>
                </Box>
                <Box sx={{ flex: 1.5, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <HeaderSplitButton />
                    <NotificationButton />
                    <UserInfo />
                    <NavActions />
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar