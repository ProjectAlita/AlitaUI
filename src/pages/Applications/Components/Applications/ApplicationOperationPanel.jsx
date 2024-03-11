/* eslint-disable react/jsx-no-bind */
import {
  DataSourceChatBoxMode,
} from '@/common/constants';
import { genModelSelectValue } from '@/common/promptApiUtils';
import { useIsSmallWindow } from '@/pages/hooks';
import { Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import AdvancedChatSettings from './AdvancedChatSettings';
import ChatPanel from './ChatPanel';

const ApplicationOperationPanel = ({
  type = DataSourceChatBoxMode.Chat,

  onClickAdvancedChatSettings,
  showAdvancedChatSettings,
  onCloseAdvancedChatSettings,
  chatSettings,
  onChangeChatSettings,
  chatHistory,
  setChatHistory,

  showAdvancedSearchSettings,

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

  const { isSmallWindow } = useIsSmallWindow();

  

  useEffect(() => {
    if (!mode && type) {
      setMode(type);
    }
  }, [mode, type]);

  return (
    <Grid container columnSpacing={'32px'}>
      <Grid item xs={12} lg={showAdvancedChatSettings || showAdvancedSearchSettings ? 7.2 : 12}>
        <ChatPanel
          onClickAdvancedSettings={onClickAdvancedChatSettings}
          showAdvancedSettings={showAdvancedChatSettings}
          onCloseAdvancedSettings={onCloseAdvancedChatSettings}
          chatSettings={chatSettings}
          onChangeChatSettings={onChangeChatSettings}
          versionId={versionId}
          context={context}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
        />
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
    </Grid>
  )
};

export default ApplicationOperationPanel;