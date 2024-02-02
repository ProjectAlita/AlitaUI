import { typographyVariants } from '@/MainTheme';
import { Box, CircularProgress, InputBase, List, ListItem, ListSubheader } from '@mui/material';
import { useCallback, useState } from 'react';
import CancelIcon from './Icons/CancelIcon';
import RemoveIcon from './Icons/RemoveIcon';
import SearchIcon from './Icons/SearchIcon';
import SendIcon from './Icons/SendIcon';

export const SearchPanel = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flexWrap: 'nowrap',
  borderRadius: 27,
  backgroundColor: theme.palette.background.button.default,
  '&:hover': {
    backgroundColor: theme.palette.background.button.hover,
  },
  padding: '8px 12px',
  flexGrow: 1,
  width: 'auto',
  height: '36px',
}));

export const StyledIconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));

export const StyledRemoveIcon = (props) => (
  <StyledIconWrapper {...props}>
    <RemoveIcon />
  </StyledIconWrapper>
)

export const StyledSearchIcon = (props) => (
  <StyledIconWrapper sx={{
    pointerEvents: 'none',
  }} {...props}
  >
    <SearchIcon />
  </StyledIconWrapper>
)

const MySendIcon = styled(SendIcon)(({ theme }) => ({
  fontSize: '16px',
  marginRight: '4px',
  fill: theme.palette.icon.fill.default,
  '&:hover': {
    fill: theme.palette.primary.main,
  }
}));

export const StyledCancelIcon = (props) => (
  <StyledIconWrapper sx={{
    marginLeft: '4px',
    marginRight: '12px'
  }} {...props}
  >
    <CancelIcon />
  </StyledIconWrapper>
)


export const StyledSendIcon = (props) => (
  <StyledIconWrapper {...props}>
    <MySendIcon />
  </StyledIconWrapper>
)

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: 'calc(100% - 6px) !important',
  '& .MuiInputBase-input': {
    fontSize: '12px',
    lineHeight: '16px',
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create('width'),
    width: '100%',
    height: '20px',
  },
}));

const LIST_TOP_PADDING = '8px';
export const StyledList = styled(List)(({ theme }) => ({
  marginTop: '4px',
  maxHeight: '530px',
  overflow: 'auto',
  backgroundColor: theme.palette.background.secondary,
  borderRadius: '4px',
  border: `1px solid ${theme.palette.border.lines}`,
  padding: `0 16px ${LIST_TOP_PADDING} 16px`
}))

export const StyledListSubheader = styled(ListSubheader)(({ theme }) => ({
  ...typographyVariants.bodyMedium,
  backgroundColor: theme.palette.background.secondary,
  padding: '14px 0 6px 0',
  display: 'flex',
  alignItems: 'center',
}))

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  ...typographyVariants.bodyMedium,
  padding: '6px 16px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
  '&.Mui-disabled': {
    color: theme.palette.text.button.disabled,
    opacity: '1',
  }
}));

export const ListSection = ({
  sectionTitle,
  isFetching,
  data,
  total,
  renderItem,
  fetchMoreData,
  emptyHint,
}) => {
  const pageSize = 5;
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const handleShowMore = useCallback(() => {
    const newVisibleCount = visibleCount + pageSize;
    setVisibleCount(newVisibleCount);
    if (data.length < newVisibleCount && data.length < total) {
      fetchMoreData();
    }
  }, [data.length, fetchMoreData, total, visibleCount]);
  return (
    <>
      <StyledListSubheader key={'sub-header-' + sectionTitle}>
        {sectionTitle}
        {
          isFetching ?
            <CircularProgress size={16} sx={{ marginLeft: 1 }} />
            : null
        }
      </StyledListSubheader >
      {
        (data?.length > 0 ?
          <>
            {data.slice(0, visibleCount).map(renderItem)}
            {total > visibleCount && (
              <StyledListItem onClick={handleShowMore}>
                {`...Show ${pageSize} More (${total - visibleCount})`}
              </StyledListItem>
            )}
          </>
          : <StyledListItem disabled>{emptyHint || `No ${sectionTitle} Match`}</StyledListItem>
        )
      }
    </>
  )
}