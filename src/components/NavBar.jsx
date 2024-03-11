import {
  ApplicationsTabs,
  CENTERED_CONTENT_BREAKPOINT,
  DatasourcesTabs,
  MyLibraryTabs,
  NAV_BAR_HEIGHT,
  NAV_BAR_HEIGHT_TABLET,
  PromptsTabs,
  SearchParams,
  SettingsPersonalProjectTabs,
} from '@/common/constants';
import RightDrawer from "@/components/Drawers/RightDrawer.jsx";
import {
  useAuthorIdFromUrl,
  useAuthorNameFromUrl,
  useCollectionFromUrl,
  useIsFromUserPublic,
  useNameFromUrl,
  useViewMode,
  useDeploymentConfigNameFromUrl,
} from '@/pages/hooks';
import { actions } from '@/slices/search';
import isPropValid from '@emotion/is-prop-valid';
import PersonIcon from '@mui/icons-material/Person';
import {
  AppBar,
  Box,
  Breadcrumbs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import RouteDefinitions, { PathSessionMap } from '../routes';
import SideBar from './Drawers/SideBar';
import HeaderSplitButton from './HeaderSplitButton';
import AlitaIcon from './Icons/AlitaIcon';
import NotificationButton from './NotificationButton';
import SearchBar from './SearchBar';
import UserAvatar from './UserAvatar';
import useSearchBar from './useSearchBar';
import useTags from './useTags';
import { filterProps } from '@/common/utils';


const StyledAppBar = styled(AppBar,
  filterProps('showSearchBar')
)(({ theme, showSearchBar }) => ({
  height: NAV_BAR_HEIGHT,
  overflow: 'hidden',
  position: 'fixed',
  top: 0,
  paddingBottom: '0.5rem',
  boxShadow: 'none',
  [theme.breakpoints.up('centered_content')]: {
    maxWidth: `${CENTERED_CONTENT_BREAKPOINT}px`,
    transform: 'translateX(-50%)',
    left: '50%',
  },
  [theme.breakpoints.down('tablet')]: {
    height: showSearchBar ? NAV_BAR_HEIGHT_TABLET : NAV_BAR_HEIGHT,
  }
}))

const NavBarPlaceholder = styled(Box,
  filterProps('showSearchBar')
)(({ theme, showSearchBar }) => ({
  height: NAV_BAR_HEIGHT,
  [theme.breakpoints.down('tablet')]: {
    height: showSearchBar ? NAV_BAR_HEIGHT_TABLET : NAV_BAR_HEIGHT,
  }
}));

export const StyledPersonIcon = styled(PersonIcon)(({ theme }) => `
    fill: ${theme.palette.text.primary}
`)

const HomeButton = styled(IconButton)(() => ({
  background: 'transparent',
  padding: '0 1rem 0 0',
  '&:hover': {
    backgroundColor: 'transparent'
  }
}));

const NavActions = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const handleClick = useCallback(() => {
    setOpenDrawer((prevState) => !prevState)
  }, [],
  )
  const toggleDrawer = useCallback((open) => (event) => {
    if (event?.type === 'keydown' &&
      (event?.key === 'Tab' ||
        event?.key === 'Shift')) {
      return;
    }
    setOpenDrawer(open)
  }, [])


  const {
    name,
    avatar
  } = useSelector(state => state.user);

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
        sx={{ marginRight: 0, padding: 0 }}
      >
        <UserAvatar avatar={avatar} name={name} size={36} />
      </IconButton>
      <RightDrawer
        open={openDrawer}
        anchor={'right'}
        onClose={toggleDrawer(false)}
      />
    </>
  )
};

const getPrevPathName = (routeStack, currentPath, collection, name, authorName) => {
  if (routeStack.length > 1) {
    return routeStack[routeStack.length - 2].breadCrumb;
  } else {
    if (currentPath.startsWith(RouteDefinitions.MyLibrary)) {
      if (collection) {
        return collection;
      }
      return PathSessionMap[RouteDefinitions.MyLibrary];
    } else if (currentPath.startsWith(RouteDefinitions.Prompts)) {
      return PathSessionMap[RouteDefinitions.Prompts];
    } else if (currentPath.startsWith(RouteDefinitions.DataSources)) {
      return PathSessionMap[RouteDefinitions.DataSources];
    } else if (currentPath.startsWith(RouteDefinitions.Applications)) {
      return PathSessionMap[RouteDefinitions.Applications];
    } else if (currentPath.startsWith(RouteDefinitions.Collections)) {
      if (collection) {
        return collection;
      }
      return PathSessionMap[RouteDefinitions.Collections];
    } else if (currentPath.startsWith(RouteDefinitions.UserPublic)) {
      if (collection) {
        return collection;
      } else if (name && authorName) {
        return authorName;
      }
      return PathSessionMap[RouteDefinitions.UserPublic];
    } else if (currentPath.startsWith(RouteDefinitions.CreatePersonalToken) ||
      currentPath.startsWith(RouteDefinitions.CreateDeployment) ||
      currentPath.match(/\/settings\/edit-deployment\/\d+/g)) {
      return PathSessionMap[RouteDefinitions.Settings];
    }
    return '';
  }
}

