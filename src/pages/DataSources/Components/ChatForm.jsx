/* eslint-disable */
import {
  DataSourceChatBoxMode,
  PROMPT_PAYLOAD_KEY
} from '@/common/constants';
import { actions } from '@/slices/prompts';
import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { MuiMarkdown } from 'mui-markdown';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertDialog from '@/components/AlertDialog';
import ClearIcon from '@/components/Icons/ClearIcon';
import CopyIcon from '@/components/Icons/CopyIcon';
import Toast from '@/components/Toast';
import AIAnswer from '@/components/ChatBox/AIAnswer';
import {
  ActionButton,
  ActionContainer,
  ChatBodyContainer,
  ChatBoxContainer,
  CompletionContainer,
  Message,
  MessageList,
  RunButton
} from '@/components/ChatBox/StyledComponents';
import UserMessage from '@/components/ChatBox/UserMessage';
import styled from '@emotion/styled';
import GroupedButton from '@/components/GroupedButton';
import ChatSettings from './ChatSettings';
import { genModelSelectValue } from '@/common/promptApiUtils';
import SettingIcon from '@/components/Icons/SettingIcon';
import ChatInput from '@/components/ChatBox/ChatInput';
import { useTheme } from '@emotion/react';
import GenerateFile from './GenerateFile';
import AdvanceChatSettings from './AdvanceChatSettings';
import SearchSettings from './SearchSettings';
import DuplicateSettings from './DuplicateSettings';
import { useIsSmallWindow } from '@/pages/hooks';

const CompletionHeader = styled('div')(() => ({
  display: 'block',
  textAlign: 'end'
}));

