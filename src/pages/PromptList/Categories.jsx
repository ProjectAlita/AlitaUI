import { useTagListQuery } from '@/api/prompts';
import { SOURCE_PROJECT_ID } from '@/common/constants';
import { renderStatusComponent } from '@/common/utils';
import StyledLabel from "@/components/StyledLabel";
import { actions as promptSliceActions } from '@/reducers/prompts';
import { Chip, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

const Label = styled(StyledLabel)(({theme}) => ({
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

const Categories = ({tagList}) => {
  const dispatch = useDispatch();
  const [selectedTags, setSelectedTags] = useState([]);
  const {isSuccess, isError, isLoading} = useTagListQuery(SOURCE_PROJECT_ID);
  const handleClick = useCallback(async (e) => {
    const newTag = e.target.innerText;
    const isExistingTag = selectedTags.includes(newTag);
    const tags = isExistingTag ? 
      selectedTags.filter(tag => tag !== newTag) :
      [...selectedTags, newTag];
    setSelectedTags(tags);
    await dispatch(promptSliceActions.filterByTag(tags))
  }, [dispatch, selectedTags]);

  const successContent = (
    tagList.length > 0 ?
    tagList.map(({id, tag}) => (
      <StyledChip key={id} 
        label={tag} 
        onClick={handleClick}
        variant={selectedTags.includes(tag) ? 'outlined': 'filled'}
      /> 
    )) : 
    <Typography variant={'body2'}>None.</Typography>
  );
  
  return (
    <div style={{ maxHeight: '392px', marginBottom: '16px' }}>
      <div>
        <Label>Categories</Label>
      </div>
      {renderStatusComponent({isLoading, isSuccess, isError, successContent})}
    </div>
  );
}

export default Categories;