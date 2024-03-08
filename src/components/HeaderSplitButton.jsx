import { MyLibraryTabs, SearchParams, VITE_SHOW_APPLICATION, ViewMode } from '@/common/constants';
import { useFromMyLibrary, useSelectedProjectId } from '@/pages/hooks';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { useTheme } from '@emotion/react';
import { Button, ButtonGroup, Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowDownIcon from './Icons/ArrowDownIcon';
import CheckedIcon from './Icons/CheckedIcon';
import PlusIcon from './Icons/PlusIcon';
import ImportIcon from '@/components/Icons/ImportIcon';
import { useImportPromptMutation } from '@/api/prompts';
import Toast from '@/components/Toast';
import LoadingIndicator from '@/components/LoadingIndicator';
import { buildErrorMessage } from '@/common/utils';
import { useDispatch } from 'react-redux';
import TooltipForDisablePersonalSpace, { useDisablePersonalSpace } from './TooltipForDisablePersonalSpace';
import { actions } from '@/slices/prompts';

const optionsMap = {
  'Prompt': 'Prompt',
  'Datasource': 'Datasource',
  'Application': 'Application',
  'Collection': 'Collection',
};

const options = VITE_SHOW_APPLICATION ? Object.keys(optionsMap) : Object.keys(optionsMap).filter(i => i !== 'Application');
const commandPathMap = {
  'Prompt': RouteDefinitions.CreatePrompt,
  'Datasource': RouteDefinitions.CreateDatasource,
  'Application': RouteDefinitions.CreateApplication,
  'Collection': RouteDefinitions.CreateCollection,
};
const breadCrumbMap = {
  'Prompt': 'New Prompt',
  'Datasource': 'New Datasource',
  'Application': 'New Application',
  'Collection': 'New Collection',
};

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => (`
    background: ${theme.palette.split.default};
    border-radius: 28px;
    margin-right: 8px;
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
    height: 36px;

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

const MenuSectionBody = styled('div')(({ theme }) => ({
  borderBottom: `0.06rem solid ${theme.palette.border.lines}`
}));

const MenuSectionFooter = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  margin: '0.25rem 0 0.5rem',
  cursor: 'pointer',
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
  const dispatch = useDispatch();
  const theme = useTheme()
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState('Prompt');
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const selectedProjectId = useSelectedProjectId();
  const { pathname, state } = useLocation();
  const locationState = useMemo(() => state || ({ from: [], routeStack: [] }), [state]);
  const isFromEditPromptPage = useMemo(() => !!pathname.match(/\/prompts\/\d+/g), [pathname]);
  const isFromCollectionDetailPage = useMemo(() => !!pathname.match(/\/collections\/\d+/g), [pathname]);
  const isFromDataSourceDetailPage = useMemo(() => !!pathname.match(/\/datasources\/\d+/g), [pathname]);
  const isFromMyLibrary = useFromMyLibrary();
  const isCreatingNow = useMemo(() => pathname.includes('/create'), [pathname]);
  const shouldReplaceThePage = useMemo(() => isFromEditPromptPage ||
    isFromDataSourceDetailPage ||
    isFromCollectionDetailPage ||
    isCreatingNow,
    [isCreatingNow, isFromCollectionDetailPage, isFromDataSourceDetailPage, isFromEditPromptPage]);
  const [importPrompt, { error, isError, isSuccess, isLoading }] = useImportPromptMutation();
  const { shouldDisablePersonalSpace } = useDisablePersonalSpace();

  const handleCommand = useCallback(
    (option = undefined) => {
      if (onClickCommand) {
        onClickCommand();
      } else {
        const theSelectedOption = option ?? selectedOption;
        const destUrl = commandPathMap[theSelectedOption];
        const breadCrumb = breadCrumbMap[theSelectedOption]
        if (destUrl !== pathname) {
          let newRouteStack = [...locationState.routeStack];
          if (isFromMyLibrary && state) {
            if (shouldReplaceThePage) {
              newRouteStack.splice(locationState.routeStack.length - 1, 1, {
                breadCrumb,
                viewMode: ViewMode.Owner,
                pagePath: destUrl,
              });
            } else {
              newRouteStack.push({
                breadCrumb,
                viewMode: ViewMode.Owner,
                pagePath: destUrl,
              });
            }
          } else {
            //For opening creating page from solo url or from Discover, we treat it as opening it from My Library
            newRouteStack = [
              {
                breadCrumb: PathSessionMap[RouteDefinitions.MyLibrary],
                pagePath: `${RouteDefinitions.MyLibrary}/${(theSelectedOption + 's').toLowerCase()}?${SearchParams.ViewMode}=${ViewMode.Owner}`,
              },
              {
                breadCrumb,
                viewMode: ViewMode.Owner,
                pagePath: destUrl,
              }
            ];
          }
          navigate(destUrl, {
            replace: shouldReplaceThePage,
            state: { routeStack: newRouteStack }
          });

          if (destUrl === RouteDefinitions.CreatePrompt) {
            dispatch(actions.resetCurrentPromptData());
          }
        }
      }
    },
    [
      dispatch,
      onClickCommand,
      selectedOption,
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
    (option) => () => {
      setSelectedOption(option);
      setOpen(false);
      handleCommand(option)
    }, [handleCommand]);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  const handleClose = useCallback((event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }, []);

  const handleFileUpload = useCallback((event) => {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = async (e) => {
      const contents = e.target.result;
      const requestBody = JSON.parse(contents);
      await importPrompt({ projectId: selectedProjectId, body: requestBody })
    };

    reader.readAsText(file);
  }, [importPrompt, selectedProjectId]);

  const handleImportPrompt = useCallback(() => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';

    fileInput.onchange = handleFileUpload;
    fileInput.click();
  }, [handleFileUpload])

  const onCloseToast = useCallback(() => {
    setOpenToast(false);
  }, []);

  useEffect(() => {
    if (pathname.toLocaleLowerCase().includes('collection')) {
      setSelectedOption(optionsMap.Collection);
    } else if (pathname.toLocaleLowerCase().includes('application')) {
      setSelectedOption(optionsMap.Application);
    } else if (pathname.toLocaleLowerCase().includes('datasource')) {
      setSelectedOption(optionsMap.Datasource);
    } else {
      setSelectedOption(optionsMap.Prompt);
    }
  }, [pathname])

  useEffect(() => {
    if (isError) {
      setOpenToast(true);
      setToastSeverity('error');
      setToastMessage(`Import the prompt failed: ${buildErrorMessage(error)}`);
    } else if (isSuccess) {
      setOpenToast(true);
      setToastSeverity('success');
      setToastMessage('Your items have been successfully imported');
      setTimeout(() => {
        const pagePath = `${RouteDefinitions.MyLibrary}/${MyLibraryTabs[0]}?${SearchParams.ViewMode}=${ViewMode.Owner}&statuses=all`;
        const breadCrumb = PathSessionMap[RouteDefinitions.MyLibrary];
        navigate(pagePath, {
          state: {
            routeStack: [{
              breadCrumb,
              pagePath,
            }]
          }
        })
      }, 1000)
    }
  }, [error, isError, isSuccess, navigate])


  return (
    <>
      <TooltipForDisablePersonalSpace>
        <StyledButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
          <StyledDropdownButton disabled={shouldDisablePersonalSpace} sx={{ pl: 2, pr: 1 }} onClick={handleClick}>
            <PlusIcon fill={theme.palette.primary.main} />
            <span style={{ marginLeft: '8px' }}>{selectedOption}</span>
          </StyledDropdownButton>
          <StyledDivider orientation="vertical" variant="middle" flexItem />
          <StyledDropdownButton disabled={shouldDisablePersonalSpace} sx={{ pl: 1, pr: 2 }}
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
      </TooltipForDisablePersonalSpace>
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
        <MenuSectionBody>
          {options.map((option) => (
            <MenuItem
              key={option}
              selected={option === selectedOption}
              onClick={handleMenuItemClick(option)}
            >
              <Typography variant='labelMedium'>{option}</Typography>
              {option === selectedOption &&
                <StyledMenuItemIcon>
                  <CheckedIcon />
                </StyledMenuItemIcon>
              }
            </MenuItem>
          ))}
        </MenuSectionBody>
        <MenuSectionFooter onClick={handleImportPrompt}>
          <ImportIcon style={{ width: '1rem', height: '1rem' }} />
          <Typography variant='headingSmall'>Import</Typography>
        </MenuSectionFooter>
      </StyledMenu>
      <Toast
        open={openToast}
        severity={toastSeverity}
        message={toastMessage}
        onClose={onCloseToast}
      />
      <LoadingIndicator
        open={isLoading}
        title={'Importing...'}
      />
    </>
  );
}

HeaderSplitButton.propTypes = {
  onClickCommand: PropTypes.func,
}
