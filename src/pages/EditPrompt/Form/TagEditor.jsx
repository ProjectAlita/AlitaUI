import { useTagListQuery } from '@/api/prompts';
import { PROMPT_PAYLOAD_KEY } from '@/common/constants';
import { actions as promptSliceActions } from '@/slices/prompts';
import { Autocomplete, Chip } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyledInput } from '../Common';
import { useProjectId } from '@/pages/hooks';
import styled from "@emotion/styled";

export const StyledAutocomplete = styled(Autocomplete)(() => ({
  '& .MuiAutocomplete-tag' : {
    margin: 0, 
  }
}));

export const StyledChip = styled(Chip)(({theme}) => ({
  height: '24px',
  color: theme.palette.text.secondary,
  marginBottom: '4px !important',
}));


export default function TagEditor(props) {
  const dispatch = useDispatch();
  const projectId = useProjectId();
  const { data: tagList = [] } = useTagListQuery({projectId}, {skip: !projectId});
  const { currentPrompt } = useSelector((state) => state.prompts);
  const { tags: stateTags } = currentPrompt;
  const [tags, setTags] = useState(stateTags.map((item) => item.name));
  const [inputValue, setInputValue] = useState('');

  const setNewTags = useCallback(
    (newTags) => {
      const uniqueTags = Array.from(
        new Set(newTags.map((tag) => tag.trim().toLowerCase()))
      );
      setTags(uniqueTags);
      dispatch(
        promptSliceActions.updateCurrentPromptData({
          key: PROMPT_PAYLOAD_KEY.tags,
          data: uniqueTags.map((tag) => ({ name: tag, data: { color: 'red' } })),
        })
      );
    },
    [dispatch]
  );

  const addNewTag = useCallback(
    (value) => {
      const newTag = value.trim();
      if (newTag) {
        setNewTags([...tags, newTag]);
      }
      setInputValue('');
    },
    [setNewTags, tags]
  );

  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;
      if (value.indexOf(',') >= 0) {
        const newTags = value.split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
        setNewTags([...tags, ...newTags]);
        setInputValue('');
        event.target.value = '';
        return
      }
      setInputValue(value);
    },
    [setNewTags, tags]
  );

  const handleDelete = useCallback(
    (tagToDelete) => {
      setNewTags(tags.filter((tag) => tag !== tagToDelete));
    },
    [tags, setNewTags]
  );

  const onBlur = useCallback(
    (event) => {
      const value = event.target.value;
      if (value && value.length > 0) {
        addNewTag(value);
      }
    },
    [addNewTag]
  );

  useEffect(() => {
    setTags(stateTags.map((item) => item.name));
  }, [stateTags]);

  const renderTags = useCallback((value, getTagProps) =>
    value.map((option, index) => (
      <StyledChip 
        label={option} 
        key={index} 
        {...getTagProps({ index })} 
        // eslint-disable-next-line react/jsx-no-bind
        onDelete={() => handleDelete(option)} 
      />
    )
  ), [handleDelete]);
  const renderInput = useCallback((params) => (
    <StyledInput 
      {...params}
      fullWidth
      variant='standard' 
      label="Tags" 
      placeholder='Type a tag and press comma/enter'
      value={inputValue}
      onChange={handleInputChange}
      onBlur={onBlur}
      {...props} />
  ), [handleInputChange, inputValue, onBlur, props])

  const onChangeMulti = useCallback((event, newValue) => {
    setNewTags(newValue);
  }, [setNewTags]);

  return (
    <>
      <StyledAutocomplete
        multiple
        id="tags-filled"
        options={tagList?.map(({name}) => name)}
        freeSolo
        value={tags}
        onChange={onChangeMulti}
        onInput={handleInputChange}
        renderTags={renderTags}
        renderInput={renderInput}
      />
    </>
  );
}