const ChatForm = ({
  type = DataSourceChatBoxMode.Chat,
  onClickAdvancedSettings,
  showAdvancedSettings,
  onCloseAdvanceSettings,
  chatSettings,
  onChangeChatSettings,
  searchSettings,
  onChangeSearchSettings,
  duplicateSettings,
  onChangeDuplicateSettings,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { name } = useSelector(state => state.user)
  const [mode, setMode] = useState(type);
  const [chatHistory, setChatHistory] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('info')
  const [openAlert, setOpenAlert] = useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState('');

  const isLoading = false;

  const chatModelValue = useMemo(() =>
    (chatSettings?.chat_model?.integration_uid && chatSettings?.chat_model?.model_name ? genModelSelectValue(chatSettings?.chat_model?.integration_uid, chatSettings?.chat_model?.model_name, chatSettings?.chat_model?.integration_name) : '')
    , [chatSettings?.chat_model?.integration_name, chatSettings?.chat_model?.integration_uid, chatSettings?.chat_model?.model_name]);

  const embeddingModelValue = useMemo(() =>
    (chatSettings?.embedding_model?.integration_uid && chatSettings?.embedding_model?.model_name ? genModelSelectValue(chatSettings?.embedding_model?.integration_uid, chatSettings?.embedding_model?.model_name, chatSettings?.embedding_model?.integration_name) : '')
    , [chatSettings?.embedding_model?.integration_name, chatSettings?.embedding_model?.integration_uid, chatSettings?.embedding_model?.model_name]);

  const duplicateEmbeddingModelValue = useMemo(() =>
    (duplicateSettings?.embedding_model?.integration_uid && duplicateSettings?.embedding_model?.model_name ? genModelSelectValue(duplicateSettings?.embedding_model?.integration_uid, duplicateSettings?.embedding_model?.model_name, duplicateSettings?.embedding_model?.integration_name) : '')
    , [duplicateSettings?.embedding_model?.integration_name, duplicateSettings?.embedding_model?.integration_uid, duplicateSettings?.embedding_model?.model_name]);

  const searchEmbeddingModelValue = useMemo(() =>
    (searchSettings?.embedding_model?.integration_uid && searchSettings?.embedding_model?.model_name ? genModelSelectValue(searchSettings?.embedding_model?.integration_uid, searchSettings?.embedding_model?.model_name, searchSettings?.embedding_model?.integration_name) : '')
    , [searchSettings?.embedding_model?.integration_name, searchSettings?.embedding_model?.integration_uid, searchSettings?.embedding_model?.model_name]);

  const chatInput = useRef(null);
  const searchInput = useRef(null);
  const { isSmallWindow } = useIsSmallWindow();

  const onSelectChatMode = useCallback(
    (e) => {
      const chatMode = e?.target?.value
      if (mode !== chatMode) {
        setMode(chatMode);
        if (chatMode === DataSourceChatBoxMode.Completion) {
          chatInput.current?.reset();
        }
        dispatch(actions.updateCurrentPromptData({
          key: PROMPT_PAYLOAD_KEY.type,
          data: chatMode
        }));
      }
    },
    [dispatch, mode],
  );

  const onSearch = useCallback(
    async (query) => {
      setSearchResult(query);
      //askAlita
    },
    []);

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
      //askAlita
      const payload = {
        chatHistory,
        embeddingModelValue,
        chatInput,
        chatSettings
      }
      console.log('payload', payload)
    },
    [name]);

  const onRunDuplicate = useCallback(
    () => {
      // to duplicate
    },
    [],
  )

  const onClearChat = useCallback(
    () => {
      setChatHistory([]);
      chatInput.current?.reset();
    },
    [],
  );

  const onClearSearch = useCallback(
    () => {
      setSearchResult('');
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

  const onCopyCompletion = useCallback(() => {
    navigator.clipboard.writeText(searchResult);
  }, [searchResult])

  const onDeleteAnswer = useCallback(
    (id) => () => {
      setOpenAlert(true);
      setMessageIdToDelete(id);
      chatInput.current?.reset();
    },
    [],
  );

  const onRegenerateAnswer = useCallback(
    (id) => () => {
      setChatHistory((prevMessages) => {
        return prevMessages.map(
          message => message.id !== id ?
            message
            :
            ({ ...message, content: 'regenerating...' }));
      });
      //askAlita
    },
    [],
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

  const onGenerateFile = useCallback(
    () => {
      //Generate file
    },
    [],
  )

  useEffect(() => {
    if (!mode && type) {
      setMode(type);
    }
  }, [mode, type]);

  const buttonItems = useMemo(() =>
    Object.entries(DataSourceChatBoxMode).map(
      ([label, value]) => ({ label, value })
    ), []);
  
  return (
    <>
      <Box gap={'32px'} sx={{ display: 'flex', flexDirection: isSmallWindow ? 'column' : 'row' }}>
        <Box sx={{ flex: 4.5 }}>
          <ActionContainer>
            <GroupedButton
              value={mode}
              onChange={onSelectChatMode}
              buttonItems={buttonItems}
            />
            {
              mode === DataSourceChatBoxMode.Chat &&
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '8px' }}>
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
            }
            {
              mode === DataSourceChatBoxMode.Duplicate &&
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '8px' }}>
                <RunButton disabled={isLoading} onClick={onRunDuplicate}>
                  Run
                </RunButton>
              </Box>
            }
          </ActionContainer>
          {
            mode === DataSourceChatBoxMode.Search &&
            <ChatInput
              ref={searchInput}
              onSend={onSearch}
              isLoading={isLoading}
              disabledSend={isLoading}
              shouldHandleEnter
              sx={{
                borderRadius: '0rem 0rem 0rem 0rem',
                borderTop: '0px',
                background: 'transparent',
                borderBottom: `1px solid ${theme.palette.border.lines}`,
                marginTop: '24px',
              }}
              placeholder='Enter your search query'
            />
          }
          {!showAdvancedSettings && mode === DataSourceChatBoxMode.Chat &&
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
            showAdvancedSettings && isSmallWindow && mode === DataSourceChatBoxMode.Chat &&
            <Box sx={{ marginY: '24px', paddingX: '2px' }}>
              <AdvanceChatSettings
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
                max_tokens={chatSettings?.max_tokens}
                onChangeMaxTokens={(value) => onChangeChatSettings('max_tokens', value)}
                mode={mode}
                onCloseAdvanceSettings={onCloseAdvanceSettings}
              />
            </Box>
          }
          {mode === DataSourceChatBoxMode.Search &&
            <SearchSettings
              selectedEmbeddingModel={searchEmbeddingModelValue}
              onChangeEmbeddingModel={(integrationUid, modelName, integrationName) => {
                onChangeSearchSettings(
                  'embedding_model',
                  {
                    integration_uid: integrationUid,
                    model_name: modelName,
                    integration_name: integrationName,
                  });
              }}
              top_k={searchSettings?.top_k}
              onChangeTopK={(value) => onChangeSearchSettings('top_k', value)}
              cutoff_score={searchSettings?.cutoff_score}
              onChangeCutoffScore={(value) => onChangeSearchSettings('cutoff_score', value)}
            />
          }
          {mode === DataSourceChatBoxMode.Duplicate &&
            <DuplicateSettings
              selectedEmbeddingModel={duplicateEmbeddingModelValue}
              onChangeEmbeddingModel={(integrationUid, modelName, integrationName) => {
                onChangeDuplicateSettings('embedding_model',
                  {
                    integration_uid: integrationUid,
                    model_name: modelName,
                    integration_name: integrationName,
                  });
              }}
              generateFile={duplicateSettings?.generate_file}
              onChangeGenerateFile={(value) => onChangeDuplicateSettings('generate_file', value)}
              cutoff_score={duplicateSettings?.cutoff_score}
              onChangeCutoffScore={(value) => onChangeDuplicateSettings('cutoff_score', value)}
            />
          }
          {
            duplicateSettings.generate_file &&
            mode === DataSourceChatBoxMode.Duplicate &&
            <GenerateFile onGenerateFile={onGenerateFile} />
          }
          <ChatBoxContainer
            role="presentation"
            sx={{ marginTop: '24px' }}
          >
            {
              mode !== DataSourceChatBoxMode.Chat &&
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: ' flex-end',
                alignSelf: 'stretch',
                marginBottom: '14px'
              }}>
                <Typography variant='labelSmall' color='text.default'>
                  Output
                </Typography>
                <ActionButton
                  aria-label="clear the chat"
                  disabled={isLoading}
                  onClick={onClearSearch}
                >
                  <ClearIcon sx={{ fontSize: 16 }} />
                </ActionButton>
              </Box>
            }
            <ChatBodyContainer>
              {
                mode === DataSourceChatBoxMode.Chat
                  ?
                  <>
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
                      disabledSend={isLoading || !chatSettings?.chat_model.model_name}
                      shouldHandleEnter
                    />
                  </>
                  :
                  <CompletionContainer>
                    <Message>
                      <CompletionHeader>
                        <IconButton disabled={!searchResult} onClick={onCopyCompletion}>
                          <CopyIcon sx={{ fontSize: '1.13rem' }} />
                        </IconButton>
                      </CompletionHeader>
                      <MuiMarkdown>
                        {searchResult}
                      </MuiMarkdown>
                    </Message>
                  </CompletionContainer>
              }
            </ChatBodyContainer>
          </ChatBoxContainer>
        </Box>
        {
          showAdvancedSettings && !isSmallWindow && mode === DataSourceChatBoxMode.Chat &&
          <Box sx={{ flex: 3 }}>
            <AdvanceChatSettings
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
              max_tokens={chatSettings?.max_tokens}
              onChangeMaxTokens={(value) => onChangeChatSettings('max_tokens', value)}
              mode={mode}
              onCloseAdvanceSettings={onCloseAdvanceSettings}
            />
          </Box>
        }
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

ChatForm.propTypes = {
}


export default ChatForm;