const getTabFromUrl = (url, defaultTab) => {
  const paths = url.split('/').filter(item => item.length > 0);
  const tab = paths.length > 2 ? paths[1] : defaultTab;
  return tab;
}

const getPrevPath = (routeStack, currentPath, viewMode, collection, authorId, authorName) => {
  if (routeStack.length > 1) {
    return routeStack[routeStack.length - 2].pagePath;
  } else {
    if (currentPath.startsWith(RouteDefinitions.MyLibrary)) {
      if (collection) {
        return `${currentPath.split('/prompts')[0]}?${SearchParams.ViewMode}=${viewMode}`;
      }
      return `${RouteDefinitions.MyLibrary}/${getTabFromUrl(currentPath, MyLibraryTabs[0])}?${SearchParams.ViewMode}=${viewMode}`;
    } else if (currentPath.startsWith(RouteDefinitions.Prompts)) {
      return `${RouteDefinitions.Prompts}/${getTabFromUrl(currentPath, PromptsTabs[0])}?${SearchParams.ViewMode}=${viewMode}`;
    } else if (currentPath.startsWith(RouteDefinitions.DataSources)) {
      return `${RouteDefinitions.DataSources}/${getTabFromUrl(currentPath, DatasourcesTabs[0])}?${SearchParams.ViewMode}=${viewMode}`;
    } else if (currentPath.startsWith(RouteDefinitions.Applications)) {
      return `${RouteDefinitions.Applications}/${getTabFromUrl(currentPath, ApplicationsTabs[0])}?${SearchParams.ViewMode}=${viewMode}`;
    } else if (currentPath.startsWith(RouteDefinitions.Collections)) {
      if (collection) {
        return `${currentPath.split('/prompts')[0]}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${encodeURIComponent(collection)}`;
      }
      return `${RouteDefinitions.Collections}/${getTabFromUrl(currentPath, PromptsTabs[0])}?${SearchParams.ViewMode}=${viewMode}`;
    } else if (currentPath.startsWith(RouteDefinitions.UserPublic)) {
      if (collection) {
        if (currentPath.match(/\/user-public\/prompts\/\d+/g)) {
          return `${RouteDefinitions.UserPublic}/${MyLibraryTabs[4]}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.AuthorId}=${authorId}&${SearchParams.AuthorName}=${authorName}`;
        }
        return `${currentPath.split('/prompts')[0]}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${encodeURIComponent(collection)}&${SearchParams.AuthorId}=${authorId}&${SearchParams.AuthorName}=${authorName}`;
      } else if (currentPath.match(/\/user-public\/collections\/\d+/g)) {
        return `${RouteDefinitions.UserPublic}/${MyLibraryTabs[4]}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.AuthorId}=${authorId}&${SearchParams.AuthorName}=${authorName}`;
      } else if (currentPath.match(/\/user-public\/prompts\/\d+/g)) {
        return `${RouteDefinitions.UserPublic}/${MyLibraryTabs[1]}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.AuthorId}=${authorId}&${SearchParams.AuthorName}=${authorName}`;
      } else if (currentPath.match(/\/user-public\/datasources\/\d+/g)) {
        return `${RouteDefinitions.UserPublic}/${MyLibraryTabs[2]}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.AuthorId}=${authorId}&${SearchParams.AuthorName}=${authorName}`;
      } else if (currentPath.match(/\/user-public\/applications\/\d+/g)) {
        return `${RouteDefinitions.UserPublic}/${MyLibraryTabs[3]}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.AuthorId}=${authorId}&${SearchParams.AuthorName}=${authorName}`;
      }
      return `${RouteDefinitions.Prompts}/${PromptsTabs[0]}?${SearchParams.ViewMode}=${viewMode}`;
    } else if (currentPath.startsWith(RouteDefinitions.CreatePersonalToken)) {
      return `${RouteDefinitions.Settings}/${SettingsPersonalProjectTabs[1]}`;
    } else if (currentPath.startsWith(RouteDefinitions.CreateDeployment) ||
      currentPath.match(/\/settings\/edit-deployment\/\d+/g)) {
      return `${RouteDefinitions.Settings}/${SettingsPersonalProjectTabs[2]}`;
    }
    return '';
  }
}

