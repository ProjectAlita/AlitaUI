import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTypography
} from '@/components/BasicAccordion';
import PlusIcon from '@/components/Icons/PlusIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from 'react-redux';

import { PROMPT_PAYLOAD_KEY, ROLES, TOAST_DURATION } from '@/common/constants.js';
import Alert from '@/components/Alert';
import { actions } from '@/reducers/prompts';
import MessageInput from './MessageInput';

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
                            <MessageInput
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
      <Snackbar open={showToast} autoHideDuration={TOAST_DURATION} onClose={onCloseToast}>
        <Alert onClose={onCloseToast} severity="success" sx={{ width: '100%' }}>
          The message is copied to the clipboard!
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default Messages;