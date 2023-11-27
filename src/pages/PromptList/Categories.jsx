import { useTagListQuery } from '@/api/prompts';
import { SOURCE_PROJECT_ID, URL_PARAMS_KEY_TAGS } from '@/common/constants';
import { renderStatusComponent } from '@/common/utils';
import StyledLabel from '@/components/StyledLabel';
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

const Categories = ({ tagList, selectedTags }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuccess, isError, isLoading } = useTagListQuery(SOURCE_PROJECT_ID);
  const [tagLimit, setTagLimit] = React.useState(10);

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
  }, [location.pathname, navigate])

  const loadMoreTags = React.useCallback(() => {
    setTagLimit(tagLimit + 10);
  }, [tagLimit]);

  const successContent =
    tagList.length > 0 ? (
      tagList.slice(0, tagLimit).map(({ id, name }) => (
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
    <div style={{ marginBottom: '1em'}}>
      <div style={{ marginBottom: '1em'}}>
        <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row'  }}>

          <div style={{ marginLeft: '2rem' }}>
            <Label>Categories</Label>
          </div>
          {
            selectedTags.length > 0 && 
            <div style={{ marginLeft: '0.5rem' }}>
              <Label button={'true'} onClick={handleClear}>Clear</Label>
            </div>
          }
          {
            tagLimit < tagList.length && 
            <div style={{ marginLeft: '0.5rem' }}>
              <Label button={'true'} onClick={loadMoreTags}>Load More</Label>
            </div>
          }
        </div>
      </div>
      {renderStatusComponent({ isLoading, isSuccess, isError, successContent })}
    </div>
  );
};

export default Categories;
