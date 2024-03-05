/* eslint-disable react/jsx-no-bind */
import { ROLES } from '@/common/constants';
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
import {useIsSmallWindow, useProjectId} from '@/pages/hooks';
import { usePredictMutation } from "@/api/datasources.js";

const ChatPanel = ({
  onClickAdvancedSettings,
  showAdvancedSettings,
  onCloseAdvancedSettings,
  chatSettings,
  onChangeChatSettings,
  versionId,
  context,
}) => {
  const { name } = useSelector(state => state.user)
  const currentProjectId = useProjectId();
  const [chatHistory, setChatHistory] = useState([]);
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



  const [predict] = usePredictMutation()

  const onClickSend = useCallback(
    async (question) => {
      setIsLoading(true);
      setChatHistory((prevMessages) => {
        return [...prevMessages, {
          id: new Date().getTime(),
          role: 'user',
          name,
          content: question,
        }]
      });
      const payload = {
        // "mock_data": true,
        "input": question,
        "chat_history": chatHistory,
        "embedding_uid": chatSettings.embedding_model?.integration_uid,
        "embedding_model": chatSettings.embedding_model?.model_name,
        "ai_uid": chatSettings.chat_model?.integration_uid,
        "ai_model": chatSettings.chat_model?.model_name,
        "chat_settings": {
          "top_k": chatSettings.top_k,
          "temperature": chatSettings.temperature,
          "top_p": chatSettings.top_p,
          "maximum_length": chatSettings.max_tokens,
          "fetch_k": chatSettings.fetch_k,
          "page_top_k": chatSettings.page_top_k,
          "cut_off_score": chatSettings.cut_off_score,
        },
        context: context
      }
      //askAlita
      const { data } = await predict({ projectId: currentProjectId, versionId: versionId, ...payload })
      if (data) {
        const responseMessage = data?.result?.response
        const referencies = data?.result?.references
        setChatHistory((prevMessages) => {
          return [...prevMessages, {
            id: new Date().getTime(),
            role: ROLES.Assistant,
            content: responseMessage + '\n\n\n\nrefs: \n\n' + referencies.join('\n\n'),
          }]
        });
      }
      setIsLoading(false);
    },
    [
      chatHistory,
      chatSettings.chat_model?.integration_uid,
      chatSettings.chat_model?.model_name,
      context,
      chatSettings.embedding_model?.integration_uid,
      chatSettings.embedding_model?.model_name,
      chatSettings.max_tokens,
      chatSettings.temperature,
      chatSettings.top_k,
      chatSettings.top_p,
      chatSettings.fetch_k,
      chatSettings.page_top_k,
      chatSettings.cut_off_score,
      name,
      predict,
      currentProjectId,
      versionId]);


  const onClearChat = useCallback(
    () => {
      setChatHistory([]);
      chatInput.current?.reset();
    },
    [],
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

  const onRegenerateAnswer = useCallback(
    (id) => async () => {
      setIsLoading(true);
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
      //askAlita
      const payload = {
        // "mock_data": true,
        "input": theQuestion,
        "chat_history": leftChatHistory,
        "embedding_uid": chatSettings.embedding_model?.integration_uid,
        "embedding_model": chatSettings.embedding_model?.model_name,
        "ai_uid": chatSettings.chat_model?.integration_uid,
        "ai_model": chatSettings.chat_model?.model_name,
        "chat_settings": {
          "top_k": chatSettings.top_k,
          "temperature": chatSettings.temperature,
          "top_p": chatSettings.top_p,
          "maximum_length": chatSettings.max_tokens
        },
        context: context
      }
      //askAlita
      const { data } = await predict({ projectId: currentProjectId, versionId: versionId, ...payload })
      if (data) {
        const responseMessage = data?.result?.response
        const referencies = data?.result?.references
        setChatHistory((prevMessages) => {
          return prevMessages.map(
            message => message.id !== id ?
              message
              :
              ({ ...message, content: responseMessage + '\n\n\n\nrefs: \n\n' + referencies.join('\n\n') }));
        });
      }
      setIsLoading(false);
    },
    [
      chatHistory, 
      chatSettings.chat_model?.integration_uid, 
      chatSettings.chat_model?.model_name, 
      context, 
      chatSettings.embedding_model?.integration_uid, 
      chatSettings.embedding_model?.model_name, 
      chatSettings.max_tokens, 
      chatSettings.temperature, 
      chatSettings.top_k, 
      chatSettings.top_p, 
      predict,
      currentProjectId, 
      versionId],
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

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: '-50px', right: '0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '8px' }}>
          {!showAdvancedSettings && <ActionButton sx={{ height: '28px', width: '28px' }} onClick={onClickAdvancedSettings}>
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
                chatHistory.map((message) => {
                  return message.role === 'user' ?
                    <UserMessage
                      key={message.id}
                      content={message.content}
                      onCopy={onCopyToClipboard(message.id)}
                      onDelete={onDeleteAnswer(message.id)}
                    />
                    :
                    <AIAnswer
                      key={message.id}
                      answer={message.content}
                      onCopy={onCopyToClipboard(message.id)}
                      onDelete={onDeleteAnswer(message.id)}
                      onRegenerate={onRegenerateAnswer(message.id)}
                    />
                })
              }
            </MessageList>
            <ChatInput
              ref={chatInput}
              onSend={onClickSend}
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