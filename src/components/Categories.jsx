import { useLazyTagListQuery } from '@/api/prompts';
import { filterProps } from '@/common/utils';
import useTags from '@/components/useTags';
import { useProjectId } from '@/pages/EditPrompt/hooks';
import { Chip, Skeleton, Typography } from '@mui/material';
import * as React from 'react';

const TITLE_MARGIN_SIZE = 16;

const TagsContainer = styled('div')(() => ({
  marginBottom: '1em',
  minHeight: '5.5em',
  overflowY: 'scroll', 
  '::-webkit-scrollbar': {
    display: 'none'
  }
}));

const FixedContainer = styled('div')(({theme}) => ({
  marginBottom: `${TITLE_MARGIN_SIZE}px`,
  position: 'fixed',
  zIndex: '1002',
  width: '100%',
  background: theme.palette.background.default,
}));

const Label = styled('div')(({ theme, button }) => {
  const extraStyle = button
    ? {
        caretColor: 'transparent',
        cursor: 'pointer',
      }
    : {};
  return {
    ...extraStyle,
    marginBottom: theme.spacing(1),
  };
});

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

const StyledChip = styled(Chip)(({theme}) => ({
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

const StyledClearLabel = styled(Label)(({theme}) => ({
  color: theme.palette.text.primary,
  fontFamily: 'Montserrat',
  fontSize: '0.75rem',
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '1rem',
  marginBottom: '8px',
  marginTop: '5px',
  '&: hover': {
    color: theme.palette.text.secondary
  },
  '&: active': {
    color: theme.palette.text.primary
  }
}));

const Categories = ({ tagList }) => {
  const projectId = useProjectId();
  const [getTagList, {  isSuccess, isError, isLoading }] = useLazyTagListQuery();
  const {selectedTags, handleClickTag, handleClear} = useTags();

  const showClearButton = React.useMemo(() => {
    return isSuccess && selectedTags.length > 0;
  }, [selectedTags, isSuccess]);

  const [fixedHeight, setFixedHeight] = React.useState(0);
  const fixedRef = React.useRef(null);

  const updateHeight = React.useCallback(() => {
    setFixedHeight(fixedRef.current.offsetHeight + TITLE_MARGIN_SIZE);
  }, []);

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
    if (projectId) {
      getTagList(projectId);
    }
  }, [getTagList, projectId]);

  return (
    <TagsContainer>
      <FixedContainer ref={fixedRef}>
        <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row'  }}>

          <div style={{ marginRight: '1rem' }}>
            <Label>Categories</Label>
          </div>
          {
            showClearButton && 
            <div style={{ marginRight: '0.5rem'}}>
              <StyledClearLabel button={'true'} onClick={handleClear}>Clear all</StyledClearLabel>
            </div>
          }
        </div>
      </FixedContainer>
      {
        isLoading &&
          <SkeletonContainer fixedHeight={fixedHeight}>
            {
              Array.from({ length: 10}).map((_, index) => 
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
            tagList.length > 0 ? (
              tagList.map(({ id, name }) => (
                <StyledChip
                  key={id}
                  label={name}
                  onClick={handleClickTag}
                  variant={selectedTags.includes(name) ? 'outlined' : 'filled'}
                />
              ))
            ) : (
              <Typography variant={'body2'}>None.</Typography>
            )
          }
        </div> 
      }

      {
        isError && <Typography variant={'body2'}>Failed to load.</Typography>
      }
    </TagsContainer>
  );
};

export default Categories;