const getPrevState = (routeStack, prevPath, prevPathName, viewMode) => {
  if (routeStack.length > 1) {
    return {
      routeStack: routeStack.slice(0, routeStack.length - 1),
    };
  } else {
    return {
      routeStack: [{
        pagePath: prevPath,
        breadCrumb: prevPathName,
        viewMode,
      }]
    };
  }
}

const BreadCrumbLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    color: 'white'
  }
}));

const isSubpathUnderMyLibraryOrPrompts = (url) => {
  const paths = url.split('/').filter(item => item.length > 0);
  return paths.length > 2;
}

const TitleBread = () => {
  const { pathname, state: locationState } = useLocation();
  const { showSearchBar } = useSearchBar();
  const isCreating = useMemo(() => pathname.startsWith(RouteDefinitions.CreateCollection) ||
    pathname.startsWith(RouteDefinitions.CreatePrompt), [pathname]);
  const name = useNameFromUrl();
  const deploymentConfigName = useDeploymentConfigNameFromUrl();
  const viewMode = useViewMode();
  const authorName = useAuthorNameFromUrl();
  const authorId = useAuthorIdFromUrl();
  const isFromUserPublic = useIsFromUserPublic();
  const collection = useCollectionFromUrl();
  const { searchDone } = useSelector(state => state.search);
  const { routeStack } = locationState ?? { routeStack: [] };
  const { breadCrumb } = routeStack[routeStack.length - 1] || {};
  const hasMultiplePaths = useMemo(() => {
    if (searchDone && showSearchBar) {
      return false;
    }
    if (routeStack.length > 1) {
      return true;
    } else {
      if (pathname.startsWith(RouteDefinitions.MyLibrary)) {
        return isSubpathUnderMyLibraryOrPrompts(pathname);
      } else if (pathname.startsWith(RouteDefinitions.Prompts)) {
        return isSubpathUnderMyLibraryOrPrompts(pathname);
      } else if (pathname.startsWith(RouteDefinitions.DataSources)) {
        return isSubpathUnderMyLibraryOrPrompts(pathname);
      } else if (pathname.startsWith(RouteDefinitions.Applications)) {
        return isSubpathUnderMyLibraryOrPrompts(pathname);
      } else if (pathname.startsWith(RouteDefinitions.Collections)) {
        return isSubpathUnderMyLibraryOrPrompts(pathname);
      } else if (pathname.startsWith(RouteDefinitions.UserPublic)) {
        return true;
      } else if (pathname.startsWith(RouteDefinitions.CreatePersonalToken)) {
        return true;
      } else if (pathname.startsWith(RouteDefinitions.CreateDeployment)) {
        return true;
      } else if (pathname.match(/\/settings\/edit-deployment\/\d+/g)) {
        return true;
      }
      return false;
    }
  }, [searchDone, showSearchBar, routeStack.length, pathname]);

  const breadCrumbString = useMemo(() => {
    if (searchDone && showSearchBar) {
      return 'Search results'
    } else if (breadCrumb) {
      return breadCrumb;
    } else if (name) {
      return name;
    } else if (isFromUserPublic) {
      return authorName;
    }
    const result = PathSessionMap[pathname];
    if (result) {
      return result;
    } else if (pathname.startsWith(RouteDefinitions.MyLibrary)) {
      if (pathname.startsWith(RouteDefinitions.CreatePrompt)) {
        return PathSessionMap[RouteDefinitions.CreatePrompt]
      } else if (pathname.startsWith(RouteDefinitions.CreateCollection)) {
        return PathSessionMap[RouteDefinitions.CreateCollection]
      } else {
        return PathSessionMap[RouteDefinitions.MyLibrary];
      }
    } else if (pathname.startsWith(RouteDefinitions.Prompts)) {
      return PathSessionMap[RouteDefinitions.Prompts];
    } else if (pathname.startsWith(RouteDefinitions.Collections)) {
      return PathSessionMap[RouteDefinitions.Collections];
    } else if (pathname.startsWith(RouteDefinitions.DataSources)) {
      return PathSessionMap[RouteDefinitions.DataSources];
    } else if (pathname.startsWith(RouteDefinitions.Applications)) {
      return PathSessionMap[RouteDefinitions.Applications];
    } else if (pathname.startsWith(RouteDefinitions.Settings)) {
      if (pathname.match(/\/settings\/edit-deployment\/\d+/g)) {
        return deploymentConfigName;
      }
      return PathSessionMap[RouteDefinitions.Settings];
    }
    return '';
  }, [authorName, breadCrumb, deploymentConfigName, isFromUserPublic, name, pathname, searchDone, showSearchBar]);

  const PrevPath = useCallback(() => {
    if (hasMultiplePaths || isCreating) {
      const prevPath = getPrevPath(routeStack, pathname, viewMode, collection, authorId, authorName);
      const prevPathName = getPrevPathName(routeStack, pathname, collection, name, authorName);
      const prevState = getPrevState(routeStack, prevPath, prevPathName, viewMode);
      return (
        <BreadCrumbLink
          component={RouterLink}
          to={prevPath}
          state={prevState}
          underline='hover'
        >
          {prevPathName}
        </BreadCrumbLink>
      );
    }
    return null;
  }, [
    hasMultiplePaths,
    isCreating,
    routeStack,
    pathname,
    viewMode,
    collection,
    authorId,
    authorName,
    name]);

  const breadCrumbFontStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
  };

  return (
    <Breadcrumbs aria-label="breadcrumb" color={'text.primary'} {...breadCrumbFontStyle}>
      {(hasMultiplePaths || isCreating) && <PrevPath />}
      <Typography
        color='white'
        sx={breadCrumbFontStyle}
      >{breadCrumbString}</Typography>
    </Breadcrumbs>
  )
}

