import { PROMPT_PAYLOAD_KEY } from '@/common/constants';
import { actions as promptSliceActions } from '@/reducers/prompts';
import { Chip, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyledInput } from './Common';

export default function TagEditor(props) {
  const dispatch = useDispatch();
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

  const handleKeyUp = useCallback(
    (event) => {
      const value = event?.target?.value;
      const { code } = event;
      if (code === 'Enter') {
        addNewTag(value);
      }
    },
    [addNewTag]
  );

  useEffect(() => {
    setTags(stateTags.map((item) => item.name));
  }, [stateTags]);

  return (
    <>
      <StyledInput
        fullWidth
        variant='standard'
        onBlur={onBlur}
        value={inputValue}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        placeholder='Type a tag and press comma'
        {...props}
      />
      <Stack direction='row' flexWrap='wrap' spacing={1}>
        {tags.map((tag, index) => (
          <Chip
            key={`${tag}-${index}`}
            label={tag}
            // eslint-disable-next-line react/jsx-no-bind
            onDelete={() => handleDelete(tag)}
          />
        ))}
      </Stack>
    </>
  );
}
