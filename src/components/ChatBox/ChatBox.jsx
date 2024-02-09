import { useAskAlitaMutation } from '@/api/prompts';
import { ChatBoxMode, DEFAULT_MAX_TOKENS, DEFAULT_TOP_P, PROMPT_PAYLOAD_KEY, ROLES } from '@/common/constants';
import { actions } from '@/slices/prompts';
import IconButton from '@mui/material/IconButton';
import { MuiMarkdown } from 'mui-markdown';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertDialog from '../AlertDialog';
import ClearIcon from '../Icons/ClearIcon';
import CopyIcon from '@/components/Icons/CopyIcon';
import Toast from '../Toast';
import AIAnswer from './AIAnswer';
import {
  ActionButton,
  ActionContainer,
  ChatBodyContainer,
  ChatBoxContainer,
  CompletionContainer,
  Message,
  MessageList,
  RunButton,
  SendButtonContainer,
  StyledCircleProgress,
} from './StyledComponents';
import UserMessage from './UserMessage';
import { useProjectId } from '@/pages/hooks';
import { buildErrorMessage } from '../../common/utils';
import styled from '@emotion/styled';
import GroupedButton from '../GroupedButton';
import ChatInput from './ChatInput';

const CompletionHeader = styled('div')(() => ({
  display: 'block',
  textAlign: 'end'
}));

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
  const [chatHistory, setChatHistory] = useState([]);
  const [completionResult, setCompletionResult] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('info')
  const [openAlert, setOpenAlert] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [answerIdToRegenerate, setAnswerIdToRegenerate] = useState('');
  const projectId = useProjectId();
  const chatInput = useRef(null);

  const onSelectChatMode = useCallback(
    (chatMode) => () => {
      if (mode !== chatMode) {
        setMode(chatMode);
        chatInput.current?.reset();
        dispatch(actions.updateCurrentPromptData({
          key: PROMPT_PAYLOAD_KEY.type,
          data: chatMode
        }));
      }
    },
    [dispatch, mode],
  );

  const onClickSend = useCallback(
    async (question) => {
      setChatHistory((prevMessages) => {
        return [...prevMessages, {
          id: new Date().getTime(),
          role: 'user',
          name,
          content: question,
        }]
      });
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
      temperature,
      top_p,
      top_k,
      variables,
      projectId,
    ]);

  const onClearChat = useCallback(
    () => {
      setChatHistory([]);
      chatInput.current?.reset();
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

  const onCopyToMessages = useCallback(
    (id, role) => () => {
      const message = chatHistory.find(item => item.id === id);
      if (message) {
        dispatch(actions.updateCurrentPromptData({
          key: PROMPT_PAYLOAD_KEY.messages,
          data: [
            ...messages,
            {
              role,
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
      chatInput.current?.reset();
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

  const groupedButtonItems = useMemo(() => ([
    {
      title: 'Chat',
      selected: mode === ChatBoxMode.Chat,
      onClick: onSelectChatMode(ChatBoxMode.Chat),
    },
    {
      title: 'Completion',
      selected: mode === ChatBoxMode.Completion,
      onClick: onSelectChatMode(ChatBoxMode.Completion),
    }
  ]), [mode, onSelectChatMode]);

  return (
    <>
      <ChatBoxContainer
        role="presentation"
      >
        <ActionContainer>
          <GroupedButton buttonItems={groupedButtonItems} />
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
                      <UserMessage
                        key={message.id}
                        content={message.content}
                        onCopy={onCopyToClipboard(message.id)}
                        onCopyToMessages={onCopyToMessages(message.id, ROLES.User)}
                        onDelete={onDeleteAnswer(message.id)}
                      />
                      :
                      <AIAnswer
                        key={message.id}
                        answer={message.content}
                        onCopy={onCopyToClipboard(message.id)}
                        onCopyToMessages={onCopyToMessages(message.id, ROLES.Assistant)}
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
            <ChatInput 
              ref={chatInput}
              onSend={onClickSend}
              isLoading={isLoading}
              disabledSend={isLoading || !model_name}
              shouldHandleEnter />
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