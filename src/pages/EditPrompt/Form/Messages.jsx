import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTypography,
  StyledExpandMoreIcon
} from '@/components/BasicAccordion';
import PlusIcon from '@/components/Icons/PlusIcon';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from 'react-redux';

import { PROMPT_PAYLOAD_KEY, ROLES, VariableSources } from '@/common/constants.js';
import AlertDialog from '@/components/AlertDialog';
import Toast from '@/components/Toast';
import { actions } from '@/slices/prompts';
import { useTheme } from '@emotion/react';
import MessageInput from './MessageInput';
import { useUpdateVariableList } from '../../hooks';
import { getFileFormat } from '@/common/utils';
import YAML from 'js-yaml';

const AddButton = styled(IconButton)(({ theme }) => (`
  width: 2rem;
  height: 2rem;
  margin-top: 1rem;
  margin-left: 0.75rem;
  margin-bottom: 0.62rem;
  display: inline-flex;
  padding: 0.375rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.75rem;
  background: ${theme.palette.background.icon.default}; 
  color: white;
`));

const MessageList = styled(List)(() => `
  width: 100%;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0.5rem;
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
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorMessageToast, setOpenErrorMessageToast] = useState(false);
  const [messageIndexToDelete, setMessageIndexToDelete] = useState(-1);
  const [updateVariableList] = useUpdateVariableList(VariableSources.Message)
  const { messages = [] } = useSelector(state => state.prompts.currentPrompt);

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
      const allMessageContent =  newMessages.reduce((accumulator, item) => {
        return accumulator + item.content;
      }, '');
      updateVariableList(allMessageContent);
      dispatch(actions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.messages,
        data: newMessages,
      }));
    },
    [dispatch, messages, updateVariableList],
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
      setMessageIndexToDelete(index);
      setOpenAlert(true);
    },
    [],
  );

  const onCopy = useCallback(
    (message, index) => async () => {
      const newMessages = [...messages];
      newMessages.splice(index, 0, { ...message, id: new Date().getTime() + '', });
      dispatch(actions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.messages,
        data: newMessages,
      }));
      setShowToast(true);
    },
    [dispatch, messages],
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

  const onCloseAlert = useCallback(
    () => {
      setOpenAlert(false);
      setMessageIndexToDelete(-1);
    },
    [],
  );

  const onConfirmDelete = useCallback(
    () => {
      const newMessages = [...messages];
      newMessages.splice(messageIndexToDelete, 1);
      dispatch(actions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.messages,
        data: newMessages,
      }));
      onCloseAlert();
    },
    [dispatch, messageIndexToDelete, messages, onCloseAlert],
  );

  const onDrop = useCallback((index) => (event) => {
    event.preventDefault();
    setOpenErrorMessageToast(false);
    const file = event.dataTransfer.files[0];
    const fileName = file?.name;
    const reader = new FileReader();
    if (file) {
      reader.readAsText(file);
    }
    reader.onload = () => {
      try {
        let fileData = null;
        const fileFormat = getFileFormat(fileName);
        const dataString = reader.result;
        if (fileFormat === 'yaml') {
          const yamlData = YAML.load(dataString);
          fileData = { context: JSON.stringify(yamlData) };
        }else {
          fileData = { context: dataString };
        }
        const { context } = fileData;
        onChangeContent(index)(context)
      } catch (error) {
        setOpenErrorMessageToast(true);
        setErrorMessage('Error parsing File: Unsupported format');
      }
    };
  }, [onChangeContent]);

  return (
    <Fragment>
      <StyledAccordion defaultExpanded={true} expanded={open} onChange={onChange}>
        <StyledAccordionSummary
          expandIcon={<StyledExpandMoreIcon />}
          aria-controls='messages'
          id='messages'
        >
          <StyledTypography>Messages</StyledTypography>
        </StyledAccordionSummary>
        {!!messages?.length &&
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
                              onCopy={onCopy(message, index)}
                              onDrop={onDrop(index)}
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
        <PlusIcon fill={theme.palette.icon.fill.secondary} />
      </AddButton>
      <Toast
        open={showToast}
        severity="success"
        message='The message has been inserted!'
        onClose={onCloseToast} 
      />
      <Toast
        open={openErrorMessageToast}
        severity={'error'}
        message={errorMessage}
      />
      <AlertDialog
        title='Warning'
        alertContent="The deleted message can't be restored. Are you sure to delete the message?"
        open={openAlert}
        onClose={onCloseAlert}
        onCancel={onCloseAlert}
        onConfirm={onConfirmDelete}
      />
    </Fragment>
  );
}

export default Messages;