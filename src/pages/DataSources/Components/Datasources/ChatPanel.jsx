/* eslint-disable react/jsx-no-bind */
import { ROLES, SocketMessageType } from '@/common/constants';
import { Box } from '@mui/material';
import { useCallback, useState, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import AlertDialog from '@/components/AlertDialog';
import ClearIcon from '@/components/Icons/ClearIcon';
import Toast from '@/components/Toast';
import AIAnswer from '@/components/ChatBox/AIAnswer';
import {
  ActionButton,
  ChatBodyContainer,
  ChatBoxContainer,
  MessageList
} from '@/components/ChatBox/StyledComponents';
import UserMessage from '@/components/ChatBox/UserMessage';
import ChatSettings from './ChatSettings';
import { genModelSelectValue } from '@/common/promptApiUtils';
import SettingIcon from '@/components/Icons/SettingIcon';
import ChatInput from '@/components/ChatBox/ChatInput';
import AdvancedChatSettings from './AdvancedChatSettings';
import { useIsSmallWindow, useProjectId } from '@/pages/hooks';
import useSocket from "@/hooks/useSocket.jsx";
import { buildErrorMessage } from '@/common/utils';
const MESSAGE_REFERENCE_ROLE = 'reference'
const generatePayload = (question, context, chatHistory, chatSettings) => {
  return {
    input: question,
    context: context,
    chat_history: chatHistory.filter(i => i.role !== MESSAGE_REFERENCE_ROLE),

    chat_settings_ai: {
      ai_integration_uid: chatSettings.chat_model?.integration_uid,
      ai_model_name: chatSettings.chat_model?.model_name,
      temperature: chatSettings.temperature,
      top_p: chatSettings.top_p,
      maximum_length: chatSettings.max_tokens,
    },

    chat_settings_embedding: {
      embedding_integration_uid: chatSettings.embedding_model?.integration_uid,
      embedding_model_name: chatSettings.embedding_model?.model_name,

      fetch_k: chatSettings.fetch_k,
      page_top_k: chatSettings.page_top_k,
      top_k: chatSettings.top_k,
      cut_off_score: chatSettings.cut_off_score
    }
  }
}

const ChatPanel = ({
  onClickAdvancedSettings,
  showAdvancedSettings,
  onCloseAdvancedSettings,
  chatSettings,
  onChangeChatSettings,
  versionId,
  context,
  chatHistory,
  setChatHistory,
}) => {
  const { name } = useSelector(state => state.user)
  const currentProjectId = useProjectId();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('info')
  const [openAlert, setOpenAlert] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const chatModelValue = useMemo(() =>
    (chatSettings?.chat_model?.integration_uid && chatSettings?.chat_model?.model_name ? genModelSelectValue(chatSettings?.chat_model?.integration_uid, chatSettings?.chat_model?.model_name, chatSettings?.chat_model?.integration_name) : '')
    , [chatSettings?.chat_model?.integration_name, chatSettings?.chat_model?.integration_uid, chatSettings?.chat_model?.model_name]);

  const embeddingModelValue = useMemo(() =>
    (chatSettings?.embedding_model?.integration_uid && chatSettings?.embedding_model?.model_name ? genModelSelectValue(chatSettings?.embedding_model?.integration_uid, chatSettings?.embedding_model?.model_name, chatSettings?.embedding_model?.integration_name) : '')
    , [chatSettings?.embedding_model?.integration_name, chatSettings?.embedding_model?.integration_uid, chatSettings?.embedding_model?.model_name]);

  const chatInput = useRef(null);
  const { isSmallWindow } = useIsSmallWindow();
  const messagesEndRef = useRef();
  const listRefs = useRef([]);

  const getMessage = useCallback((messageId) => {
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
  }, [chatHistory])

  const handleSocketEvent = useCallback(async message => {
    const { stream_id, type } = message

    const [msgIndex, msg] = getMessage(stream_id)

    switch (type) {
      case SocketMessageType.References:
        msg.references = message.references
        break
      case SocketMessageType.Chunk:
        msg.content += message.content
        msg.isLoading = false
        setIsLoading(false)
        setTimeout(() => {
          (listRefs.current[msgIndex] || messagesEndRef?.current)?.scrollIntoView({ block: "end" });
        }, 0);
        break
      case SocketMessageType.StartTask:
        msg.isLoading = true
        msg.content = ''
        msg.references = []
        break
      case SocketMessageType.Error:
        setShowToast(true);
        setToastMessage(buildErrorMessage({ data: message.content || [] }));
        setToastSeverity('error');
        setIsLoading(false)
        return
      default:
        // eslint-disable-next-line no-console
        console.warn('unknown message type', type)
        return
    }
    if (msgIndex < 0) {
      setChatHistory(prevState => [...prevState, msg])
    } else {
      setChatHistory(prevState => {
        prevState[msgIndex] = msg
        return [...prevState]
      })
    }
  }, [getMessage, setChatHistory])

  const { emit } = useSocket('datasources_predict', handleSocketEvent)

  const onClearChat = useCallback(
    () => {
      setChatHistory([]);
      chatInput.current?.reset();
    },
    [setChatHistory],
  );


  const onCloseToast = useCallback(
    () => {
      setShowToast(false);
    },
    [],
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


  const onDeleteAnswer = useCallback(
    (id) => () => {
      setOpenAlert(true);
      setMessageIdToDelete(id);
      chatInput.current?.reset();
    },
    [],
  );

  const onPredict = useCallback(async question => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ block: "end" });
    }, 0);
    setIsLoading(true);
    setChatHistory((prevMessages) => {
      return [...prevMessages, {
        id: new Date().getTime(),
        role: ROLES.User,
        name,
        content: question,
      }]
    })
    const payload = generatePayload(question, context, chatHistory, chatSettings)
    emit({ ...payload, project_id: currentProjectId, version_id: versionId })
  }, [
    chatHistory,
    setChatHistory,
    context,
    chatSettings,
    name,
    currentProjectId,
    versionId,
    emit,
  ])

  const onRegenerateAnswer = useCallback(id => async () => {
    setIsLoading(true);
    chatInput.current?.reset();
    const questionIndex = chatHistory.findIndex(item => item.id === id) - 1;
    const theQuestion = chatHistory[questionIndex].content;
    const leftChatHistory = chatHistory.slice(0, questionIndex);
    const payload = generatePayload(theQuestion, context, leftChatHistory, chatSettings)

    emit({ ...payload, project_id: currentProjectId, version_id: versionId, message_id: id })
  }, [
    chatHistory,
    context,
    chatSettings,
    currentProjectId,
    versionId,
    emit,
  ]);

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
    [messageIdToDelete, onCloseAlert, setChatHistory],
  );

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{
          position: 'absolute',
          top: '-50px',
          right: '0px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: '8px'
        }}>
          {!showAdvancedSettings &&
            <ActionButton sx={{ height: '28px', width: '28px' }} onClick={onClickAdvancedSettings}>
              <SettingIcon sx={{ fontSize: 16 }} />
            </ActionButton>}
          <ActionButton
            aria-label="clear the chat"
            disabled={isLoading}
            onClick={onClearChat}
            sx={{ height: '28px', width: '28px' }}
          >
            <ClearIcon sx={{ fontSize: 16 }} />
          </ActionButton>
        </Box>

        {!showAdvancedSettings &&
          <ChatSettings
            selectedEmbeddingModel={embeddingModelValue}
            onChangeEmbeddingModel={(integrationUid, modelName, integrationName) => {
              onChangeChatSettings('embedding_model',
                {
                  integration_uid: integrationUid,
                  model_name: modelName,
                  integration_name: integrationName,
                });
            }}
            selectedChatModel={chatModelValue}
            onChangeChatModel={(integrationUid, modelName, integrationName) => {
              onChangeChatSettings('chat_model',
                {
                  integration_uid: integrationUid,
                  model_name: modelName,
                  integration_name: integrationName,
                });
            }}
          />
        }
        {
          showAdvancedSettings && isSmallWindow &&
          <Box sx={{ marginY: '24px', paddingX: '2px' }}>
            <AdvancedChatSettings
              selectedEmbeddingModel={embeddingModelValue}
              onChangeEmbeddingModel={(integrationUid, modelName, integrationName) => {
                onChangeChatSettings('embedding_model',
                  {
                    integration_uid: integrationUid,
                    model_name: modelName,
                    integration_name: integrationName,
                  });
              }}
              selectedChatModel={chatModelValue}
              onChangeChatModel={(integrationUid, modelName, integrationName) => {
                onChangeChatSettings('chat_model',
                  {
                    integration_uid: integrationUid,
                    model_name: modelName,
                    integration_name: integrationName,
                  });
              }}
              top_k={chatSettings?.top_k}
              onChangeTopK={(value) => onChangeChatSettings('top_k', value)}
              temperature={chatSettings?.temperature}
              onChangeTemperature={(value) => onChangeChatSettings('temperature', value)}
              top_p={chatSettings?.top_p}
              onChangeTopP={(value) => onChangeChatSettings('top_p', value)}
              max_length={chatSettings?.max_length}
              onChangeMaxLength={(value) => onChangeChatSettings('max_length', value)}
              onCloseAdvancedSettings={onCloseAdvancedSettings}
              fetch_k={chatSettings?.fetch_k}
              onChangeFetchK={(value) => onChangeChatSettings('fetch_k', value)}
              page_top_k={chatSettings?.page_top_k}
              onChangePageTopK={(value) => onChangeChatSettings('page_top_k', value)}
              cut_off_score={chatSettings?.cut_off_score}
              onChangeCutoffScore={(value) => onChangeChatSettings('cut_off_score', value)}
            />
          </Box>
        }

        <ChatBoxContainer
          role="presentation"
          sx={{ marginTop: '24px' }}
        >
          <ChatBodyContainer>
            <MessageList sx={{ height: '468px' }}>
              {
                chatHistory.map((message, index) => {
                  switch (message.role) {
                    case ROLES.User:
                      return <UserMessage
                        key={message.id}
                        ref={(ref) => (listRefs.current[index] = ref)}
                        content={message.content}
                        onCopy={onCopyToClipboard(message.id)}
                        onDelete={onDeleteAnswer(message.id)}
                      />
                    case ROLES.Assistant:
                      return <AIAnswer
                        key={message.id}
                        answer={message.content}
                        ref={(ref) => (listRefs.current[index] = ref)}
                        references={message.references}
                        isLoading={Boolean(message.isLoading)}
                        onCopy={onCopyToClipboard(message.id)}
                        onDelete={onDeleteAnswer(message.id)}
                        onRegenerate={onRegenerateAnswer(message.id)}
                        shouldDisableRegenerate={isLoading}
                      />
                    default:
                      // eslint-disable-next-line no-console
                      console.error('Unknown message role', message.role)
                      return ''
                  }
                })
              }
              <div ref={messagesEndRef} />
            </MessageList>
            <ChatInput
              ref={chatInput}
              onSend={onPredict}
              isLoading={isLoading}
              disabledSend={isLoading || !chatSettings?.chat_model?.model_name || !chatSettings?.embedding_model?.model_name}
              shouldHandleEnter
            />
          </ChatBodyContainer>
        </ChatBoxContainer>
      </Box>
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

export default ChatPanel;