const NameText = styled(Typography, {
  shouldForwardProp: prop => isPropValid(prop)
})(({ theme, color }) => `
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

export const UserInfo = ({ color }) => {
  const { name } = useSelector(state => state.user);
  return name ? (
    <NameText color={color}>
      {name}
    </NameText>)
    : null;
}

const NavBar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [prevPathName, setPrevPathName] = useState(pathname);
  const { query, queryTags } = useSelector(state => state.search);
  const [searchString, setSearchString] = useState(query);
  const [searchTags, setSearchTags] = useState(queryTags);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { showSearchBar } = useSearchBar();
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

  const { navigateWithTags, selectedTags: urlTags } = useTags();
  const onClear = useCallback(
    () => {
      setSearchString('');
      setSearchTags([]);
      dispatch(actions.resetQuery());
      if (urlTags) {
        navigateWithTags([]);
      }
    },
    [dispatch, navigateWithTags, urlTags],
  );

  useEffect(() => {
    const pathRoot = pathname.split('/')[1];
    if (prevPathName !== pathRoot) {
      onClear();
      setPrevPathName(pathRoot);
    }
  }, [dispatch, onClear, pathname, prevPathName]);

  const theme = useTheme();
  const showTabletView = useMediaQuery(theme.breakpoints.down('tablet'));
  return (<>
    <NavBarPlaceholder showSearchBar={showSearchBar} />
    <StyledAppBar showSearchBar={showSearchBar}>
      <Toolbar variant={'regular'} sx={{ padding: '16px 24px', justifyContent: 'space-between', gap: '32px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HomeButton
            size="large"
            color="inherit"
            aria-label="open drawer"
            onClick={onClickIcon}
            disableRipple
          >
            <AlitaIcon sx={{ fontSize: 36 }} />
          </HomeButton>
          <SideBar
            open={openSideMenu}
            anchor={'left'}
            onClose={toggleDrawer(false)}
          />
          <TitleBread />
        </Box>
        {showSearchBar && !showTabletView && <SearchBar
          searchString={searchString}
          setSearchString={setSearchString}
          searchTags={searchTags}
          setSearchTags={setSearchTags}
          onClear={onClear}
        />}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <HeaderSplitButton />
          <NotificationButton display='none' />
          <UserInfo />
          <NavActions />
        </Box>
      </Toolbar>

      <Box variant={'regular'} sx={{ padding: '0 24px', justifyContent: 'space-between', gap: '32px' }}>
        {showSearchBar && showTabletView && <SearchBar
          searchString={searchString}
          setSearchString={setSearchString}
          searchTags={searchTags}
          setSearchTags={setSearchTags}
          onClear={onClear}
        />}
      </Box>
    </StyledAppBar>
  </>)
}

export default NavBar