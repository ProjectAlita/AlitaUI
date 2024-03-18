/* eslint-disable react/jsx-no-bind */
import { useAskAlitaMutation } from '@/api/prompts';
import { ChatBoxMode, DEFAULT_MAX_TOKENS, DEFAULT_TOP_P, PROMPT_PAYLOAD_KEY, ROLES, SocketMessageType, StreamingMessageType } from '@/common/constants';
import { actions } from '@/slices/prompts';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertDialog from '../AlertDialog';
import ClearIcon from '../Icons/ClearIcon';
import Toast from '../Toast';
import AIAnswer from './AIAnswer';
import {
  ActionButton,
  ActionContainer,
  ChatBodyContainer,
  ChatBoxContainer,
  MessageList,
  RunButton,
  SendButtonContainer,
  StyledCircleProgress,
} from './StyledComponents';
import UserMessage from './UserMessage';
import { useProjectId } from '@/pages/hooks';
import { buildErrorMessage } from '../../common/utils';
import GroupedButton from '../GroupedButton';
import ChatInput from './ChatInput';
import useSocket from "@/hooks/useSocket.jsx";

const USE_STREAM = true

const generatePayload = ({
  projectId, prompt_id, context, temperature,
  max_tokens, top_p, top_k, model_name, integration_uid,
  variables, messages, type, name, stream = true, currentVersionId
}) => ({
  prompt_id,
  projectId,

  user_name: name,
  project_id: projectId,
  prompt_version_id: currentVersionId,

  type,
  context,
  model_settings: {
    temperature,
    max_tokens,
    top_p,
    top_k,
    stream,
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
  messages,
  format_response: true,
})

const generateChatPayload = ({
  projectId, prompt_id, context, temperature,
  max_tokens, top_p, top_k, model_name, integration_uid,
  variables, question, messages, chatHistory, name, stream = true,
  currentVersionId
}) => {
  const payload = generatePayload({
    projectId, prompt_id, context, temperature,
    max_tokens, top_p, top_k, model_name, integration_uid,
    variables, messages, type: 'chat', name, stream, currentVersionId
  })
  payload.chat_history = chatHistory ? chatHistory.map((message) => {
    const { role, content, name: userName } = message;
    if (userName) {
      return { role, content, name: userName };
    } else {
      return { role, content }
    }
  }) : []
  payload.user_input = question
  return payload
}


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
  chatOnly = false,
  currentVersionId
}) => {
  const dispatch = useDispatch();
  const [askAlita, { isLoading, data, error, reset }] = useAskAlitaMutation();
  const { name } = useSelector(state => state.user)
  const [mode, setMode] = useState(type);
  const [chatHistory, setChatHistory] = useState([]);
  const [completionResult, setCompletionResult] = useState(
    {
      id: new Date().getTime(),
      role: ROLES.Assistant,
      isLoading: false,
      content: '',
    }
  )
  const streamingContent = useRef('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('info')
  const [openAlert, setOpenAlert] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [answerIdToRegenerate, setAnswerIdToRegenerate] = useState('');
  const projectId = useProjectId();
  const chatInput = useRef(null);
  const messagesEndRef = useRef();
  const [isRunning, setIsRunning] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false)
  const listRefs = useRef([]);

  const onSelectChatMode = useCallback(
    (e) => {
      const chatMode = e?.target?.value;
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

  const getMessage = useCallback((messageId) => {
    if (mode === ChatBoxMode.Chat) {
      const msgIdx = chatHistory.findIndex(i => i.id === messageId)
      let msg
      if (msgIdx < 0) {
        msg = {
          id: messageId,
          role: ROLES.Assistant,
          content: '',
          isLoading: false,
        }
      } else {
        msg = chatHistory[msgIdx]
      }
      return [msgIdx, msg]
    } else {
      return completionResult.id === messageId ? [0, { ...completionResult }] : [-1, {
        id: messageId,
        role: ROLES.Assistant,
        content: '',
        isLoading: false,
      }]
    }
  }, [chatHistory, completionResult, mode])

  const handleError = useCallback(
    (errorObj) => {
      setIsRunning(false);
      setToastMessage(buildErrorMessage(errorObj));
      setToastSeverity('error');
      setShowToast(true);
      if (isRegenerating) {
        setAnswerIdToRegenerate('');
        setIsRegenerating(false);
      }
    },
    [isRegenerating],
  )

  const handleSocketEvent = useCallback(async message => {
    const { stream_id, type: socketMessageType, message_type, response_metadata } = message
    const [msgIndex, msg] = getMessage(stream_id, message_type)
    switch (socketMessageType) {
      case SocketMessageType.References:
        msg.references = message.references
        break
      case SocketMessageType.Chunk:
      case SocketMessageType.AIMessageChunk:
        streamingContent.current += message.content
        msg.content = streamingContent.current
        msg.isLoading = false
        setIsStreaming(false);
        setTimeout(() => {
          (listRefs.current[msgIndex] || messagesEndRef?.current)?.scrollIntoView({ block: "end" });
        }, 0);
        if (message_type === StreamingMessageType.Freeform && response_metadata?.finish_reason) {
          setIsRunning(false);
        }
        break
      case SocketMessageType.StartTask:
        streamingContent.current = ''
        msg.isLoading = true
        msg.content = ''
        msg.references = []
        if (message_type !== StreamingMessageType.Freeform) {
          msgIndex === -1 ? setChatHistory(prevState => [...prevState, msg]) : setChatHistory(prevState => {
            prevState[msgIndex] = msg
            return [...prevState]
          })
        } else {
          setCompletionResult(msg)
        }

        break
      case SocketMessageType.Error:
        setIsStreaming(false)
        handleError({data: message.content || []})
        return
      case SocketMessageType.Freeform:
        break
      default:
        // eslint-disable-next-line no-console
        console.warn('unknown message type', socketMessageType)
        return
    }
    if (message_type !== StreamingMessageType.Freeform) {
      msgIndex > -1 && setChatHistory(prevState => {
        prevState[msgIndex] = msg
        return [...prevState]
      })
    } else {
      msgIndex > -1 && setCompletionResult(msg)
    }
  }, [getMessage, handleError])

  const { emit } = useSocket('promptlib_predict', handleSocketEvent)

  const onPredictStream = useCallback(question => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ block: "end" });
    }, 0);
    setChatHistory((prevMessages) => {
      return [...prevMessages, {
        id: new Date().getTime(),
        role: ROLES.User,
        name,
        content: question,
      }]
    })
    const payload = generateChatPayload({
      projectId, prompt_id, context, temperature, max_tokens, top_p,
      top_k, model_name, integration_uid, variables, question, messages,
      chatHistory, name, stream: true, currentVersionId
    })
    setIsStreaming(true);
    emit(payload)
  },
    [
      messages,
      context,
      integration_uid,
      max_tokens,
      chatHistory,
      setChatHistory,
      model_name,
      name,
      prompt_id,
      temperature,
      top_p,
      top_k,
      variables,
      projectId,
      emit,
      currentVersionId
    ])

  const onClickSend = useCallback(
    async (question) => {
      const payload = generateChatPayload({
        projectId, prompt_id, context, temperature, max_tokens,
        top_p, top_k, model_name, integration_uid, variables,
        question, messages, chatHistory, name, stream: false,
        currentVersionId
      })
      setChatHistory((prevMessages) => {
        return [...prevMessages, {
          id: new Date().getTime(),
          role: 'user',
          name,
          content: question,
        }]
      });
      askAlita(payload);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ block: "end" });
      }, 0);
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
      currentVersionId
    ]);

  const onClearChat = useCallback(
    () => {
      setChatHistory([]);
      chatInput.current?.reset();
    },
    [],
  );

  const onClickRun = useCallback(() => {
    setCompletionResult('');
    const payload = generatePayload({
      projectId, prompt_id, context, temperature, max_tokens, top_p, top_k,
      model_name, integration_uid, variables, messages, type: 'freeform', name,
      stream: false, currentVersionId
    })
    askAlita(payload);
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
      name,
      top_k,
      currentVersionId
    ]);

  const onClickRunStream = useCallback(() => {
    setIsRunning(true);
    const payload = generatePayload({
      projectId, prompt_id, context, temperature, max_tokens, top_p, top_k,
      model_name, integration_uid, variables, messages, type: 'freeform', name,
      stream: true, currentVersionId
    })
    emit(payload)
  },
    [
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
      name,
      emit,
      top_k,
      currentVersionId
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

  const onCopyCompletion = useCallback(async () => {
    await navigator.clipboard.writeText(completionResult.content);
    setShowToast(true);
    setToastMessage('The message has been copied to the clipboard');
    setToastSeverity('success');
  }, [completionResult.content])

  const onDeleteAnswer = useCallback(
    (id) => () => {
      setOpenAlert(true);
      setMessageIdToDelete(id);
    },
    [],
  );

  const onRegenerateAnswerStream = useCallback(id => async () => {
    const questionIndex = chatHistory.findIndex(item => item.id === id) - 1;
    const theQuestion = chatHistory[questionIndex]?.content;
    const leftChatHistory = chatHistory.slice(0, questionIndex);

    const payload = generateChatPayload({
      projectId, prompt_id, context, temperature, max_tokens, top_p, top_k,
      model_name, integration_uid, variables, question: theQuestion, messages,
      chatHistory: leftChatHistory, name, stream: true, currentVersionId
    })
    payload.message_id = id
    setIsStreaming(true);
    emit(payload)
  }, [
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
    emit,
    name,
    top_k,
    currentVersionId
  ]);

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
      const theQuestion = chatHistory[questionIndex]?.content;
      const leftChatHistory = chatHistory.slice(0, questionIndex);

      const payload = generateChatPayload({
        projectId, prompt_id, context, temperature, max_tokens, top_p, top_k,
        model_name, integration_uid, variables, question: theQuestion, messages,
        chatHistory: leftChatHistory, name, stream: false, currentVersionId
      })
      payload.message_id = id
      askAlita(payload);
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
      name,
      top_k,
      currentVersionId
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
        setIsRunning(false);
        setCompletionResult(
          {
            id: new Date().getTime(),
            role: ROLES.Assistant,
            isLoading: false,
            content: answer,
          }
        )
      }
      reset();
    }
  }, [data, data?.choices, data?.messages, isRegenerating, mode, answerIdToRegenerate, prompt_id, reset]);

  useEffect(() => {
    if (error) {
      handleError(error)
      reset();
    }
  }, [error, handleError, reset]);

  useEffect(() => {
    if (!mode && type) {
      setMode(type);
    }
  }, [mode, type]);

  const buttonItems = useMemo(() =>
    Object.entries(ChatBoxMode).map(
      ([label, value]) => ({ label, value })
    ), []);

  return (
    <>
      <ChatBoxContainer
        role="presentation"
      >
        {!chatOnly && <ActionContainer>
          <GroupedButton
            value={mode}
            onChange={onSelectChatMode}
            buttonItems={buttonItems}
          />
          {
            mode === ChatBoxMode.Chat ?
              <ActionButton
                aria-label="clear the chat"
                disabled={isLoading}
                onClick={onClearChat}
                sx={{ height: '28px', width: '28px' }}
              >
                <ClearIcon sx={{ fontSize: 16 }} />
              </ActionButton>
              :
              <SendButtonContainer>
                <RunButton disabled={isLoading || isRunning || !model_name}
                  onClick={USE_STREAM ? onClickRunStream : onClickRun}
                >
                  Run
                </RunButton>
                {(isLoading || isRunning) && <StyledCircleProgress size={20} />}
              </SendButtonContainer>
          }
        </ActionContainer>}
        <ChatBodyContainer>
          <MessageList>
            {
              mode === ChatBoxMode.Chat ? chatHistory.map((message, index) => {
                return message.role === 'user' ?
                  <UserMessage
                    key={message.id}
                    ref={(ref) => (listRefs.current[index] = ref)}
                    content={message.content}
                    onCopy={onCopyToClipboard(message.id)}
                    onCopyToMessages={onCopyToMessages(message.id, ROLES.User)}
                    onDelete={onDeleteAnswer(message.id)}
                  />
                  :
                  <AIAnswer
                    key={message.id}
                    ref={(ref) => (listRefs.current[index] = ref)}
                    answer={message.content}
                    onCopy={onCopyToClipboard(message.id)}
                    onCopyToMessages={onCopyToMessages(message.id, ROLES.Assistant)}
                    onDelete={onDeleteAnswer(message.id)}
                    onRegenerate={USE_STREAM ? onRegenerateAnswerStream(message.id) : onRegenerateAnswer(message.id)}
                    shouldDisableRegenerate={isLoading}
                    references={message.references}
                    isLoading={Boolean(message.isLoading)}
                  />
              })
                :
                (completionResult.isLoading || completionResult.content)
                && <AIAnswer
                  answer={completionResult.content}
                  onCopy={onCopyCompletion}
                  references={completionResult.references}
                  isLoading={Boolean(completionResult.isLoading)}
                />
            }
            <div ref={messagesEndRef} />
          </MessageList>
          {
            mode === ChatBoxMode.Chat &&
            <ChatInput
              ref={chatInput}
              onSend={USE_STREAM ? onPredictStream : onClickSend}
              isLoading={isLoading || isStreaming}
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

ChatBox.propTypes = {}


export default ChatBox;