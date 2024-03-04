/* eslint-disable react/jsx-no-bind */
import {
  DataSourceChatBoxMode,
} from '@/common/constants';
import { Grid } from '@mui/material';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { ActionContainer } from '@/components/ChatBox/StyledComponents';
import GroupedButton from '@/components/GroupedButton';
import { genModelSelectValue } from '@/common/promptApiUtils';
import AdvanceChatSettings from './AdvanceChatSettings';
import { useIsSmallWindow } from '@/pages/hooks';
import ChatPanel from './ChatPanel';
import SearchPanel from './SearchPanel';
import DeduplicatePanel from './DeduplicatePanel';


const DatasourceOperationPanel = ({
  type = DataSourceChatBoxMode.Chat,
  onClickAdvancedSettings,
  showAdvancedSettings,
  onCloseAdvanceSettings,
  chatSettings,
  onChangeChatSettings,
  searchSettings,
  onChangeSearchSettings,
  deduplicateSettings,
  onChangeDeduplicateSettings,
  versionId,
  context,
}) => {
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
        if (chatMode !== DataSourceChatBoxMode.Chat && showAdvancedSettings) {
          onCloseAdvanceSettings();
        }
      }
    },
    [mode, onCloseAdvanceSettings, showAdvancedSettings],
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
    <Grid container columnSpacing={'32px'}>
      <Grid item xs={12} lg={ showAdvancedSettings ? 7.2 : 12 }>
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
            context={context}
          />
        }
        {
          mode === DataSourceChatBoxMode.Search &&
          <SearchPanel
            searchSettings={searchSettings}
            onChangeSearchSettings={onChangeSearchSettings}
            versionId={versionId}
          />
        }
        {mode === DataSourceChatBoxMode.Deduplicate &&
          <DeduplicatePanel
            deduplicateSettings={deduplicateSettings}
            onChangeDeduplicateSettings={onChangeDeduplicateSettings}
            versionId={versionId}
          />
        }
      </Grid>
      {!isSmallWindow && showAdvancedSettings && <Grid item xs={0} lg={showAdvancedSettings ? 4.8 : 0}>
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
          max_length={chatSettings?.max_length}
          onChangeMaxLength={(value) => onChangeChatSettings('max_length', value)}
          mode={mode}
          onCloseAdvanceSettings={onCloseAdvanceSettings}
        />
      </Grid>}
    </Grid>
  )
};

export default DatasourceOperationPanel;