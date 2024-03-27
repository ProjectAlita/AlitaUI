/* eslint-disable react/jsx-no-bind */
import { useAskAlitaMutation } from '@/api/prompts';
import { ChatBoxMode, DEFAULT_MAX_TOKENS, DEFAULT_TOP_P, PROMPT_PAYLOAD_KEY, ROLES, SocketMessageType, StreamingMessageType } from '@/common/constants';
import { buildErrorMessage } from '@/common/utils';
import useSocket, { STOP_GENERATING_EVENT, useManualSocket } from "@/hooks/useSocket.jsx";
import { ConversationStartersView } from '@/pages/Applications/Components/Applications/ConversationStarters';
import { useProjectId } from '@/pages/hooks';
import { actions } from '@/slices/prompts';
import { Box } from '@mui/material';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertDialog from '../AlertDialog';
import GroupedButton from '../GroupedButton';
import ClearIcon from '../Icons/ClearIcon';
import Toast from '../Toast';
import AIAnswer from './AIAnswer';
import ActionButtons from './ActionButtons';
import { AUTO_SCROLL_KEY } from './AutoScrollToggle';
import ChatInput from './ChatInput';
import {
  ActionButton,
  ActionContainer,
  ChatBodyContainer,
  ChatBoxContainer,
  MessageList,
  RunButton,
  SendButtonContainer,
  StyledCircleProgress
} from './StyledComponents';
import UserMessage from './UserMessage';
import useDeleteMessageAlert from './useDeleteMessageAlert';

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
      model_name,
      name: model_name, //TODO: (model_name) if the BE is ready, this "name" field should be removed
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


const ChatBox = forwardRef((props, boxRef) => {
  const {
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
    currentVersionId,
    conversationStarters = [],
    isFullScreenChat,
    setIsFullScreenChat,
  } = props
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
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [answerIdToRegenerate, setAnswerIdToRegenerate] = useState('');
  const projectId = useProjectId();
  const chatInput = useRef(null);
  const messagesEndRef = useRef();
  const [isRunning, setIsRunning] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false)
  const listRefs = useRef([]);
  const modeRef = useRef(mode);
  const chatHistoryRef = useRef(chatHistory);
  const completionResultRef = useRef(completionResult);

  const {
    openAlert,
    alertContent,
    onDeleteAnswer,
    onDeleteAll,
    onConfirmDelete,
    onCloseAlert
  } = useDeleteMessageAlert({
    setChatHistory,
    chatInput,
  });

  const onClickClearChat = useCallback(() => {
    if (chatHistory.length) {
      onDeleteAll();
    }
  }, [chatHistory.length, onDeleteAll])

  useImperativeHandle(boxRef, () => ({
    onClear: onClickClearChat,
  }));

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);

  useEffect(() => {
    completionResultRef.current = completionResult;
  }, [completionResult]);

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
    if (modeRef.current === ChatBoxMode.Chat) {
      const msgIdx = chatHistoryRef.current?.findIndex(i => i.id === messageId) || -1;
      let msg
      if (msgIdx < 0) {
        msg = {
          id: messageId,
          role: ROLES.Assistant,
          content: '',
          isLoading: false,
        }
      } else {
        msg = chatHistoryRef.current[msgIdx]
      }
      return [msgIdx, msg]
    } else {
      return completionResultRef.current.id === messageId ? [0, { ...completionResultRef.current }] : [-1, {
        id: messageId,
        role: ROLES.Assistant,
        content: '',
        isLoading: false,
      }]
    }
  }, [])

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

    const scrollToMessageBottom = () => {
      if (sessionStorage.getItem(AUTO_SCROLL_KEY) === 'true') {
        (listRefs.current[msgIndex] || messagesEndRef?.current)?.scrollIntoView({ block: "end" });
      }
    };

    switch (socketMessageType) {
      case SocketMessageType.References:
        msg.references = message.references
        break
      case SocketMessageType.Chunk:
      case SocketMessageType.AIMessageChunk:
        streamingContent.current += message.content
        msg.content = streamingContent.current
        msg.isLoading = false
        setTimeout(scrollToMessageBottom, 0);
        if (response_metadata?.finish_reason) {
          if (message_type === StreamingMessageType.Freeform) {
            setIsRunning(false);
          } else {
            setIsStreaming(false);
          }
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
        setTimeout(scrollToMessageBottom, 0);
        break
      case SocketMessageType.Error:
        setIsStreaming(false)
        handleError({ data: message.content || [] })
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

  const { emit: manualEmit } = useManualSocket(STOP_GENERATING_EVENT);
  const onStopStreaming = useCallback(
    (streamIds) => () => {
      manualEmit(streamIds);
      setIsStreaming(false);
    },
    [manualEmit],
  );

  const onStopAll = useCallback(() => {
    const streamIds = chatHistoryRef.current.filter(message => message.role !== ROLES.User).map(message => message.id);
    onStopStreaming(streamIds)();
  }, [onStopStreaming]);


  useEffect(() => {
    return () => {
      const streamIds = chatHistoryRef.current.filter(message => message.role !== ROLES.User).map(message => message.id);
      manualEmit(streamIds);
    };
  }, [manualEmit])

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
          <Box display='flex' gap='8px'>
            <ActionButtons
              isFullScreenChat={isFullScreenChat}
              setIsFullScreenChat={setIsFullScreenChat}
              isStreaming={isStreaming}
              onStopAll={onStopAll}
            />
            {
              mode === ChatBoxMode.Chat ?
                <ActionButton
                  aria-label="clear the chat"
                  disabled={isLoading || isStreaming || !chatHistory.length}
                  onClick={onClickClearChat}
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
          </Box>
        </ActionContainer>}
        <ChatBodyContainer>
          <MessageList>
            {
              mode === ChatBoxMode.Chat ?
                (chatHistory?.length > 0 ? chatHistory.map((message, index) => {
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
                      onStop={onStopStreaming([message.id])}
                      onCopy={onCopyToClipboard(message.id)}
                      onCopyToMessages={onCopyToMessages(message.id, ROLES.Assistant)}
                      onDelete={onDeleteAnswer(message.id)}
                      onRegenerate={USE_STREAM ? onRegenerateAnswerStream(message.id) : onRegenerateAnswer(message.id)}
                      shouldDisableRegenerate={isLoading}
                      references={message.references}
                      isLoading={Boolean(message.isLoading)}
                      isStreaming={isStreaming}
                    />
                }) :
                  <ConversationStartersView items={conversationStarters} onSend={USE_STREAM ? onPredictStream : onClickSend} />
                ) :
                (completionResult.isLoading || completionResult.content) &&
                <AIAnswer
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
              disabledSend={isLoading || !model_name || isStreaming}
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
        alertContent={alertContent}
        open={openAlert}
        onClose={onCloseAlert}
        onCancel={onCloseAlert}
        onConfirm={onConfirmDelete}
      />
    </>
  )
});

ChatBox.displayName = 'ChatBox'

ChatBox.propTypes = {}


export default ChatBox;