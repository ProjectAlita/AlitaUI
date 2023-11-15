import { useAskAlitaMutation } from '@/api/prompts';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { MuiMarkdown } from 'mui-markdown';
import { useCallback, useEffect, useRef, useState } from 'react';

import ClearIcon from '../Icons/ClearIcon';
import SendIcon from '../Icons/SendIcon';
import Toast from '../Toast';
import AIAnswer from './AIAnswer';
import UserMessage from './UserMessage';
import { useCtrlEnterKeyEventsHandler } from './hooks';

const ChatBoxContainer = styled(Box)(() => ({
  width: '100%',
  height: '27.8rem',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '1.25rem',
  paddingLeft: '0.5rem',
  paddingRight: '1rem'
}));

const StyledButton = styled(Button)(({ first, selected, theme }) => (`
  text-transform: none;
  display: flex;
  padding: 0.375rem 1rem;
  align-items: center;
  gap: 0.5rem;
  border-radius:${first ? '0.5rem 0rem 0rem 0.5rem' : '0rem 0.5rem 0.5rem 0rem'};
  background:${selected ? theme.palette.background.tabButton.active : theme.palette.background.tabButton.default};
  color:${selected ? 'white' : theme.palette.text.primary};
  border-right: 0px !important;
`));

const ActionContainer = styled(Box)(() => ({
  width: '100%',
  height: '1.75rem',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
}));

const ActionButton = styled(IconButton)(({ theme }) => (`
  width: 2rem;
  height: 2rem;
  display: flex;
  padding: 0.375rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.75rem;
  background: ${theme.palette.background.icon.default};
`));

const RunButton = styled(Button)(({ theme }) => (`
  display: flex;
  padding: 0.375rem 1rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 1.75rem;
  background: ${theme.palette.primary.main};
  &:hover {
    background: ${theme.palette.primary.main};
  }
  &.Mui-disabled {
    background-color: ${theme.palette.text.primary};
  }

  color: ${theme.palette.text.button.primary};
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1rem; /* 133.333% */
  text-transform: none;

`));

const ChatBodyContainer = styled(Box)(({ theme }) => `
  height: 24.6rem;
  display: flex;
  padding: 0.75rem 0.75rem 0rem 0.75rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  flex: 1 0 0;
  align-self: stretch;

  position: relative;

  border-radius: 0.5rem;
  border: 1px solid ${theme.palette.border.activeBG};
`);

const ChatInputContainer = styled(Box)(({ theme }) => `
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0.75rem 1rem;
  align-items: center;
  gap: 0.5rem;
  height: 4.25rem;

  position: absolute;
  bottom: 0px;
  left: 0px;

  border-radius: 0rem 0rem 0.375rem 0.375rem;
  border-top: 1px solid ${theme.palette.border.lines};
  background: ${theme.palette.background.userInputBackground};
`);

const StyledTextField = styled(TextField)(() => `
  flex: 1 0 0;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
`);

const SendButtonContainer = styled(Box)(() => (`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`));

const SendButton = styled(IconButton)(({ theme }) => (`
  display: flex;
  padding: 0.375rem;
  align-items: center;
  border-radius: 1.75rem;
  background: ${theme.palette.primary.main};
  &.Mui-disabled {
    background-color: ${theme.palette.text.primary};
  }
  &:hover {
    background: ${theme.palette.primary.main}
  }
`));

const StyledCircleProgress = styled(CircularProgress)(() => `
  position: absolute;
  z-index: 999;
`);

const MessageList = styled(List)(() => `
  width: 100%;
  max-height: 20.95rem;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
`);

const CompletionContainer = styled(Box)(() => `
  width: 100%;
  max-height: 26.7rem;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    width: 0 !important
  }
`);

const Message = styled(Box)(() => `
  flex: 1 0 0;
  color: #FFF;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
  overflow-wrap: break-word;
  word-break: break-word;
`);

export const ChatBoxMode = {
  'Chat': 'Chat',
  'Completion': 'Completion',
}

