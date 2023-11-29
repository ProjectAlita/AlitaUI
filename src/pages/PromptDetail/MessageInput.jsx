import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

import { styled } from '@mui/material/styles';
import { useCallback } from 'react';
import { Draggable } from "react-beautiful-dnd";

import CopyIcon from '@/components/Icons/CopyIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import MoveIcon from '@/components/Icons/MoveIcon';
import SingleSelect from '@/components/SingleSelect';

import { RoleOptions } from '@/common/constants.js';

const MessageContainer = styled(ListItem)(({ theme }) => `
  display: flex;
  height: 9.9125rem;
  padding: 0.625rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.325rem;
  align-self: stretch;

  border-radius: 0.5rem;
  border: 1px solid ${theme.palette.border.lines};

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

const ButtonsContainer = styled(Box)(() => `
display: flex;
align-items: flex-start;
gap: 0.5rem;
`);

const StyledTextField = styled(TextField)(({ theme }) => `
  flex: 1 0 0;
  color: ${theme.palette.text.secondary};

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
`);

const StyledIconButton = styled(IconButton)(() => `
  &:hover {
    cursor: grab;
  }
`);

const MessageInput = ({ index, id, role, content, onChangeRole, onDelete, onChangeContent, onCopy }) => {
  const onSelectRole = useCallback((value) => {
    onChangeRole(value);
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
    <Draggable key={id} draggableId={id + ''} index={index}>
      {(provided) => (
        <MessageContainer
          ref={provided.innerRef}
          {...provided.draggableProps}

        >
          <MessageToolbar>
            <Box>
              <SingleSelect
                onValueChange={onSelectRole}
                value={role}
                displayEmpty
                options={RoleOptions}
              />
            </Box>
            <ButtonsContainer>
              <IconButton onClick={onClickDelete}>
                <DeleteIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
              <IconButton disabled={!content} onClick={onCopy}>
                <CopyIcon sx={{ fontSize: '1.13rem' }} />
              </IconButton>
              <StyledIconButton {...provided.dragHandleProps} >
                <MoveIcon sx={{ fontSize: '1.13rem' }} />
              </StyledIconButton>
            </ButtonsContainer>
          </MessageToolbar>
          <StyledTextField
            autoFocus
            fullWidth
            id={'standard-multiline-static' + id}
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