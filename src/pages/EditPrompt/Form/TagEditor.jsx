import { Autocomplete, Chip } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { StyledInput } from '../Common';
import styled from "@emotion/styled";

export const StyledAutocomplete = styled(Autocomplete)(() => ({
  '& .MuiAutocomplete-tag' : {
    margin: 0, 
  }
}));

export const StyledChip = styled(Chip)(({theme}) => ({
  height: '24px',
  color: theme.palette.text.secondary,
  marginBottom: '8px !important',
}));


export default function TagEditor({tagList, stateTags, onChangeTags, disabled, ...props}) {
  const [tags, setTags] = useState(stateTags.map((item) => item.name));
  const [inputValue, setInputValue] = useState('');

  const setNewTags = useCallback(
    (newTags) => {
      const uniqueTags = Array.from(
        new Set(newTags.map((tag) => tag.trim().toLowerCase()))
      );
      setTags(uniqueTags);
      if (onChangeTags) {
        onChangeTags(uniqueTags.map((tag) => ({ name: tag, data: { color: 'red' } })));
      }
    },
    [onChangeTags]
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
      placeholder={disabled ? '' : 'Type a tag and press comma/enter'}
      value={inputValue}
      onChange={handleInputChange}
      onBlur={onBlur}
      sx={{
        '& .MuiInputLabel-shrink': {
          top: '4px',
        },
      }}
      {...props} />
  ), [disabled, handleInputChange, inputValue, onBlur, props])

  const onChangeMulti = useCallback((event, newValue) => {
    setNewTags(newValue);
    setInputValue('');
  }, [setNewTags]);

  return (
      <StyledAutocomplete
        multiple
        id="tags-filled"
        options={tagList?.rows?.map(({name}) => name) || []}
        freeSolo
        value={tags}
        defaultValue={[]}
        disabled={disabled}
        inputValue={inputValue}
        onChange={onChangeMulti}
        onInput={handleInputChange}
        renderTags={renderTags}
        renderInput={renderInput}
      />
  );
}
