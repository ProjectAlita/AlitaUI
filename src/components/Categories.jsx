import { useLazyTagListQuery } from '@/api/prompts';
import { MyLibraryTabs } from '@/common/constants';
import { filterProps, debounce } from '@/common/utils';
import ClearIcon from '@/components/Icons/ClearIcon';
import useTags from '@/components/useTags';
import Tooltip from '@/components/Tooltip';
import {
  useAuthorIdFromUrl,
  useFromMyLibrary,
  useIsFromUserPublic,
  useProjectId,
  useStatusesFromUrl,
  useIsFromCollections,
  useFromPrompts,
} from '@/pages/hooks';
import { Chip, Skeleton, Typography } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const TITLE_MARGIN_SIZE = 16;

const StyledClearIcon = styled(ClearIcon)(({theme}) => ({
  margin: '0',
  height: '1.76rem',
  width: '1.76rem',
  background: theme.palette.background.button.default,
  borderRadius: '50%',
  display: 'flex',
  padding: '0.375rem',
  alignItems: 'center',
  gap: '0.25rem',
  '& span': {
    width: '16px',
    height: '16px'
  }
}))

const TagsContainer = styled('div')(() => ({
  marginBottom: '24px',
  minHeight: '5.5em',
  overflowY: 'scroll',
  '::-webkit-scrollbar': {
    display: 'none'
  }
}));

const FixedContainer = styled('div')(({ theme }) => ({
  marginBottom: `${TITLE_MARGIN_SIZE}px`,
  position: 'fixed',
  zIndex: '1002',
  width: '312px',
  background: theme.palette.background.default,
}));

const ClearButton = styled('div')(({ theme }) => ({
  padding: '0 0.5rem 0 0.5rem',
  caretColor: 'transparent',
  cursor: 'pointer',
  '&: hover': {
    color: theme.palette.text.secondary
  },
  '&: active': {
    color: theme.palette.text.primary
  }
}));

const SkeletonContainer = styled(
  'div',
)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  marginTop: `46px`
}));

const ChipSkeleton = styled(Skeleton, filterProps([]))(() => ({
  margin: '0 0.5rem 0.5rem 0',
  padding: '0.5rem 1.25rem',
  borderRadius: '0.625rem',
  width: '100px',
  height: '32px'
}));

const StyledChip = styled(Chip)(({ theme, isSelected }) => ({
  margin: '0 0.5rem 0.5rem 0',
  padding: '0.5rem 1.25rem',
  borderRadius: '0.625rem',
  background: isSelected? theme.palette.background.categoriesButton.selected.active: '',

  '&.MuiChip-outlined': {
    border: `1px solid ${theme.palette.border.category.selected}`,
    backdropFilter: 'blur(0.375rem)',
  },
  '& label': {
    fontSize: '0.74rem',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '1rem',
    opacity: '0.8',
  },
  '& span': {
    padding: 0
  },
  '&:hover': {
    background: isSelected? theme.palette.background.categoriesButton.selected.hover: '',
  }
}));

