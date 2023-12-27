import { SearchParams, ViewMode } from '@/common/constants';
import { useFromMyLibrary } from '@/pages/hooks';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { useTheme } from '@emotion/react';
import { Button, ButtonGroup, Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowDownIcon from './Icons/ArrowDownIcon';
import CheckedIcon from './Icons/CheckedIcon';
import PlusIcon from './Icons/PlusIcon';
import ExportIcon from '@/components/Icons/ExportIcon';

const options = ['Prompt', 'Collection'];
const commandPathMap = {
  'Prompt': RouteDefinitions.CreatePrompt,
  'Collection': RouteDefinitions.CreateCollection,
};
const breadCrumbMap = {
  'Prompt': 'New Prompt',
  'Collection': 'New Connection',
};

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => (`
    background: ${theme.palette.split.default};
    border-radius: 28px;
    margin-right: 24px;
`))

const StyledDivider = styled(Divider)(({ theme }) => (`
    background: ${theme.palette.primary.main};
    height: 16px;
    margin: 10px 0;
    opacity: 0.2;
`));

const StyledDropdownButton = styled(Button)(({ theme }) => (`
    padding-top: 10px;
    padding-bottom: 10px;
    border-right: 0px !important;
    height: 36px;import { SearchParams } from '@/common/constants';

    border-radius: 28px;
    background: none;
    color: ${theme.palette.primary.main};
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    text-transform: none;

    &:hover {
      background: ${theme.palette.split.hover};
    }
    &:active {
      background: ${theme.palette.split.pressed};
    }
`));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: '162px',
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
    padding: '8px 20px 8px 40px',

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

const MenuSectionHeader = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',

  '& svg': {
    marginRight: '8px',
  },
}));

const MenuSectionFooter = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',

  '& svg': {
    marginRight: '8px',
  },

  '&:hover': {
    backgroundColor: theme.palette.background.select.hover,
  }
}));

const MenuItemIcon = styled(ListItemIcon)(() => ({
  width: '0.625rem',
  height: '0.625rem',
  fontSize: '0.625rem',
  marginRight: '0.6rem',
  minWidth: '0.625rem !important',
  svg: {
    fontSize: '0.625rem'
  }
}));

const StyledMenuItemIcon = styled(MenuItemIcon)(() => ({
  justifySelf: 'flex-end',
  justifyContent: 'flex-end',
  marginRight: '0rem',
  marginLeft: '1rem',
  svg: {
    fontSize: '0.75rem'
  }
}));

export default function HeaderSplitButton({ onClickCommand }) {
  const navigate = useNavigate();
  const theme = useTheme()
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { pathname, state } = useLocation();
  const locationState = useMemo(() => state || ({ from: [], routeStack: [] }), [state]);
  const isFromEditPromptPage = useMemo(() => !!pathname.match(/\/prompts\/\d+/g), [pathname]);
  const isFromCollectionDetailPage = useMemo(() => !!pathname.match(/\/collections\/\d+/g), [pathname]);
  const isFromMyLibrary = useFromMyLibrary();
  const isCreatingNow = useMemo(() => pathname.includes('/create'), [pathname]);
  const shouldReplaceThePage = useMemo(() => isFromEditPromptPage || isFromCollectionDetailPage || isCreatingNow, [isCreatingNow, isFromCollectionDetailPage, isFromEditPromptPage]);
  const handleCommand = useCallback(
    (index = undefined) => {
      if (onClickCommand) {
        onClickCommand();
      } else {
        const selectedOption = options[index ?? selectedIndex];
        const destUrl = commandPathMap[selectedOption];
        if (destUrl !== pathname) {
          let newRouteStack = [...locationState.routeStack];
          if (isFromMyLibrary && state) {
            if (shouldReplaceThePage) {
              newRouteStack.splice(locationState.routeStack.length - 1, 1, {
                breadCrumb: breadCrumbMap[selectedOption],
                viewMode: ViewMode.Owner,
                pagePath: destUrl,
              });
            } else {
              newRouteStack.push({
                breadCrumb: breadCrumbMap[selectedOption],
                viewMode: ViewMode.Owner,
                pagePath: destUrl,
              });
            }
          } else {
            //For opening creating page from solo url or from Discover, we treat it as opening it from My Library
            newRouteStack = [
              {
                breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
                pagePath: `${RouteDefinitions.MyLibrary}/${(selectedOption + 's').toLowerCase()}?${SearchParams.ViewMode}=${ViewMode.Owner}`,
              },
              {
                breadCrumb: breadCrumbMap[selectedOption],
                viewMode: ViewMode.Owner,
                pagePath: destUrl,
              }
            ];
          }
          navigate(commandPathMap[selectedOption], {
            replace: shouldReplaceThePage,
            state: { routeStack: newRouteStack }
          });
        }
      }
    },
    [
      onClickCommand,
      selectedIndex,
      pathname,
      locationState.routeStack,
      isFromMyLibrary,
      state,
      navigate,
      shouldReplaceThePage
    ]
  );
  const handleClick = useCallback(() => {
    handleCommand()
    setOpen(false);
  }, [handleCommand]);

  const handleMenuItemClick = useCallback(
    (index) => () => {
      setSelectedIndex(index);
      setOpen(false);
      handleClick(index)
      handleCommand(index)
    }, [handleClick, handleCommand]);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  const handleClose = useCallback((event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (pathname.toLocaleLowerCase().includes('collection')) {
      setSelectedIndex(1);
    } else {
      setSelectedIndex(0);
    }
  }, [pathname])


  return (
    <>
      <StyledButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <StyledDropdownButton sx={{ pl: 2, pr: 1 }} onClick={handleClick}>
          <PlusIcon fill={theme.palette.primary.main} />
          <span style={{ marginLeft: '8px' }}>{options[selectedIndex]}</span>
        </StyledDropdownButton>
        <StyledDivider orientation="vertical" variant="middle" flexItem />
        <StyledDropdownButton sx={{ pl: 1, pr: 2 }}
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select operation"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDownIcon fill={theme.palette.primary.main} />
        </StyledDropdownButton>
      </StyledButtonGroup>
      <StyledMenu
        id="header-split-menu-list"
        aria-labelledby="header-split-menu-button"
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuSectionHeader>
          <PlusIcon />
          <Typography variant='headingSmall'>Create</Typography>
        </MenuSectionHeader>
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={handleMenuItemClick(index)}
          >
            <Typography variant='labelMedium'>{option}</Typography>
            { index === selectedIndex &&
              <StyledMenuItemIcon>
                <CheckedIcon />
              </StyledMenuItemIcon>
            }
          </MenuItem>
        ))}
        <MenuSectionFooter>
          <ExportIcon style={{width: '1rem', height: '1rem'}}/>
          <Typography style={{cursor: 'pointer'}} variant='headingSmall'>Import</Typography>
        </MenuSectionFooter>
      </StyledMenu>
    </>
  );
}

HeaderSplitButton.propTypes = {
  onClickCommand: PropTypes.func,
}
