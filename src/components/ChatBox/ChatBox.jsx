import { useAskAlitaMutation } from '@/api/prompts';
import { ChatBoxMode, DEFAULT_MAX_TOKENS, DEFAULT_TOP_P, PROMPT_PAYLOAD_KEY, ROLES } from '@/common/constants';
import { actions } from '@/slices/prompts';
import { Box, Typography } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import { MuiMarkdown } from 'mui-markdown';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertDialog from '../AlertDialog';
import ClearIcon from '../Icons/ClearIcon';
import SendIcon from '../Icons/SendIcon';
import CopyIcon from '@/components/Icons/CopyIcon';
import Toast from '../Toast';
import AIAnswer from './AIAnswer';
import {
  ActionButton,
  ActionContainer,
  ChatBodyContainer,
  ChatBoxContainer,
  ChatInputContainer,
  CompletionContainer,
  Message,
  MessageList,
  RunButton,
  SendButton,
  SendButtonContainer,
  StyledButton,
  StyledCircleProgress,
  StyledTextField
} from './StyledComponents';
import UserMessage from './UserMessage';
import { useCtrlEnterKeyEventsHandler } from './hooks';
import { useProjectId } from '@/pages/hooks';
import { buildErrorMessage } from '../../common/utils';
import { StyledUnfoldLessIcon, StyledUnfoldMoreIcon } from '@/pages/EditPrompt/Common';
import styled from '@emotion/styled';

const CompletionHeader = styled('div')(() => ({
  display: 'block',
  textAlign: 'end'
}));

const MAX_ROWS = 15;
const MIN_ROWS = 3;
const MIN_HEIGHT = 70;

