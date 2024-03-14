/* eslint-disable react/jsx-no-bind */
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import ClearIcon from '@/components/Icons/ClearIcon';
import CopyIcon from '@/components/Icons/CopyIcon';
import {
  ActionButton,
  ChatBodyContainer,
  ChatBoxContainer,
  CompletionContainer,
  Message
} from '@/components/ChatBox/StyledComponents';
import styled from '@emotion/styled';
import { genModelSelectValue } from '@/common/promptApiUtils';
import ChatInput from '@/components/ChatBox/ChatInput';
import { useTheme } from '@emotion/react';
import SearchSettings from './SearchSettings';
import { useSearchMutation } from "@/api/datasources.js";
import { useProjectId, useIsSmallWindow } from "@/pages/hooks.jsx";
import BasicAccordion, { AccordionShowMode } from "@/components/BasicAccordion.jsx";
import SearchResultContent from "./SearchResultContent.jsx";
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SettingIcon from '@/components/Icons/SettingIcon';
import AdvancedSearchSettings from './AdvancedSearchSettings';

const CompletionHeader = styled('div')(() => ({
  display: 'block',
  textAlign: 'end'
}));

const SearchPanel = ({
  searchSettings,
  onChangeSearchSettings,
  showAdvancedSettings,
  onClickAdvancedSettings,
  onCloseAdvancedSettings,
  versionId,
  searchResult,
  setSearchResult,
}) => {
  const theme = useTheme();
  const currentProjectId = useProjectId()
  const { isSmallWindow } = useIsSmallWindow();

  const searchEmbeddingModelValue = useMemo(() =>
  (searchSettings?.embedding_model?.integration_uid &&
    searchSettings?.embedding_model?.model_name ?
    genModelSelectValue(
      searchSettings?.embedding_model?.integration_uid,
      searchSettings?.embedding_model?.model_name,
      searchSettings?.embedding_model?.integration_name
    )
    :
    ''
  )
    , [searchSettings?.embedding_model?.integration_name, searchSettings?.embedding_model?.integration_uid, searchSettings?.embedding_model?.model_name]);

  const searchInput = useRef(null);

  const [makeSearch, { data, isLoading, isSuccess }] = useSearchMutation()
  const onSearch = useCallback(
    async (query) => {
      setSearchResult({});
      const payload = {
        projectId: currentProjectId,
        versionId,

        chat_history: [{ role: 'user', content: query }],
        str_content: searchSettings.str_content,

        chat_settings_embedding: {
          embedding_integration_uid: searchSettings?.embedding_model?.integration_uid,
          embedding_model_name: searchSettings?.embedding_model?.model_name,

          fetch_k: searchSettings.fetch_k,
          page_top_k: searchSettings.page_top_k,
          top_k: searchSettings.top_k,
          cut_off_score: searchSettings.cut_off_score,
        },
      }
      await makeSearch(payload)
    },
    [setSearchResult, currentProjectId, versionId, searchSettings?.embedding_model?.integration_uid, searchSettings?.embedding_model?.model_name, searchSettings.top_k, searchSettings.cut_off_score, searchSettings.str_content, searchSettings.fetch_k, searchSettings.page_top_k, makeSearch]);

  useEffect(() => {
    if (isSuccess) {
      setSearchResult(data)
    }
  }, [data, isSuccess, setSearchResult])

  const onClearSearch = useCallback(() => {
    setSearchResult({});
  }, [setSearchResult]);

  const onCopyCompletion = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(searchResult, null, 2));
  }, [searchResult])

  const [prettifyResponse, setPrettifyResponse] = useState(true)

  const getContent = () => {
    if (searchResult?.findings) {
      if (Array.isArray(searchResult.findings)) {
        return searchResult.findings.map((i, index) =>
          <SearchResultContent data={i} key={index} pretty={prettifyResponse} />
        )
      } else {
        return <SearchResultContent data={searchResult.findings.toString()} pretty={false} />
      }
    }
    return ''
  }

  return (
    <Box sx={{ position: 'relative' }} >
      <Box sx={{ position: 'absolute', top: '-50px', right: '0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '8px' }}>
        {!showAdvancedSettings && <ActionButton sx={{ height: '28px', width: '28px' }} onClick={onClickAdvancedSettings}>
          <SettingIcon sx={{ fontSize: 16 }} />
        </ActionButton>}

      </Box>
      <ChatInput
        ref={searchInput}
        onSend={onSearch}
        isLoading={isLoading}
        disabledSend={isLoading || !searchEmbeddingModelValue}
        clearInputAfterSubmit={false}
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
      {!showAdvancedSettings && <SearchSettings
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
      />}
      {
        showAdvancedSettings && isSmallWindow &&
        <Box sx={{ marginY: '24px', paddingX: '2px' }}>
          <AdvancedSearchSettings
            onCloseAdvancedSettings={onCloseAdvancedSettings}
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
        </Box>
      }
      <ChatBoxContainer
        role="presentation"
        sx={{ marginTop: '24px' }}
      >
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
            aria-label="clear the search result"
            disabled={isLoading}
            onClick={onClearSearch}
          >
            <ClearIcon sx={{ fontSize: 16 }} />
          </ActionButton>
        </Box>
        <ChatBodyContainer>
          {
            <CompletionContainer>
              <Message>
                <CompletionHeader>
                  <IconButton onClick={() => {
                    setPrettifyResponse(prevState => !prevState)
                  }} color={'secondary'}>
                    {prettifyResponse ? <CodeIcon fontSize={'inherit'} /> :
                      <FormatListBulletedIcon fontSize={'inherit'} />}
                  </IconButton>
                  <IconButton disabled={!searchResult} onClick={onCopyCompletion}>
                    <CopyIcon sx={{ fontSize: '1.13rem' }} />
                  </IconButton>
                </CompletionHeader>
                <Box
                  position={'absolute'}
                  top={'50%'}
                  left={'50%'}
                  sx={{ transform: 'translate(-50%, 0)' }}
                  hidden={!isLoading}
                >
                  <CircularProgress color="inherit" size={'70px'} />
                </Box>
                <Stack spacing={1}>
                  <BasicAccordion
                    style={{ visibility: searchResult?.references ? 'visible' : 'hidden' }}
                    showMode={AccordionShowMode.LeftMode}
                    defaultExpanded={false}
                    items={[
                      {
                        title: 'References',
                        content: searchResult?.references?.map((i, index) => <pre key={index}>{i}</pre>),
                      }
                    ]}
                  />
                  {getContent()}
                </Stack>
              </Message>
            </CompletionContainer>
          }
        </ChatBodyContainer>
      </ChatBoxContainer>
    </Box>
  )
};

export default SearchPanel;