import {
  MIN_SEARCH_KEYWORD_LENGTH
} from '@/common/constants';
import { actions } from '@/slices/search';
import {
  Box,
  ClickAwayListener,
  Popper,
  Typography
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SearchPanel,
  StyledCancelIcon,
  StyledInputBase,
  StyledRemoveIcon,
  StyledSearchIcon,
  StyledSendIcon,
} from './SearchBarComponents';
import SuggestionList from './SuggestionList';
import useTags from './useTags';
import useToast from './useToast';

export default function SearchBar({
  searchString,
  setSearchString,
  searchTags,
  setSearchTags,
  onClear,
}) {
  const { query, queryTags } = useSelector(state => state.search);
  const disableSearchButton = useMemo(() => !searchString || query === searchString, [query, searchString]);

  // input props
  const searchTagLength = useMemo(() => searchTags.length, [searchTags]);
  const isEmptyInput = useMemo(() => !searchString || searchString.trim() === '', [searchString]);
  const showSearchButton = useMemo(() => Boolean(!!searchString || searchTagLength), [searchString, searchTagLength]);

  // dropdown related
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const popperId = useMemo(() => open ? 'search-bar-popper' : undefined, [open]);
  const showTopData = useMemo(() => open && Boolean(isEmptyInput && !searchTagLength), [isEmptyInput, open, searchTagLength]);

  const handleFocus = useCallback(() => {
    if (panelRef) {
      setAnchorEl(panelRef.current);
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
      setSearchString(newInputValue);
      if (newInputValue === '' && searchTagLength === 0) {
        onClear();
      }
    },
    [onClear, searchTagLength, setSearchString],
  );

  const handleClickTop = useCallback((search_keyword) => {
    handleInputChange({ target: { value: search_keyword } })
  }, [handleInputChange]);

  const handleAddTag = useCallback((tag) => {
    if (!searchTags.some(item => item.id === tag.id)) {
      setSearchTags([...searchTags, tag]);
      setSearchString('');
    }
  }, [searchTags, setSearchString, setSearchTags]);

  const handleDeleteTag = useCallback((tagIdToDelete) => () => {
    const restTags = searchTags.filter(({ id }) => id !== tagIdToDelete);
    setSearchTags(restTags);
    if (searchString === '' && restTags.length === 0) {
      onClear();
    }
  }, [onClear, searchString, searchTags, setSearchTags]);

  // search logics
  const { navigateWithTags } = useTags();
  const dispatch = useDispatch();
  const { ToastComponent: Toast, toastInfo } = useToast();
  const onSearch = useCallback(
    () => {
      handleClickAway();
      const tagNames = searchTags?.map(t => t.name);
      if (isEmptyInput && searchTags?.length > 0) {
        dispatch(actions.setQuery({ query: '', queryTags: searchTags }));
        navigateWithTags(tagNames);
        return;
      }

      const trimmedSearchString = searchString.trim();
      setSearchString(trimmedSearchString);
      if (trimmedSearchString.length >= MIN_SEARCH_KEYWORD_LENGTH) {
        const isChanged = query !== trimmedSearchString ||
          queryTags.length !== searchTags.length ||
          searchTags.some(sTag => !queryTags.some(qTag => sTag.id === qTag.id));
        if (isChanged) {
          dispatch(actions.setQuery({ query: trimmedSearchString, queryTags: searchTags }));
          navigateWithTags(tagNames);
        }
      } else {
        toastInfo('The search key word should be at least 3 letters long');
      }
    },
    [dispatch, handleClickAway, isEmptyInput, navigateWithTags, query, queryTags, searchString, searchTags, setSearchString, toastInfo],
  );

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

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway} >
        <SearchPanel ref={panelRef}>
          <StyledSearchIcon />

          {searchTags.map(({ id, name }) => (
            <Box key={name} sx={{ display: 'flex', padding: '4px 6px 4px 10px', gap: '4px' }}>
              <Typography
                variant='bodySmall'
                component='span'
                sx={{ whiteSpace: 'nowrap', color: 'white' }}
              >
                {name}
              </Typography>
              <StyledRemoveIcon onClick={handleDeleteTag(id)} />
            </Box>
          ))}

          <StyledInputBase
            placeholder='Let’s find something amaizing!'
            inputProps={{ 'aria-label': 'search' }}
            inputRef={inputRef}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={onKeyDown}
            value={searchString}
            endAdornment={
              showSearchButton &&
              <InputAdornment position='end'>
                <StyledCancelIcon onClick={onClear} />
                <StyledSendIcon
                  disabled={disableSearchButton}
                  onClick={onSearch}
                />
              </InputAdornment>
            }
          />

          <Popper
            id={popperId}
            open={open}
            anchorEl={anchorEl}
            placement='bottom-start'
            style={{ width: panelRef.current?.clientWidth, zIndex: '1101' }}
          >
            <SuggestionList
              searchString={searchString}
              isEmptyInput={isEmptyInput}
              searchTags={searchTags}
              searchTagLength={searchTagLength}
              showTopData={showTopData}
              handleClickTop={handleClickTop}
              handleAddTag={handleAddTag}
            />
          </Popper>
          <Toast />
        </SearchPanel>
      </ClickAwayListener>
    </>
  )
}