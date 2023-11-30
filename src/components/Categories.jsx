import { useLazyTagListQuery } from '@/api/prompts';
import { URL_PARAMS_KEY_TAGS } from '@/common/constants';
import { renderStatusComponent } from '@/common/utils';
import StyledLabel from '@/components/StyledLabel';
import { useProjectId } from '@/pages/EditPrompt/hooks';
import { Chip, Typography } from '@mui/material';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Label = styled(StyledLabel)(({ theme, button }) => {
  const extraStyle = button
    ? {
        border: '1px solid',
        borderRadius: '8px',
        padding: '0 0.5rem 0 0.5rem',
        caretColor: 'transparent',
        cursor: 'pointer',
      }
    : {};
  return {
    ...extraStyle,
    marginBottom: theme.spacing(1),
  };
});

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
}));

const TagsContainer = styled('div')(() => ({
  marginBottom: '1em', 
  minHeight: '5.5em',
  overflowY: 'scroll', 
  '::-webkit-scrollbar': {
    display: 'none'
  }
}));

const Categories = ({ tagList, selectedTags }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = useProjectId();
  const [getTagList, { isSuccess, isError, isLoading }] = useLazyTagListQuery();

  const handleClick = React.useCallback(
    (e) => {
      const newTag = e.target.innerText;
      const isExistingTag = selectedTags.includes(newTag);
      const tags = isExistingTag
        ? selectedTags.filter((tag) => tag !== newTag)
        : [...selectedTags, newTag];

      const currentQueryParam = location.search
        ? new URLSearchParams(location.search)
        : new URLSearchParams();

      currentQueryParam.delete(URL_PARAMS_KEY_TAGS);
      if (tags.length > 0) {
        for(const tag of tags) {
          currentQueryParam.append(URL_PARAMS_KEY_TAGS, tag);
        }
      }

      navigate(
        {
          pathname: location.pathname,
          search: decodeURIComponent(currentQueryParam.toString()),
        },
        { replace: true }
      );
    },
    [location.pathname, location.search, navigate, selectedTags]
  );

  const handleClear = React.useCallback(() => {
    navigate(
      {
        pathname: location.pathname
      },
      { replace: true }
    );
  }, [location.pathname, navigate]);

  React.useEffect(() => {
    if (projectId) {
      getTagList(projectId);
    }
  }, [getTagList, projectId]);
  

  const successContent =
    tagList.length > 0 ? (
      tagList.map(({ id, name }) => (
        <StyledChip
          key={id}
          label={name}
          onClick={handleClick}
          variant={selectedTags.includes(name) ? 'outlined' : 'filled'}
        />
      ))
    ) : (
      <Typography variant={'body2'}>None.</Typography>
    );

  return (
    <TagsContainer>
      <div style={{ marginBottom: '1em'}}>
        <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row'  }}>

          <div style={{ marginRight: '2rem' }}>
            <Label>Categories</Label>
          </div>
          {
            selectedTags?.length > 0 && 
            <div style={{ marginRight: '0.5rem' }}>
              <Label button={'true'} onClick={handleClear}>Clear</Label>
            </div>
          }
        </div>
      </div>
      {renderStatusComponent({ isLoading, isSuccess, isError, successContent })}
    </TagsContainer>
  );
};

export default Categories;
