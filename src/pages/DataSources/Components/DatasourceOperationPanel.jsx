/* eslint-disable react/jsx-no-bind */
import {
  DataSourceChatBoxMode,
  PROMPT_PAYLOAD_KEY} from '@/common/constants';
import { actions } from '@/slices/prompts';
import { Box } from '@mui/material';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ActionContainer} from '@/components/ChatBox/StyledComponents';
import GroupedButton from '@/components/GroupedButton';
import { genModelSelectValue } from '@/common/promptApiUtils';
import AdvanceChatSettings from './AdvanceChatSettings';
import { useIsSmallWindow } from '@/pages/hooks';
import ChatPanel from './ChatPanel';
import SearchPanel from './SearchPanel';
import DuplicatePanel from './DuplicatePanel';


const DatasourceOperationPanel = ({
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
  versionId
}) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState(type);

  const chatModelValue = useMemo(() =>
    (chatSettings?.chat_model?.integration_uid && chatSettings?.chat_model?.model_name ? genModelSelectValue(chatSettings?.chat_model?.integration_uid, chatSettings?.chat_model?.model_name, chatSettings?.chat_model?.integration_name) : '')
    , [chatSettings?.chat_model?.integration_name, chatSettings?.chat_model?.integration_uid, chatSettings?.chat_model?.model_name]);

  const embeddingModelValue = useMemo(() =>
    (chatSettings?.embedding_model?.integration_uid && chatSettings?.embedding_model?.model_name ? genModelSelectValue(chatSettings?.embedding_model?.integration_uid, chatSettings?.embedding_model?.model_name, chatSettings?.embedding_model?.integration_name) : '')
    , [chatSettings?.embedding_model?.integration_name, chatSettings?.embedding_model?.integration_uid, chatSettings?.embedding_model?.model_name]);

  const chatInput = useRef(null);
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
          </ActionContainer>
          {mode === DataSourceChatBoxMode.Chat &&
            <ChatPanel
              onClickAdvancedSettings={onClickAdvancedSettings}
              showAdvancedSettings={showAdvancedSettings}
              onCloseAdvanceSettings={onCloseAdvanceSettings}
              chatSettings={chatSettings}
              onChangeChatSettings={onChangeChatSettings}
              versionId={versionId}
            />
          }
          {
            mode === DataSourceChatBoxMode.Search &&
            <SearchPanel
              searchSettings={searchSettings}
              onChangeSearchSettings={onChangeSearchSettings}
            />
          }
          {mode === DataSourceChatBoxMode.Duplicate &&
            <DuplicatePanel
              duplicateSettings={duplicateSettings}
              onChangeDuplicateSettings={onChangeDuplicateSettings}
            />
          }
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
    </>
  )
};

export default DatasourceOperationPanel;