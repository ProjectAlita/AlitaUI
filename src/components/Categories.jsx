import { useLazyTagListQuery } from '@/api/prompts';
import { MyLibraryTabs } from '@/common/constants';
import { filterProps } from '@/common/utils';
import useTags from '@/components/useTags';
import {
  useAuthorIdFromUrl,
  useFromMyLibrary,
  useIsFromUserPublic,
  useProjectId,
  useStatusesFromUrl,
  useIsFromCollections,
} from '@/pages/hooks';
import { Chip, Skeleton, Typography } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const TITLE_MARGIN_SIZE = 16;

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
  width: '100%',
  background: theme.palette.background.default,
}));

const ClearButton = styled('div')(({ theme }) => ({
  padding: '0 0.5rem 0 0.5rem',
  caretColor: 'transparent',
  cursor: 'pointer',
  marginTop: theme.spacing(0.5),
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
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

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: '0 0.5rem 0.5rem 0',
  padding: '0.5rem 1.25rem',
  borderRadius: '0.625rem',

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
  }
}));

const Categories = ({ tagList, title = 'Categories', style }) => {
  const projectId = useProjectId();
  const { author_id: myAuthorId } = useSelector((state => state.user));
  const { query } = useSelector(state => state.search);
  const authorId = useAuthorIdFromUrl();
  const statuses = useStatusesFromUrl();
  const [getTagList, { isSuccess, isError, isLoading }] = useLazyTagListQuery();
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

  const updateHeight = React.useCallback(() => {
    setFixedHeight(fixedRef.current.offsetHeight + TITLE_MARGIN_SIZE);
  }, []);

  const isOnMyLibrary = useFromMyLibrary();
  const isOnUserPublic = useIsFromUserPublic();
  const isFromCollections = useIsFromCollections();
  const { tab } = useParams();

  React.useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
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
    const tagListParams = { projectId, query: queryForTag };

    if (isOnUserPublic) {
      tagListParams.author_id = authorId;
      tagListParams.statuses = 'published';
    } else if (isOnMyLibrary) {
      tagListParams.author_id = myAuthorId;
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
  }, [
    tab,
    myAuthorId,
    getTagList,
    isOnMyLibrary,
    isOnUserPublic,
    projectId,
    authorId,
    statuses,
    query,
    isFromCollections
  ]);

  return (
    <TagsContainer style={style}>
      <FixedContainer ref={fixedRef}>
        <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>

          <Typography
            component='div'
            variant='labelMedium'
            sx={{ mb: 1, mr: 2 }}
          >
            {title}
          </Typography>
          {
            showClearButton &&
            <ClearButton onClick={handleClear}>
              <Typography variant='bodySmall' component={'div'}>Clear all</Typography>
            </ClearButton>
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
                  variant={selectedTags.includes(name) ? 'outlined' : 'filled'}
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
        isError && <Typography variant={'labelSmall'}>Failed to load.</Typography>
      }
    </TagsContainer>
  );
};

export default Categories;
