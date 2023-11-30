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
import Link from '@mui/material/Link';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../reducers/user';
import HeaderSplitButton from './HeaderSplitButton';
import AlitaIcon from './Icons/AlitaIcon';
import NotificationButton from './NotificationButton';
import { SearchIconWrapper, SearchPanel, StyledInputBase } from './SearchPanel.jsx';
import isPropValid from '@emotion/is-prop-valid';
import SideBar from './SideBar';
import RouteDefinitions from '../routes';

export const StyledPersonIcon = styled(PersonIcon)(({ theme }) => `
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
        navigate(RouteDefinitions.Profile)
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
    [RouteDefinitions.Discover]: 'Discover',
    [RouteDefinitions.MyLibrary]: 'My Library',
    [RouteDefinitions.Collections]: 'Collections',
    [RouteDefinitions.Profile]: 'Profile',
};

const TitleBread = () => {
    const { pathname, state: locationState } = useLocation();
    const { from, breadCrumb = '' } = locationState ?? {};
    const isFromEditPromptPage = useMemo(() => pathname.match(/\/prompt\/\d+/g), [pathname]);
    const { currentPrompt: { name } } = useSelector((state) => state.prompts);
    const breadCrumbString = useMemo(() => {
        const result = PathSessionMap[pathname];
        if (result) {
            return result;
        }
        return breadCrumb || (isFromEditPromptPage ? name : '');
    }, [breadCrumb, isFromEditPromptPage, name, pathname]);

    const PrevPath = useCallback(() => {
        if (from) {
            return (
                <Link component={RouterLink} to={from} underline='hover'>
                    <Typography
                        textTransform={'capitalize'}
                        sx={{ fontSize: '0.875rem', fontWeight: '500' }}
                    >
                        {PathSessionMap[from]}
                    </Typography>
                </Link>
            );
        }
        return null;
    }, [from]);

    return (
        <Breadcrumbs aria-label="breadcrumb" color={'text.primary'}>
            {from && <PrevPath />}
            <Typography
                textTransform={'capitalize'}
                sx={{ fontSize: '0.875rem', fontWeight: '500' }}
            >{breadCrumbString}</Typography>
        </Breadcrumbs>
    )
}

const NameText = styled(Typography, {
    shouldForwardProp: prop => isPropValid(prop)
})(({ theme, color, width }) => `
    max-width: ${width ? width : '130px'};
    margin-left: 16px;
    margin-right: 16px;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 160%; 
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: ${color || theme.palette.text.primary}
`);

export const UserInfo = ({ color, width }) => {
    const { name } = useSelector(state => state.user);
    return name ? (
        <NameText color={color} width={width}>
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
                        sx={{ mr: 2, background: 'transparent' }}
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