const ChatBox = ({
  prompt_id,
  integration_uid,
  model_name,
  temperature,
  context,
  chat_history,
  max_tokens,
  top_p,
  variables,
}) => {
  const inputRef = useRef(null)
  const [askAlita, { isLoading, data, error, reset }] = useAskAlitaMutation();
  const [mode, setMode] = useState(ChatBoxMode.Chat);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [completionResult, setCompletionResult] = useState('');
  const [showError, setShowError] = useState(false);
  const onSelectChatMode = useCallback(
    (chatMode) => () => {
      if (mode !== chatMode) {
        setMode(chatMode);
        if (chatMode === ChatBoxMode.Completion) {
          setQuestion('');
        }
      }
    },
    [mode],
  );

  const onInputQuestion = useCallback(
    (event) => {
      setQuestion(event.target.value?.trim())
    },
    [],
  );

  const onClickSend = useCallback(
    async () => {
      setMessages((prevMessages) => {
        return [...prevMessages, {
          id: new Date().getTime(),
          role: 'user',
          content: question,
        }]
      });
      if (inputRef.current) {
        inputRef.current.value = '';
      }

      askAlita({
        projectId: 9,
        context,
        prompt_id,
        integration_uid,
        integration_settings: {
          model_name,
          temperature,
          max_tokens,
          top_p,
        },
        variables: variables ? variables.reduce((acc, item) => {
          const { key, value } = item;
          return {
            ...acc,
            [key]: value,
          }
        }, {}) : undefined,
        input: question,
        chat_history: [...chat_history, ...messages].map(({role, content}) => ({role, content})),
      });

      setQuestion('');
    },
    [
      askAlita,
      chat_history,
      context,
      integration_uid,
      max_tokens,
      messages,
      model_name,
      prompt_id,
      question,
      temperature,
      top_p,
      variables,
    ]);

  const onClearChat = useCallback(
    () => {
      setQuestion('');
      setMessages([]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [],
  );

  const onClickRun = useCallback(
    () => {
      setCompletionResult('');
      askAlita({
        projectId: 9,
        context,
        prompt_id,
        integration_uid,
        integration_settings: {
          model_name,
          temperature,
          max_tokens,
          top_p,
        },
        input: '',
        variables: variables ? variables.reduce((acc, item) => {
          const { key, value } = item;
          return {
            ...acc,
            [key]: value,
          }
        }, {}) : undefined,
        chat_history:chat_history.map(({role, content}) => ({role, content})),
      });
    },
    [
      askAlita,
      chat_history,
      context,
      integration_uid,
      max_tokens,
      model_name,
      prompt_id,
      temperature,
      top_p,
      variables
    ]);

  const onCloseError = useCallback(
    () => {
      setShowError(false);
    },
    [],
  );

  const onCtrlEnterPressed = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = inputRef.current.value + '\n'
    }
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

  useEffect(() => {
    if (data?.messages?.length) {
      if (mode === ChatBoxMode.Chat) {
        setMessages((prevMessages) => {
          return [...prevMessages, {
            id: new Date().getTime(),
            role: 'ai',
            content: data.messages[0].content,
          }]
        })
      } else {
        setCompletionResult(data.messages[0].content);
      }
      reset();
    }
  }, [data, data?.messages, mode, reset]);

  useEffect(() => {
    if (error) {
      setShowError(true)
      reset();
    }
  }, [error, reset]);

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
              Chat
            </StyledButton>
            <StyledButton
              onClick={onSelectChatMode(ChatBoxMode.Completion)}
              selected={mode === ChatBoxMode.Completion}
            >
              Completion
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
                <RunButton disabled={isLoading} onClick={onClickRun}>
                  Run
                </RunButton>
                {isLoading && <StyledCircleProgress />}
              </SendButtonContainer>
          }
        </ActionContainer>
        <ChatBodyContainer>
          {
            mode === ChatBoxMode.Chat
              ?
              <MessageList>
                {
                  messages.map((message) => {
                    return message.role === 'user' ?
                      <UserMessage key={message.id} content={message.content} />
                      :
                      <AIAnswer key={message.id} answer={message.content} />
                  })
                }
              </MessageList>
              :
              <CompletionContainer>
                <Message >
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
                  inputRef={inputRef}
                  autoFocus
                  fullWidth
                  id="standard-multiline-static"
                  label=""
                  multiline
                  rows={1}
                  variant="standard"
                  onChange={onInputQuestion}
                  onKeyDown={onKeyDown}
                  onKeyUp={onKeyUp}
                  onCompositionStart={onCompositionStart}
                  onCompositionEnd={onCompositionEnd}
                  disabled={isLoading}
                  placeholder="Let’s start conversation"
                  InputProps={{ disableUnderline: true }}
                />
              </Box>
              <SendButtonContainer>
                <SendButton
                  disabled={isLoading || !question}
                  onClick={onClickSend}
                  aria-label="send your question">
                  <SendIcon sx={{ fontSize: 18 }} />
                </SendButton>
                {isLoading && <StyledCircleProgress />}
              </SendButtonContainer>
            </ChatInputContainer>
          }
        </ChatBodyContainer>
      </ChatBoxContainer>
      <Toast
        open={showError}
        severity="error"
        message={typeof error === 'string' ? error : error?.data?.error}
        onClose={onCloseError} />
    </>
  )
};

ChatBox.propTypes = {
}


export default ChatBox;