const ChatBox = ({
  prompt_id,
  integration_uid,
  model_name,
  temperature,
  context,
  messages,
  max_tokens = DEFAULT_MAX_TOKENS,
  top_p = DEFAULT_TOP_P,
  top_k,
  variables,
  type,
}) => {
  const dispatch = useDispatch();
  const [askAlita, { isLoading, data, error, reset }] = useAskAlitaMutation();
  const { name } = useSelector(state => state.user)
  const [mode, setMode] = useState(type);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [completionResult, setCompletionResult] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('info')
  const [openAlert, setOpenAlert] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [answerIdToRegenerate, setAnswerIdToRegenerate] = useState('');
  const [inputContent, setInputContent] = useState('');
  const projectId = useProjectId();
  const [showExpandIcon, setShowExpandIcon] = useState(false);
  const [rows, setRows] = useState(MAX_ROWS);
  const onClickExpander = useCallback(
    () => {
      setRows((prevRows) => prevRows === MAX_ROWS ? MIN_ROWS : MAX_ROWS);
    },
    [],
  );

  const onSelectChatMode = useCallback(
    (chatMode) => () => {
      if (mode !== chatMode) {
        setMode(chatMode);
        if (chatMode === ChatBoxMode.Completion) {
          setQuestion('');
        }
        dispatch(actions.updateCurrentPromptData({
          key: PROMPT_PAYLOAD_KEY.type,
          data: chatMode
        }));
      }
    },
    [dispatch, mode],
  );

  const onInputQuestion = useCallback(
    (event) => {
      setInputContent(event.target.value);
      setQuestion(event.target.value?.trim());
      setShowExpandIcon(event.target.offsetHeight > MIN_HEIGHT);
    },
    [],
  );

  const onClickSend = useCallback(
    async () => {
      setChatHistory((prevMessages) => {
        return [...prevMessages, {
          id: new Date().getTime(),
          role: 'user',
          name,
          content: question,
        }]
      });
      setInputContent('');
      setShowExpandIcon(false);
      askAlita({
        type: "chat",
        projectId,
        context,
        prompt_id,
        model_settings: {
          temperature,
          max_tokens,
          top_p,
          top_k,
          stream: false,
          model: {
            name: model_name,
            integration_uid,
          }
        },
        variables: variables ? variables.map((item) => {
          const { key, value } = item;
          return {
            name: key,
            value,
          }
        }) : [],
        user_input: question,
        messages,
        chat_history: chatHistory.map((message) => {
          const { role, content, name: userName } = message;
          if (userName) {
            return { role, content, name: userName };
          } else {
            return { role, content }
          }
        }),
        format_response: true,
      });

      setQuestion('');
    },
    [
      askAlita,
      messages,
      context,
      integration_uid,
      max_tokens,
      chatHistory,
      model_name,
      name,
      prompt_id,
      question,
      temperature,
      top_p,
      top_k,
      variables,
      projectId,
    ]);

  const onClearChat = useCallback(
    () => {
      setQuestion('');
      setChatHistory([]);
      setInputContent('');
    },
    [],
  );

  const onClickRun = useCallback(
    () => {
      setCompletionResult('');
      askAlita({
        type: "freeform",
        projectId,
        context,
        prompt_id,
        model_settings: {
          stream: false,
          temperature,
          max_tokens,
          top_p,
          model: {
            name: model_name,
            integration_uid,
          }
        },
        user_input: '',
        variables: variables ? variables.map((item) => {
          const { key, value } = item;
          return {
            name: key,
            value,
          }
        }) : [],
        messages,
        format_response: true,
      });
    },
    [
      askAlita,
      messages,
      context,
      integration_uid,
      max_tokens,
      model_name,
      prompt_id,
      temperature,
      top_p,
      variables,
      projectId,
    ]);

  const onCloseToast = useCallback(
    () => {
      setShowToast(false);
    },
    [],
  );

  const onCtrlEnterPressed = useCallback(() => {
    setInputContent((prevContent) => prevContent + '\n');
  }, [])

  const onEnterPressed = useCallback(() => {
    if (mode === ChatBoxMode.Chat && !!question.trim()) {
      onClickSend()
    }
  }, [mode, onClickSend, question]);

  const { onKeyDown, onKeyUp, onCompositionStart, onCompositionEnd } = useCtrlEnterKeyEventsHandler(
    onCtrlEnterPressed,
    onEnterPressed,
  );

  const onCopyToMessages = useCallback(
    (id) => () => {
      const message = chatHistory.find(item => item.id === id);
      if (message) {
        dispatch(actions.updateCurrentPromptData({
          key: PROMPT_PAYLOAD_KEY.messages,
          data: [
            ...messages,
            {
              role: ROLES.Assistant,
              content: message.content,
              id: new Date().getTime() + '',
            }]
        }));
        setShowToast(true);
        setToastMessage('The message has been appended to the Messages');
        setToastSeverity('success');
      }
    },
    [chatHistory, dispatch, messages],
  );

  const onCopyToClipboard = useCallback(
    (id) => async () => {
      const message = chatHistory.find(item => item.id === id);
      if (message) {
        await navigator.clipboard.writeText(message.content);
        setShowToast(true);
        setToastMessage('The message has been copied to the clipboard');
        setToastSeverity('success');
      }
    },
    [chatHistory],
  );

  const onCopyCompletion = useCallback(() => {
    navigator.clipboard.writeText(completionResult);
  }, [completionResult])

  const onDeleteAnswer = useCallback(
    (id) => () => {
      setOpenAlert(true);
      setMessageIdToDelete(id);
    },
    [],
  );

  const onRegenerateAnswer = useCallback(
    (id) => () => {
      setIsRegenerating(true);
      setAnswerIdToRegenerate(id);
      setChatHistory((prevMessages) => {
        return prevMessages.map(
          message => message.id !== id ?
            message
            :
            ({ ...message, content: 'regenerating...' }));
      });
      setInputContent('');
      const questionIndex = chatHistory.findIndex(item => item.id === id) - 1;
      const theQuestion = chatHistory[questionIndex].content;
      const leftChatHistory = chatHistory.slice(0, questionIndex);
      askAlita({
        type: "chat",
        projectId,
        context,
        prompt_id,
        model_settings: {
          temperature,
          max_tokens,
          top_p,
          stream: false,
          model: {
            name: model_name,
            integration_uid,
          }
        },
        variables: variables ? variables.map((item) => {
          const { key, value } = item;
          return {
            name: key,
            value,
          }
        }) : [],
        user_input: theQuestion,
        messages,
        chat_history: leftChatHistory.map((message) => {
          const { role, content, name: userName } = message;
          if (userName) {
            return { role, content, name: userName };
          } else {
            return { role, content }
          }
        }),
        format_response: true,
      });

      setQuestion('');
    },
    [
      askAlita,
      chatHistory,
      context,
      integration_uid,
      max_tokens,
      messages,
      model_name,
      prompt_id,
      temperature,
      top_p,
      variables,
      projectId,
    ],
  );

  const onCloseAlert = useCallback(
    () => {
      setOpenAlert(false);
      setMessageIdToDelete('');
    },
    [],
  );

  const onConfirmDelete = useCallback(
    () => {
      setChatHistory((prevMessages) => {
        return prevMessages.filter(message => message.id !== messageIdToDelete)
      });
      onCloseAlert();
    },
    [messageIdToDelete, onCloseAlert],
  );

  useEffect(() => {
    let answer = '';
    if (data?.choices && data?.choices.length && data.choices[0].message) {
      answer = data.choices[0].message.content;
    } else if (data?.messages?.length) {
      answer = data.messages[0].content;
    }
    if (answer) {
      if (mode === ChatBoxMode.Chat) {
        if (!isRegenerating) {
          setChatHistory((prevMessages) => {
            return [...prevMessages, {
              id: new Date().getTime(),
              role: 'assistant',
              content: answer,
            }];
          });
        } else {
          setChatHistory((prevMessages) => {
            return prevMessages.map(
              message => message.id !== answerIdToRegenerate ?
                message
                :
                ({ ...message, content: answer }));
          });
          setAnswerIdToRegenerate('');
          setIsRegenerating(false);
        }
      } else {
        setCompletionResult(answer);
      }
      reset();
    }
  }, [data, data?.choices, data?.messages, isRegenerating, mode, answerIdToRegenerate, prompt_id, reset]);

  useEffect(() => {
    if (error) {
      setShowToast(true);
      setToastMessage(buildErrorMessage(error));
      setToastSeverity('error');
      if (isRegenerating) {
        setAnswerIdToRegenerate('');
        setIsRegenerating(false);
      }
      reset();
    }
  }, [error, isRegenerating, reset]);

  useEffect(() => {
    if (!mode && type) {
      setMode(type);
    }
  }, [mode, type]);

  useEffect(() => {
    if (!showExpandIcon) {
      setRows(MAX_ROWS);
    }
  }, [showExpandIcon]);


  return (
    <>
      <ChatBoxContainer
        role="presentation"
      >
        <ActionContainer>
          <ButtonGroup
            disableElevation
            variant="contained"
            aria-label="chat action buttons"
          >
            <StyledButton
              onClick={onSelectChatMode(ChatBoxMode.Chat)}
              selected={mode === ChatBoxMode.Chat}
              first={'true'}
            >
              <Typography variant='labelSmall'>Chat</Typography>
            </StyledButton>
            <StyledButton
              onClick={onSelectChatMode(ChatBoxMode.Completion)}
              selected={mode === ChatBoxMode.Completion}
            >
              <Typography variant='labelSmall'>Completion</Typography>
            </StyledButton>
          </ButtonGroup>
          {
            mode === ChatBoxMode.Chat ?
              <ActionButton
                aria-label="clear the chat"
                disabled={isLoading}
                onClick={onClearChat}
              >
                <ClearIcon sx={{ fontSize: 18 }} />
              </ActionButton>
              :
              <SendButtonContainer>
                <RunButton disabled={isLoading || !model_name} onClick={onClickRun}>
                  Run
                </RunButton>
                {isLoading && <StyledCircleProgress size={20} />}
              </SendButtonContainer>
          }
        </ActionContainer>
        <ChatBodyContainer>
          {
            mode === ChatBoxMode.Chat
              ?
              <MessageList>
                {
                  chatHistory.map((message) => {
                    return message.role === 'user' ?
                      <UserMessage key={message.id} content={message.content} />
                      :
                      <AIAnswer
                        key={message.id}
                        answer={message.content}
                        onCopy={onCopyToClipboard(message.id)}
                        onCopyToMessages={onCopyToMessages(message.id)}
                        onDelete={onDeleteAnswer(message.id)}
                        onRegenerate={onRegenerateAnswer(message.id)}
                      />
                  })
                }
              </MessageList>
              :
              <CompletionContainer>
                <Message>
                  <CompletionHeader>
                    <IconButton disabled={!completionResult} onClick={onCopyCompletion}>
                      <CopyIcon sx={{ fontSize: '1.13rem' }} />
                    </IconButton>
                  </CompletionHeader>
                  <MuiMarkdown>
                    {completionResult}
                  </MuiMarkdown>
                </Message>
              </CompletionContainer>
          }
          {
            mode === ChatBoxMode.Chat &&
            <ChatInputContainer>
              <Box sx={{ flex: 1, marginRight: 1 }}>
                <StyledTextField
                  value={inputContent}
                  fullWidth
                  id="standard-multiline-static"
                  label=""
                  multiline
                  maxRows={rows}
                  variant="standard"
                  onChange={onInputQuestion}
                  onKeyDown={onKeyDown}
                  onKeyUp={onKeyUp}
                  onCompositionStart={onCompositionStart}
                  onCompositionEnd={onCompositionEnd}
                  disabled={isLoading}
                  placeholder="Let’s start conversation"
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: showExpandIcon ? (
                      <IconButton
                        size='small'
                        onClick={onClickExpander}
                      >
                        {rows === MAX_ROWS ? (
                          <StyledUnfoldLessIcon />
                        ) : (
                          <StyledUnfoldMoreIcon />
                        )}
                      </IconButton>
                    ) : null
                  }}
                />
              </Box>
              <SendButtonContainer>
                <SendButton
                  disabled={isLoading || !question || !model_name}
                  onClick={onClickSend}
                  aria-label="send your question">
                  <SendIcon sx={{ fontSize: 18, fill: 'icon.fill.send' }} />
                </SendButton>
                {isLoading && <StyledCircleProgress />}
              </SendButtonContainer>
            </ChatInputContainer>
          }
        </ChatBodyContainer>
      </ChatBoxContainer>
      <Toast
        open={showToast}
        severity={toastSeverity}
        message={toastMessage}
        onClose={onCloseToast}
      />
      <AlertDialog
        title='Warning'
        alertContent="The deleted message can't be restored. Are you sure to delete the message?"
        open={openAlert}
        onClose={onCloseAlert}
        onCancel={onCloseAlert}
        onConfirm={onConfirmDelete}
      />
    </>
  )
};

ChatBox.propTypes = {
}


export default ChatBox;