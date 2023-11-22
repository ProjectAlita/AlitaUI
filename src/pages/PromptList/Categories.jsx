import { useTagListQuery } from '@/api/prompts';
import { SOURCE_PROJECT_ID } from '@/common/constants';
import { renderStatusComponent } from '@/common/utils';
import StyledLabel from "@/components/StyledLabel";
import { Chip, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Label = styled(StyledLabel)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}));

const StyledChip = styled(Chip)(() => ({
  margin: '0 0.5rem 0.5rem 0',
  padding: '0.5rem 1.25rem',
  borderRadius: '0.625rem',

  '& MuiChip-outlined': {
    border: '1px solid rgba(255, 255, 255, 0.40)',
    backdropFilter: 'blur(0.375rem)',
  },
  '& label': {
    fontSize: '0.74rem',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '1rem',
    opacity: '0.8',
  }
}));

const Categories = ({ tagList, selectedTags }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuccess, isError, isLoading } = useTagListQuery(SOURCE_PROJECT_ID);
  const handleClick = useCallback((newTagId) => {
    if (isNaN(newTagId)) return;

    const isExistingTag = selectedTags.includes(newTagId);
    const tags = isExistingTag ?
      selectedTags.filter(tag => tag !== newTagId) :
      [...selectedTags, newTagId];

    const currentQueryParam = location.search ? new URLSearchParams(location.search) : new URLSearchParams();
    if (tags.length > 0) {
      currentQueryParam.set("tags", tags.join(","));
    } else {
      currentQueryParam.delete("tags");
    }

    navigate({
      pathname: location.pathname,
      search: currentQueryParam.toString()
    }, { replace: true });
  }, [location.pathname, location.search, navigate, selectedTags]);

  const successContent = (
    tagList.length > 0 ?
      tagList.map(({ id, name }) => (
        <StyledChip key={id}
          label={name}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => handleClick(id)}
          variant={selectedTags.includes(id) ? 'outlined' : 'filled'}
        />
      )) :
      <Typography variant={'body2'}>None.</Typography>
  );

  return (
    <div style={{ maxHeight: '392px', marginBottom: '16px' }}>
      <div>
        <Label>Categories</Label>
      </div>
      {renderStatusComponent({ isLoading, isSuccess, isError, successContent })}
    </div>
  );
}

export default Categories;