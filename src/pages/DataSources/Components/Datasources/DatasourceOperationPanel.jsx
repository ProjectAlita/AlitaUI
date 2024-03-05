/* eslint-disable react/jsx-no-bind */
import {
  DataSourceChatBoxMode,
} from '@/common/constants';
import { Grid } from '@mui/material';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { ActionContainer } from '@/components/ChatBox/StyledComponents';
import GroupedButton from '@/components/GroupedButton';
import { genModelSelectValue } from '@/common/promptApiUtils';
import AdvancedChatSettings from './AdvancedChatSettings';
import { useIsSmallWindow } from '@/pages/hooks';
import ChatPanel from './ChatPanel';
import SearchPanel from './SearchPanel';
import DeduplicatePanel from './DeduplicatePanel';
import AdvancedSearchSettings from './AdvancedSearchSettings';

const DatasourceOperationPanel = ({
  type = DataSourceChatBoxMode.Chat,

  onClickAdvancedChatSettings,
  showAdvancedChatSettings,
  onCloseAdvancedChatSettings,
  chatSettings,
  onChangeChatSettings,

  onClickAdvancedSearchSettings,
  showAdvancedSearchSettings,
  onCloseAdvancedSearchSettings,
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

  const searchEmbeddingModelValue = useMemo(() =>
    (searchSettings?.embedding_model?.integration_uid && searchSettings?.embedding_model?.model_name ? genModelSelectValue(searchSettings?.embedding_model?.integration_uid, searchSettings?.embedding_model?.model_name, searchSettings?.embedding_model?.integration_name) : '')
    , [searchSettings?.embedding_model?.integration_name, searchSettings?.embedding_model?.integration_uid, searchSettings?.embedding_model?.model_name]);

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
        if (chatMode !== DataSourceChatBoxMode.Chat && showAdvancedChatSettings) {
          onCloseAdvancedChatSettings();
        } else if (chatMode !== DataSourceChatBoxMode.Search && showAdvancedSearchSettings) {
          onCloseAdvancedSearchSettings();
        }
      }
    },
    [mode, onCloseAdvancedChatSettings, onCloseAdvancedSearchSettings, showAdvancedChatSettings, showAdvancedSearchSettings],
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
      <Grid item xs={12} lg={showAdvancedChatSettings || showAdvancedSearchSettings ? 7.2 : 12}>
        <ActionContainer>
          <GroupedButton
            value={mode}
            onChange={onSelectChatMode}
            buttonItems={buttonItems}
          />
        </ActionContainer>
        {mode === DataSourceChatBoxMode.Chat &&
          <ChatPanel
            onClickAdvancedSettings={onClickAdvancedChatSettings}
            showAdvancedSettings={showAdvancedChatSettings}
            onCloseAdvancedSettings={onCloseAdvancedChatSettings}
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
            showAdvancedSettings={showAdvancedSearchSettings}
            onClickAdvancedSettings={onClickAdvancedSearchSettings}
            onCloseAdvancedSettings={onCloseAdvancedSearchSettings}
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
      {!isSmallWindow && showAdvancedChatSettings && <Grid item xs={0} lg={showAdvancedChatSettings ? 4.8 : 0}>
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
          mode={mode}
          onCloseAdvancedSettings={onCloseAdvancedChatSettings}
          fetch_k={chatSettings?.fetch_k}
          onChangeFetchK={(value) => onChangeChatSettings('fetch_k', value)}
          page_top_k={chatSettings?.page_top_k}
          onChangePageTopK={(value) => onChangeChatSettings('page_top_k', value)}
          cut_off_score={chatSettings?.cut_off_score}
          onChangeCutoffScore={(value) => onChangeChatSettings('cut_off_score', value)}
        />
      </Grid>}
      {!isSmallWindow && showAdvancedSearchSettings && <Grid item xs={0} lg={showAdvancedSearchSettings ? 4.8 : 0}>
        <AdvancedSearchSettings
          onCloseAdvancedSettings={onCloseAdvancedSearchSettings}
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
          cut_off_score={searchSettings?.cut_off_score}
          onChangeCutoffScore={(value) => onChangeSearchSettings('cut_off_score', value)}
          fetch_k={searchSettings?.fetch_k}
          onChangeFetchK={(value) => onChangeSearchSettings('fetch_k', value)}
          page_top_k={searchSettings?.page_top_k}
          onChangePageTopK={(value) => onChangeSearchSettings('page_top_k', value)}
          str_content={searchSettings?.str_content}
          onChangeStrContent={(event, value) => onChangeSearchSettings('str_content', value)}
        />
      </Grid>}
    </Grid>
  )
};

export default DatasourceOperationPanel;