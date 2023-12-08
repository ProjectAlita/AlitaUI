import { useViewMode } from '@/pages/EditPrompt/hooks';
import RouteDefinitions from '@/routes';
import { useTheme } from '@emotion/react';
import { Button, ButtonGroup, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowDownIcon from './Icons/ArrowDownIcon';
import PlusIcon from './Icons/PlusIcon';

const options = ['Prompt', 'Collection'];
const commandPathMap = {
  'Prompt': RouteDefinitions.CreatePrompt,
  'Collection': RouteDefinitions.CreateConnection,
};
const breadCrumbMap = {
  'Prompt': 'New Prompt',
  'Collection': 'New Connection',
};

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => (`
    background: ${theme.palette.background.splitButton};
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

    '&.Mui-selected, &:hover': {
      color: theme.palette.text.secondary,
      background: theme.palette.text.select.hover,
    },
  }
}));

const MenuSectionHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',

  '& svg': {
    marginRight: '8px',
  },

  '& .MuiTypography-root': {
    color: theme.palette.text.secondary,
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '24px',
  },
}));

export default function HeaderSplitButton({ onClickCommand }) {
  const navigate = useNavigate();
  const theme = useTheme()
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { pathname, search, state } = useLocation();
  const locationState = useMemo(() => state || ({ from: [] }), [state]);
  const currentFullPath = useMemo(() => pathname + search, [pathname, search]);
  const isFromEditPromptPage = useMemo(() => !!pathname.match(/\/prompt\/\d+/g), [pathname]);
  const viewMode = useViewMode();
  const handleCommand = useCallback(
    (index = undefined) => {
      if (onClickCommand) {
        onClickCommand();
      } else {
        const selectedOption = options[index ?? selectedIndex];
        const destUrl = commandPathMap[selectedOption];
        if (destUrl !== pathname) {
          navigate(commandPathMap[selectedOption], {
            replace: isFromEditPromptPage,
            state: {
              breadCrumb: breadCrumbMap[selectedOption],
              viewMode: viewMode,
              previousState: isFromEditPromptPage ? locationState.previousState : locationState,
              from: isFromEditPromptPage ? locationState.from : [...locationState.from, currentFullPath]
            }
          })
        }
      }
    },
    [
      onClickCommand,
      selectedIndex,
      navigate,
      isFromEditPromptPage,
      viewMode,
      locationState,
      currentFullPath,
      pathname
    ],
  )
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
            <span style={{marginLeft:'8px'}}>{options[selectedIndex]}</span>
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
          <Typography>Create</Typography>
        </MenuSectionHeader>
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={handleMenuItemClick(index)}
          >
            {option}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
}

HeaderSplitButton.propTypes = {
  onClickCommand: PropTypes.func,
}
