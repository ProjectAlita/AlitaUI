import { useTagListQuery } from '@/api/prompts';
import { renderStatusComponent } from '@/common/utils';
import StyledLabel from "@/components/StyledLabel";
import { actions as promptSliceActions } from '@/reducers/prompts';
import { Chip, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

const Label = styled(StyledLabel)(({theme}) => ({
  marginBottom: theme.spacing(3)
}));

const SOURCE_PROJECT_ID = 9;
const Categories = ({tagList}) => {
  const dispatch = useDispatch();
  const [selectedTags, setSelectedTags] = useState([]);
  const {isSuccess, isError, isLoading} = useTagListQuery(SOURCE_PROJECT_ID);
  const handleClick = useCallback(async (e) => {
    const newTag = e.target.innerText;
    if (selectedTags.includes(newTag)) {
      setSelectedTags(selectedTags.filter(tag => tag !== newTag));
      await dispatch(promptSliceActions.filterByTag(selectedTags))
      return;
    }
    const tags = [...selectedTags, newTag];
    setSelectedTags(tags);
    await dispatch(promptSliceActions.filterByTag(tags))
  }, [dispatch, selectedTags]);

  const successContent = (
    tagList.length > 0 ?
    tagList.map(({id, tag}) => (
      <Chip key={id} 
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