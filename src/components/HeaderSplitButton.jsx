import { useTheme } from '@emotion/react';
import { Button, ButtonGroup, ClickAwayListener, Divider, Grow, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowDownIcon from './Icons/ArrowDownIcon';
import PlusIcon from './Icons/PlusIcon';
import RouteDefinitions from '@/routes';
import { useViewMode } from '@/pages/EditPrompt/hooks';

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
`));

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
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={handleMenuItemClick(index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

HeaderSplitButton.propTypes = {
  onClickCommand: PropTypes.func,
}