const Categories = ({ tagList, title = 'Categories', style }) => {
  const projectId = useProjectId();
  const [page, setPage] = React.useState(0);
  const { author_id: myAuthorId } = useSelector((state => state.user));
  const { totalTags } = useSelector((state => state.prompts));
  const { query } = useSelector(state => state.search);
  const authorId = useAuthorIdFromUrl();
  const statuses = useStatusesFromUrl();
  const [getTagList, { isSuccess, isError, isLoading, isFetching }] = useLazyTagListQuery();
  const { selectedTags, handleClickTag, handleClear } = useTags(tagList);
  const sortedTagList = React.useMemo(() => {
    const selected = selectedTags.map(tag => tagList.find(item => item.name === tag))
    .filter(tag => tag);
    const unselected = tagList.filter(tag => !selectedTags.includes(tag.name));
    return [...selected, ...unselected];
  }, [selectedTags, tagList]);

  const showClearButton = React.useMemo(() => {
    return isSuccess && selectedTags.length > 0;
  }, [selectedTags, isSuccess]);
  
  const [fixedHeight, setFixedHeight] = React.useState(0);
  const fixedRef = React.useRef(null);
  const tagsContainerRef = React.useRef(null);

  const updateHeight = React.useCallback(() => {
    setFixedHeight(fixedRef.current.offsetHeight + TITLE_MARGIN_SIZE);
  }, []);

  const onScroll = debounce(() => {
    const tagsContainerDom = tagsContainerRef.current;
    const clientHeight = tagsContainerDom.clientHeight;
    const scrollHeight = tagsContainerDom.scrollHeight;
    const scrollTop = tagsContainerDom.scrollTop;

    const isReachBottom = scrollTop + clientHeight > scrollHeight - 10
    if(isReachBottom){
      const existsMore = tagList.length < totalTags;
      if (!existsMore || isFetching) return;
      setPage(page + 1);
    }
  }, 300)

  React.useEffect(() => {
    const tagsContainerDom = tagsContainerRef.current;
    tagsContainerDom.addEventListener('scroll', onScroll);

    return () => {
      tagsContainerDom.removeEventListener('scroll', onScroll);
    };
  }, [onScroll, tagsContainerRef]);

  const isOnPrompts = useFromPrompts();
  const isOnMyLibrary = useFromMyLibrary();
  const isOnUserPublic = useIsFromUserPublic();
  const isFromCollections = useIsFromCollections();
  const { tab } = useParams();

  React.useEffect(() => {
    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [updateHeight]);

  React.useEffect(() => {
    updateHeight();
  }, [showClearButton, updateHeight]);

  React.useEffect(() => {
    if (!projectId) {
      return;
    }
    const queryForTag = query || undefined;
    const tagListParams = { projectId, query: queryForTag, page };

    if (isOnUserPublic) {
      tagListParams.author_id = authorId;
      tagListParams.statuses = 'published';
    }else if (isOnPrompts) {
      tagListParams.statuses = 'published';
    }else if (isOnMyLibrary) {
      tagListParams.authorId = myAuthorId;
      if (statuses) {
        tagListParams.statuses = statuses;
      }
      if (tab === MyLibraryTabs[0]) {
        //All
        tagListParams.collection_phrase = queryForTag;
      } else if (tab === MyLibraryTabs[3]) {
        //Collections
        tagListParams.collection_phrase = queryForTag;
        tagListParams.query = undefined;
      }
    } else {
      if (isFromCollections) {
        tagListParams.collection_phrase = queryForTag;
        tagListParams.query = undefined;
      }
      tagListParams.statuses = 'published';
    }
    getTagList(tagListParams);
  }, [tab, myAuthorId, getTagList, isOnMyLibrary, isOnUserPublic, projectId, authorId, statuses, query, isFromCollections, page, isOnPrompts]);

  return (
    <TagsContainer style={style} ref={tagsContainerRef}>
      <FixedContainer ref={fixedRef}>
        <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }}>

          <Typography
            component='div'
            variant='labelMedium'
            sx={{ mb: 1, mr: 2 }}
          >
            {title}
          </Typography>
          {
            showClearButton &&
            <Tooltip title='Clear all' placement="top">
              <ClearButton onClick={handleClear}>
                  <StyledClearIcon/>
              </ClearButton>
            </Tooltip>
          }
        </div>
      </FixedContainer>
      {
        isLoading &&
        <SkeletonContainer fixedHeight={fixedHeight}>
          {
            Array.from({ length: 10 }).map((_, index) =>
              <ChipSkeleton
                variant='waved'
                key={index}
              />
            )
          }
        </SkeletonContainer>
      }

      {
        isSuccess && <div style={{ marginTop: fixedHeight }}>
          {
            sortedTagList.length > 0 ? (
              sortedTagList.map(({ id, name }) => (
                <StyledChip
                  key={id}
                  label={name}
                  onClick={handleClickTag}
                  isSelected={selectedTags.includes(name)}
                />
              ))
            ) : (
              <Typography component='div' variant={'labelSmall'} sx={{ mt: -1 }}>
                No categories to display.
              </Typography>
            )
          }
        </div>
      }

      {
        isSuccess && sortedTagList.length > 0 && isFetching && page > 0 && <div style={{textAlign: 'center'}}>
          ...
        </div>
      }

      {
        isError && <Typography variant={'labelSmall'}>Failed to load.</Typography>
      }
    </TagsContainer>
  );
};

export default Categories;
