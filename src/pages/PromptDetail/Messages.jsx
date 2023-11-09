import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';

import { styled } from '@mui/material/styles';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from 'react-redux';

import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTypography
} from '@/components/BasicAccordion';
import ArrowDownIcon from '@/components/Icons/ArrowDownIcon';
import CopyIcon from '@/components/Icons/CopyIcon';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import MoveIcon from '@/components/Icons/MoveIcon';
import PlusIcon from '@/components/Icons/PlusIcon';

import Alert from '@/components/Alert';
import { PROMPT_PAYLOAD_KEY, ROLES } from '@/pages/PromptDetail/constants.js';
import { actions } from '@/reducers/prompts';

const AddButton = styled(IconButton)(() => (`
  width: 1 rem;
  height: 1 rem;
  margin-left: 0.75rem;
  display: inline-flex;
  padding: 0.375rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.75rem;
  background: rgba(255, 255, 255, 0.10); 
  color: white;
`));

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

const MessageList = styled(List)(() => `
  width: 100%;
  max-height: 21.95rem;
  padding-top: 0px;
  padding-bottom: 0px;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0 !important
  }
`);

const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable direction="vertical" {...props}>{children}</Droppable>;
};

const Message = ({ index, id, role, content, onChangeRole, onDelete, onChangeContent, onCopy }) => {
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

const Messages = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const { messages } = useSelector(state => state.prompts.currentPrompt);

  const onChange = useCallback(
    (event, expanded) => {
      setOpen(expanded);
    },
    [],
  );

  const onAddMessage = useCallback(
    (event) => {
      event.stopPropagation();
      dispatch(actions.updateCurrentPromptData({
        key: 'messages',
        data: [
          ...messages,
          {
            role: ROLES.System,
            content: '',
            id: new Date().getTime() + '',
          }]
      }));
      if (!open) {
        setOpen(true);
      }
    },
    [dispatch, messages, open],
  );

  const onChangeContent = useCallback(
    (index) => (content) => {
      const newMessages = [...messages]
      newMessages.splice(index, 1, { id: messages[index].id, role: messages[index].role, content });
      dispatch(actions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.messages,
        data: newMessages,
      }));
    },
    [dispatch, messages],
  );

  const onChangeRole = useCallback(
    (index) => (role) => {
      const newMessages = [...messages]
      newMessages.splice(index, 1, { id: messages[index].id, content: messages[index].content, role });
      dispatch(actions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.messages,
        data: newMessages,
      }));
    },
    [dispatch, messages],
  );

  const onDelete = useCallback(
    (index) => () => {
      const newMessages = [...messages];
      newMessages.splice(index, 1);
      dispatch(actions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.messages,
        data: newMessages,
      }));
    },
    [dispatch, messages],
  );

  const onCopy = useCallback(
    (content) => async () => {
      if (content) {
        if ("clipboard" in navigator) {
          await navigator.clipboard.writeText(content);
          setShowToast(true);
        } else {
          document.execCommand(content);
          setShowToast(true);
        }
      }
    },
    [],
  );

  const handleDragEnd = useCallback((result) => {
    if (result.destination) {
      const { destination: { index: destinationIndex }, source: { index: sourceIndex } } = result;
      const newMessages = [...messages];
      const removedItems = newMessages.splice(sourceIndex, 1);
      newMessages.splice(destinationIndex, 0, removedItems[0]);
      dispatch(actions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.messages,
        data: newMessages,
      }));
    }
  }, [dispatch, messages]);

  const onCloseToast = useCallback(
    () => {
      setShowToast(false);
    },
    [],
  );


  return (
    <Fragment>
      <StyledAccordion defaultExpanded={true} expanded={open} onChange={onChange}>
        <StyledAccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='messages'
          id='messages'
        >
          <StyledTypography>Messages</StyledTypography>
        </StyledAccordionSummary>
        {!!messages.length &&
          <StyledAccordionDetails>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Box>
                <StrictModeDroppable droppableId="droppable">
                  {(provided) => (
                    <MessageList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {
                        messages.map((message, index) => {
                          return (
                            <Message
                              key={message.id}
                              id={message.id}
                              index={index}
                              onChangeContent={onChangeContent(index)}
                              onChangeRole={onChangeRole(index)}
                              onDelete={onDelete(index)}
                              onCopy={onCopy(message.content)}
                              role={message.role}
                              content={message.content}
                            />
                          )
                        })
                      }
                      {provided.placeholder}
                    </MessageList>
                  )}
                </StrictModeDroppable>
              </Box>
            </DragDropContext>
          </StyledAccordionDetails>}
      </StyledAccordion>
      <AddButton onClick={onAddMessage}>
        <PlusIcon fill='white' />
      </AddButton>
      <Snackbar open={showToast} autoHideDuration={6000} onClose={onCloseToast}>
        <Alert onClose={onCloseToast} severity="success" sx={{ width: '100%' }}>
          The message is copied to the clipboard!
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default Messages;