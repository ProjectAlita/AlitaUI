/* eslint-disable react/jsx-no-bind */
import {
  DataSourceChatBoxMode,
  DEFAULT_CUT_OFF_SCORE,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_K,
  DEFAULT_TOP_P,
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
import { ChatSettings } from './ChatSettings';
import { genModelSelectValue } from '@/common/promptApiUtils';
import SettingIcon from '@/components/Icons/SettingIcon';
import ChatInput from '@/components/ChatBox/ChatInput';
import { useTheme } from '@emotion/react';
import GenerateFile from './GenerateFile';

const CompletionHeader = styled('div')(() => ({
  display: 'block',
  textAlign: 'end'
}));

const ChatForm = ({
  type = DataSourceChatBoxMode.Chat,
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


  const [top_k, setTopK] = useState(DEFAULT_TOP_K);
  const [temperature, setTemperature] = useState(DEFAULT_TEMPERATURE);
  const [cutoff_score, setCutoffScore] = useState(DEFAULT_CUT_OFF_SCORE)
  const [top_p, setTopP] = useState(DEFAULT_TOP_P)
  const [max_tokens, setMaxTokens] = useState(DEFAULT_MAX_TOKENS)
  const [applyMaxTokens, setApplyMaxTokens] = useState(false)
  const [shouldGenerateFile, setShouldGenerateFile] = useState(false)
  const [model, setModel] = useState();
  const modelValue = useMemo(() =>
    (model?.integration_uid && model?.model_name ? genModelSelectValue(model?.integration_uid, model?.model_name, model?.integration_name) : '')
    , [model?.integration_name, model?.integration_uid, model?.model_name]);
  const chatInput = useRef(null);
  const searchInput = useRef(null);

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showGenerateFile, setShowGenerateFile] = useState(false);
  const onClickAdvancedSettings = useCallback(
    () => {
      setShowAdvancedSettings(prev => !prev);
    },
    [],
  )

  const onSelectChatMode = useCallback(
    (chatMode) => () => {
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
    },
    [name]);

  const onRunDuplicate = useCallback(
    () => {
      //
      if (shouldGenerateFile) {
        setShowGenerateFile(true);
      }
    },
    [shouldGenerateFile],
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

  const groupedButtonItems = useMemo(() => ([
    {
      title: 'Chat',
      selected: mode === DataSourceChatBoxMode.Chat,
      onClick: onSelectChatMode(DataSourceChatBoxMode.Chat),
    },
    {
      title: 'Search',
      selected: mode === DataSourceChatBoxMode.Search,
      onClick: onSelectChatMode(DataSourceChatBoxMode.Search),
    },
    {
      title: 'Duplicate',
      selected: mode === DataSourceChatBoxMode.Duplicate,
      onClick: onSelectChatMode(DataSourceChatBoxMode.Duplicate),
    }
  ]), [mode, onSelectChatMode]);

  return (
    <>
      <ActionContainer>
        <GroupedButton buttonItems={groupedButtonItems} />
        {
          mode === DataSourceChatBoxMode.Chat &&
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '8px' }}>
            <ActionButton sx={{ height: '28px', width: '28px' }} onClick={onClickAdvancedSettings}>
              <SettingIcon sx={{ fontSize: 16 }} />
            </ActionButton>
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
      <ChatSettings
        showAdvancedSettings={showAdvancedSettings}
        selectedModel={modelValue}
        top_k={top_k}
        onChangeTopK={setTopK}
        temperature={temperature}
        onChangeTemperature={setTemperature}
        cutoff_score={cutoff_score}
        onChangeCutoffScore={setCutoffScore}
        top_p={top_p}
        onChangeTopP={setTopP}
        max_tokens={max_tokens}
        onChangeMaxTokens={setMaxTokens}
        applyMaxTokens={applyMaxTokens}
        onChangeApplyMaxTokens={setApplyMaxTokens}
        onChangeModel={(integrationUid, modelName, integrationName) => {
          setModel(
            {
              integration_uid: integrationUid,
              model_name: modelName,
              integration_name: integrationName,
            });
        }}
        shouldGenerateFile={shouldGenerateFile}
        onChangeGenerateFile={setShouldGenerateFile}
        mode={mode}
      />
      {
        mode === DataSourceChatBoxMode.Duplicate && showGenerateFile &&
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
                <MessageList>
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
                  disabledSend={isLoading || !model?.model_name}
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