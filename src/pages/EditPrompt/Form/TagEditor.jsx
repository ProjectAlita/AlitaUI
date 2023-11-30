import { useTagListQuery } from '@/api/prompts';
import { PROMPT_PAYLOAD_KEY, SOURCE_PROJECT_ID } from '@/common/constants';
import { actions as promptSliceActions } from '@/slices/prompts';
import { Autocomplete, Chip } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyledInput } from '../Common';

export default function TagEditor(props) {
  const dispatch = useDispatch();
  const { data: tagList = [] } = useTagListQuery(SOURCE_PROJECT_ID);
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
      <Chip 
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
      <Autocomplete
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
