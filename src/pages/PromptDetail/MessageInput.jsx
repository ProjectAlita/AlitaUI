import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import { Draggable } from "react-beautiful-dnd";

import ArrowDownIcon from '@/components/Icons/ArrowDownIcon';
import CopyIcon from '@/components/Icons/CopyIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import MoveIcon from '@/components/Icons/MoveIcon';

import { ROLES } from '@/pages/PromptDetail/constants.js';

const MessageContainer = styled(ListItem)(() => `
  display: flex;
  height: 9.9125rem;
  padding: 0.625rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.325rem;
  align-self: stretch;

  border-radius: 0.5rem;
  border: 1px solid #3B3E46;

  :not(:last-child) {
    margin-bottom: 1rem;
  }
`);

const MessageToolbar = styled(Box)(() => `
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`);

const StyledSelect = styled(Select)(() => `
  display: flex;
  height: 1.88rem;
  padding: 0.25rem 0rem;
  align-items: center;
  gap: 0.625rem;
  & .MuiOutlinedInput-notchedOutline {
    border-width: 0px;
  }
  & .Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 0px solid white
  }
  & .MuiOutlinedInput-input {
    padding: 0.25rem 0 0.5rem
  }
  & .MuiSelect-icon {
    right: 0px;
  }
  fieldset{
    border: none !important;
    outline: none !important;
  };
`)

const StyledArrowDownIcon = styled(ArrowDownIcon)(() => `
  fill: white;
`)

const ButtonsContainer = styled(Box)(() => `
display: flex;
align-items: flex-start;
gap: 0.5rem;
`);

const StyledTextField = styled(TextField)(() => `
  flex: 1 0 0;
  color: #FFF;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
`);

const MessageInput = ({ index, id, role, content, onChangeRole, onDelete, onChangeContent, onCopy }) => {
  const onSelectRole = useCallback((event) => {
    onChangeRole(event.target.value);
  }, [onChangeRole]);

  const onClickDelete = useCallback(
    () => {
      onDelete();
    },
    [onDelete],
  );

  const onChangeInput = useCallback(
    (event) => {
      onChangeContent(event.target.value)
    },
    [onChangeContent],
  );

  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided) => (
        <MessageContainer
          ref={provided.innerRef}
          {...provided.draggableProps}

        >
          <MessageToolbar>
            <StyledSelect
              value={role}
              onChange={onSelectRole}
              displayEmpty
              IconComponent={StyledArrowDownIcon}
            >
              <MenuItem value={ROLES.Assistant}>Assistant</MenuItem>
              <MenuItem value={ROLES.System}>System</MenuItem>
              <MenuItem value={ROLES.User}>User</MenuItem>
            </StyledSelect>
            <ButtonsContainer>
              <IconButton onClick={onClickDelete}>
                <DeleteIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
              <IconButton disabled={!content} onClick={onCopy}>
                <CopyIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
              <IconButton {...provided.dragHandleProps} >
                <MoveIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
            </ButtonsContainer>
          </MessageToolbar>
          <StyledTextField
            autoFocus
            fullWidth
            id="standard-multiline-static"
            label=""
            value={content}
            multiline
            rows={4}
            onChange={onChangeInput}
            variant="standard"
            placeholder="Input message here"
            InputProps={{ disableUnderline: true }}
          />
        </MessageContainer>
      )}
    </Draggable>
  )
}

export default MessageInput;