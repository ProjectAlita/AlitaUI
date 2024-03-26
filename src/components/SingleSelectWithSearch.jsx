import { typographyVariants } from '@/MainTheme';
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  FormControl,
  FormHelperText,
  Input,
  MenuItem,
  Popper,
  SvgIcon,
  Typography,
  debounce,
  useTheme
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ArrowDownIcon from './Icons/ArrowDownIcon';
import CheckedIcon from './Icons/CheckedIcon';
import SearchIcon from './Icons/SearchIcon';
import { StyledMenuItemIcon } from './SingleSelect';
import useToast from './useToast';


const getCommonStyle = (theme) => ({
  width: '100%',
  padding: '12px 20px',
  borderBottom: '1px solid ' + theme.palette.border.lines,
})

const SearchInputContainer = styled(FormControl)(({ theme }) => ({
  ...getCommonStyle(theme),
}));
const SearchInput = styled(Input)(() => ({
  ...typographyVariants.bodyMedium,
}))

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: '8px 24px',
  borderBottom: '1px solid ' + theme.palette.border.lines,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const FieldLabel = ({ label, required, error, isActive }) => {
  const labelColor = useMemo(() => {
    if (error) {
      return 'error'
    }
    if (isActive) {
      return 'primary'
    }
  }, [error, isActive]);
  return (
    <Box position="relative" display="inline-block">
      <Typography
        color={labelColor}
        variant="bodySmall"
      >
        {label}
      </Typography>
      {required && <Typography
        variant="bodySmall"
        component="span"
        color={labelColor}
        sx={{
          position: "absolute",
          top: 3,
          right: "-6px"
        }}
      >
        *
      </Typography>}
    </Box>
  )
}

export default function SingleSelectWithSearch({
  searchString,
  onSearch,
  value,
  onValueChange,
  options,
  label,
  required,
  error,
  helperText,
  isFetching,
  onLoadMore = () => { },
}) {
  // dropdown related
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const searchInputRef = useRef(null);
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const popperId = useMemo(() => open ? 'search-bar-popper' : undefined, [open]);

  const handleFocus = useCallback(() => {
    if (panelRef) {
      setAnchorEl(panelRef.current);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, []);

  const handleClickAway = useCallback(() => {
    setAnchorEl(null);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);


  // auto suggest list items interactions
  const handleInputChange = useCallback(
    (event) => {
      const newInputValue = event.target.value;
      onSearch(newInputValue);
    },
    [onSearch],
  );

  // search logics
  const { ToastComponent: Toast } = useToast();

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        onSearch();
      }
    },
    [onSearch],
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const onSelectItem = useCallback((option) => () => {
    onValueChange(option);
    handleClickAway();
  }, [onValueChange, handleClickAway]);

  const theme = useTheme();

  const loadMoreOnScrollOver = debounce((e) => {
    const containerDom = e.target || {};
    const clientHeight = containerDom.clientHeight;
    const scrollHeight = containerDom.scrollHeight;
    const scrollTop = containerDom.scrollTop;

    const isReachBottom = scrollTop + clientHeight > scrollHeight - 10;
    if (isReachBottom && !isFetching) {
      onLoadMore();
    }
  }, 300);

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway} >
        <Box ref={panelRef}>
          <Box onClick={handleFocus}
            sx={{
              cursor: 'pointer',
              padding: '8px 12px',
              width: '100%',
              borderBottom: error ? '1px solid red' : (open ?
                `2px solid ${theme.palette.primary.main}` :
                `1px solid ${theme.palette.border.lines}`),
            }}>

            <FieldLabel
              label={label}
              required={required}
              error={error}
              isActive={Boolean(open)}
            />

            <Box display='flex' alignItems='center' justifyContent='space-between'>
              <Typography variant='bodyMedium' component='div' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                color={value?.label ? theme.palette.text.secondary : theme.palette.text.disabled}>
                {value?.label || 'Select'}
              </Typography>
              <SvgIcon viewBox="0 0 16 16" sx={{
                fontSize: '1rem',
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}>
                <ArrowDownIcon />
              </SvgIcon>
            </Box>
          </Box>
          { error && helperText && <FormControl error={error}>
            <FormHelperText>{error ? helperText : undefined}</FormHelperText>
          </FormControl>}

          <Popper
            id={popperId}
            open={open}
            anchorEl={anchorEl}
            placement='bottom-start'
            style={{ width: panelRef.current?.clientWidth, zIndex: '1101' }}
          >
            <Box sx={{
              borderRadius: '8px',
              marginTop: '8px',
              maxHeight: '530px',
              overflowY: 'scroll',
              background: theme.palette.background.secondary,
              border: `1px solid ${theme.palette.border.lines}`,
              paddingBottom: `8px`
            }} onScroll={loadMoreOnScrollOver}>
              <SearchInputContainer>
                <SearchInput
                  ref={searchInputRef}
                  disableUnderline
                  variant="standard"
                  placeholder="Search for ..."
                  value={searchString}
                  onChange={handleInputChange}
                  onKeyDown={onKeyDown}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
              </SearchInputContainer>

              {options.length < 1 ? (
                <StyledMenuItem value=''>
                  <em>None</em>
                </StyledMenuItem>
              ) : (
                options.map((option) => {
                  return (
                    <StyledMenuItem key={option.value} value={option.value} onClick={onSelectItem(option)}>
                      <Box display='flex' flexDirection='column' gap='4px' overflowX='hidden'>
                        <Typography variant='labelMedium' color='text.secondary' sx={{ overflowX: 'hidden', textOverflow: 'ellipsis' }}>
                          {option.label}
                        </Typography>
                        <Typography variant='bodySmall' sx={{ overflowX: 'hidden', textOverflow: 'ellipsis' }}>
                          {option.description}
                        </Typography>
                      </Box>
                      {option.value === value?.value && (
                        <StyledMenuItemIcon>
                          <CheckedIcon />
                        </StyledMenuItemIcon>
                      )}
                    </StyledMenuItem>
                  );
                })
              )}

              {isFetching &&
                <Box sx={{ padding: '8px 24px' }}>
                  <CircularProgress size={24} />
                </Box>}
            </Box>
          </Popper>
          <Toast />
        </Box>
      </ClickAwayListener>
    </>
  )
}