/* eslint-disable react/jsx-no-bind */
import {
  DataSourceChatBoxMode,
} from '@/common/constants';
import {Grid} from '@mui/material';
import {useCallback, useEffect, useState, useMemo} from 'react';
import {ActionContainer} from '@/components/ChatBox/StyledComponents';
import GroupedButton from '@/components/GroupedButton';
import AdvancedChatSettings from './AdvancedChatSettings';
import {useIsSmallWindow} from '@/pages/hooks';
import ChatPanel from './ChatPanel';
import SearchPanel from './SearchPanel';
import DeduplicatePanel from './DeduplicatePanel';
import AdvancedSearchSettings from './AdvancedSearchSettings';

const DatasourceOperationPanel = ({
  type = DataSourceChatBoxMode.Chat,
  
  dataSourceSettings,
  onChangeDataSourceSettings,
  
  onClickAdvancedChatSettings,
  showAdvancedChatSettings,
  onCloseAdvancedChatSettings,
  isFullScreenChat,
  setIsFullScreenChat,
  chatHistory,
  setChatHistory,
  
  onClickAdvancedSearchSettings,
  showAdvancedSearchSettings,
  onCloseAdvancedSearchSettings,
  searchResult,
  setSearchResult,
  
  deduplicateResult,
  setDeduplicateResult,
  
  versionId,
  context,
}) => {
  const [mode, setMode] = useState(type);

  const {isSmallWindow} = useIsSmallWindow();

  const onSelectChatMode = useCallback(
    (e) => {
      const chatMode = e?.target?.value
      if (mode !== chatMode) {
        setMode(chatMode);
        if (chatMode !== DataSourceChatBoxMode.Chat && showAdvancedChatSettings) {
          onCloseAdvancedChatSettings();
        } else if (chatMode !== DataSourceChatBoxMode.Search && showAdvancedSearchSettings) {
          onCloseAdvancedSearchSettings();
        }
      }
    },
    [
      mode,
      onCloseAdvancedChatSettings,
      onCloseAdvancedSearchSettings,
      showAdvancedChatSettings,
      showAdvancedSearchSettings],
  );

  useEffect(() => {
    if (!mode && type) {
      setMode(type);
    }
  }, [mode, type]);

  const buttonItems = useMemo(() =>
    Object.entries(DataSourceChatBoxMode).map(
      ([label, value]) => ({label, value})
    ), []);

  const showSettings = useMemo(() => (showAdvancedChatSettings || showAdvancedSearchSettings),
    [showAdvancedChatSettings, showAdvancedSearchSettings]);

  return (
    <Grid container columnSpacing={'32px'} height={'100%'}>
      <Grid item 
            xs={12} 
            lg={isFullScreenChat ? (showSettings ? 9 : 12) : (showSettings ? 7.2 : 12)}
            display={'flex'}
            flexDirection={"column"}
      >
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
            chatSettings={dataSourceSettings.chat}
            onChangeChatSettings={onChangeDataSourceSettings}
            versionId={versionId}
            context={context}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            isFullScreenChat={isFullScreenChat}
            setIsFullScreenChat={setIsFullScreenChat}
          />
        }
        {
          mode === DataSourceChatBoxMode.Search &&
          <SearchPanel
            searchSettings={dataSourceSettings.search}
            onChangeSearchSettings={onChangeDataSourceSettings}
            versionId={versionId}
            showAdvancedSettings={showAdvancedSearchSettings}
            onClickAdvancedSettings={onClickAdvancedSearchSettings}
            onCloseAdvancedSettings={onCloseAdvancedSearchSettings}
            searchResult={searchResult}
            setSearchResult={setSearchResult}
            isFullScreenChat={isFullScreenChat}
            setIsFullScreenChat={setIsFullScreenChat}
          />
        }
        {mode === DataSourceChatBoxMode.Deduplicate &&
          <DeduplicatePanel
            deduplicateSettings={dataSourceSettings.deduplicate}
            onChangeDeduplicateSettings={onChangeDataSourceSettings}
            versionId={versionId}
            deduplicateResult={deduplicateResult}
            setDeduplicateResult={setDeduplicateResult}
            isFullScreenChat={isFullScreenChat}
            setIsFullScreenChat={setIsFullScreenChat}
          />
        }
      </Grid>
      {!isSmallWindow && showAdvancedChatSettings &&
        <Grid item xs={0} lg={isFullScreenChat ? (showSettings ? 3 : 0) : (showSettings ? 4.8 : 0)}>
          <AdvancedChatSettings
            selectedEmbeddingModel={dataSourceSettings.chat?.chat_settings_embedding || {}}
            onChangeEmbeddingModel={(integrationUid, modelName) => {
              onChangeDataSourceSettings('chat.chat_settings_embedding',
                {
                  integration_uid: integrationUid,
                  model_name: modelName,
                });
            }}
            selectedChatModel={dataSourceSettings.chat?.chat_settings_ai || {}}
            onChangeChatModel={(integrationUid, modelName) => {
              onChangeDataSourceSettings('chat.chat_settings_ai',
                {
                  integration_uid: integrationUid,
                  model_name: modelName,
                });
            }}
            top_k={dataSourceSettings.chat?.chat_settings_embedding?.top_k}
            onChangeTopK={(value) => onChangeDataSourceSettings('chat.chat_settings_embedding.top_k', value)}
            temperature={dataSourceSettings.chat?.chat_settings_ai?.temperature}
            onChangeTemperature={(value) => onChangeDataSourceSettings('chat.chat_settings_ai.temperature', value)}
            top_p={dataSourceSettings.chat?.chat_settings_ai?.top_p}
            onChangeTopP={(value) => onChangeDataSourceSettings('chat.chat_settings_ai.top_p', value)}
            ai_top_k={dataSourceSettings.chat?.chat_settings_ai?.top_k}
            onChangeAITopK={(value) => onChangeDataSourceSettings('chat.chat_settings_ai.top_k', value)}
            maximum_length={dataSourceSettings.chat?.chat_settings_ai?.maximum_length}
            onChangeMaxLength={(value) => onChangeDataSourceSettings('chat.chat_settings_ai.maximum_length', value)}
            mode={mode}
            onCloseAdvancedSettings={onCloseAdvancedChatSettings}
            fetch_k={dataSourceSettings.chat?.chat_settings_embedding?.fetch_k}
            onChangeFetchK={(value) => onChangeDataSourceSettings('chat.chat_settings_embedding.fetch_k', value)}
            page_top_k={dataSourceSettings.chat?.chat_settings_embedding?.page_top_k}
            onChangePageTopK={(value) => onChangeDataSourceSettings('chat.chat_settings_embedding.page_top_k', value)}
            cut_off_score={dataSourceSettings.chat?.chat_settings_embedding?.cut_off_score}
            onChangeCutoffScore={(value) => onChangeDataSourceSettings('chat.chat_settings_embedding.cut_off_score', value)}
          />
        </Grid>}
      {!isSmallWindow && showAdvancedSearchSettings && <Grid item xs={0} lg={showAdvancedSearchSettings ? 4.8 : 0}>
        <AdvancedSearchSettings
          onCloseAdvancedSettings={onCloseAdvancedSearchSettings}
          selectedEmbeddingModel={dataSourceSettings.search?.chat_settings_embedding || {}}
          onChangeEmbeddingModel={(integrationUid, modelName) => {
            onChangeDataSourceSettings(
              'search.chat_settings_embedding',
              {
                integration_uid: integrationUid,
                model_name: modelName,
              });
          }}
          top_k={dataSourceSettings.search?.chat_settings_embedding?.top_k}
          onChangeTopK={(value) => onChangeDataSourceSettings('search.chat_settings_embedding.top_k', value)}
          cut_off_score={dataSourceSettings.search?.chat_settings_embedding?.cut_off_score}
          onChangeCutoffScore={(value) => onChangeDataSourceSettings('search.chat_settings_embedding.cut_off_score', value)}
          fetch_k={dataSourceSettings.search?.chat_settings_embedding?.fetch_k}
          onChangeFetchK={(value) => onChangeDataSourceSettings('search.chat_settings_embedding.fetch_k', value)}
          page_top_k={dataSourceSettings.search?.chat_settings_embedding?.page_top_k}
          onChangePageTopK={(value) => onChangeDataSourceSettings('search.chat_settings_embedding.page_top_k', value)}
          str_content={dataSourceSettings.search?.chat_settings_embedding?.str_content}
          onChangeStrContent={(event, value) => onChangeDataSourceSettings('search.chat_settings_embedding.str_content', value)}
        />
      </Grid>}
    </Grid>
  )
};

export default DatasourceOperationPanel;