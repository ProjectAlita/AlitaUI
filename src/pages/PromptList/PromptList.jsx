import { useLazyLoadMorePromptsQuery, useLazyPromptListQuery } from '@/api/prompts.js';
import { CARD_FLEX_GRID, SOURCE_PROJECT_ID, URL_PARAMS_KEY_TAGS } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import PromptCard from '@/components/Card.jsx';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import Toast from '@/components/Toast.jsx';
import { Grid, Skeleton } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Categories from './Categories.jsx';
import TrendingAuthors from './TrendingAuthors.jsx';
import RightPanel from './RightPanel';

const LoadMore = styled('a')(() => ({
  width: '100%',
  textAlign: 'center',
  cursor: 'pointer',
  textDecoration: 'underline'
}));

const LOAD_PROMPT_LIMIT = 20;

const PromptList = () => {
  const location = useLocation();
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [offset, setOffset] = React.useState(0);

  const getTagsFromUrl = React.useCallback(() => {
    const currentQueryParam = location.search ? new URLSearchParams(location.search) : new URLSearchParams();
    return currentQueryParam.getAll(URL_PARAMS_KEY_TAGS)?.filter(tag => tag !== '');
  }, [location.search]);

  const [loadPrompts, { data, isError, isLoading }] = useLazyPromptListQuery();
  const [loadMore, { 
    isError: isMoreError,
    isFetching,
    error
  }] = useLazyLoadMorePromptsQuery();
  const { total } = data || {};

  const { filteredList, tagList } = useSelector((state) => state.prompts);

  React.useEffect(() => {
    const tags = getTagsFromUrl();
    setSelectedTags(tags);
    loadPrompts({
      projectId: SOURCE_PROJECT_ID,
      params: {
        limit: LOAD_PROMPT_LIMIT,
        offset: 0,
        tags: tagList
          .filter(item => tags.includes(item.name))
          .map(item => item.id)
          .join(','),
      }
    })
  }, [getTagsFromUrl, loadPrompts, tagList]);

  const loadMorePrompts = React.useCallback(() => {
    const newOffset = offset + LOAD_PROMPT_LIMIT;
    setOffset(newOffset);
    loadMore({
      projectId: SOURCE_PROJECT_ID,
      params: {
        limit: LOAD_PROMPT_LIMIT,
        offset: newOffset,
        tags: tagList
          .filter(item => selectedTags.includes(item.name))
          .map(item => item.id)
          .join(','),
      }
    })
  }, [offset, loadMore, tagList, selectedTags]);

  React.useEffect(() => {
    const handleScroll = () => {
      const isScrollOver = window.innerHeight + document.documentElement.scrollTop === 
      document.documentElement.offsetHeight;
      if (total && total > filteredList.length && isScrollOver) {
          loadMorePrompts();
      }
    }
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredList.length, loadMorePrompts, total]);

  const styleSet = {
    1: CARD_FLEX_GRID.ONE_CARD,
    2: CARD_FLEX_GRID.TWO_CARDS,
    3: CARD_FLEX_GRID.THREE_CARDS,
  }
  const cardWidth = styleSet[filteredList.length] || CARD_FLEX_GRID.MORE_THAN_THREE_CARDS
  const { XL, LG, MD, SM, XS } = cardWidth;
  const gridStyle = React.useCallback((theme) => ({
    background: theme.palette.background.secondaryBg,
    margin: '1rem 1rem 0 0',
    minWidth: '260px',
    width: {
      xl: XL,
      lg: LG,
      md: MD,
      sm: SM,
      xs: XS
    },
    height: '192px',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.border.activeBG}`,
    display: 'flex',
    alignItems: 'center',
    flexGrow: '0',
  }), [LG, MD, SM, XL, XS])
  if (isError) return <>error</>;

  return isLoading ? <Grid container spacing={2}>
    {
      Array.from({ length: 10 }).map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Skeleton animation="wave" variant="rectangular" width={'100%'} height={200} />
        </Grid>
      ))
    }
  </Grid> : (
  <>
    <Grid container style={{ flexGrow: 1, width: 'calc(100% - 16.5rem)', overflowY: 'hidden' }}>
      {filteredList.map(
        (promptData) => {
          return (
            <Grid
              item
              key={promptData.id}
              sx={gridStyle}
            >
              <PromptCard data={promptData} />
            </Grid>
          );
        }
      )}
      
      {
        isFetching &&
        <LoadMore>
          <StyledCircleProgress/>
        </LoadMore>
      }
      <RightPanel>
        <Categories tagList={tagList} selectedTags={selectedTags} />
        <TrendingAuthors />
      </RightPanel>
    </Grid>
    <Toast
      open={isMoreError}
      severity={'error'}
      message={buildErrorMessage(error)}
    />
  </>
  );
};

export default PromptList;
