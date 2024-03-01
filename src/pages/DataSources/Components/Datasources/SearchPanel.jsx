/* eslint-disable react/jsx-no-bind */
import {Box, CircularProgress, Stack, Typography} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, {useCallback, useState, useMemo, useRef, useEffect} from 'react';
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
import {genModelSelectValue} from '@/common/promptApiUtils';
import ChatInput from '@/components/ChatBox/ChatInput';
import {useTheme} from '@emotion/react';
import SearchSettings from './SearchSettings';
import {useSearchMutation} from "@/api/datasources.js";
import {useSelectedProjectId} from "@/pages/hooks.jsx";
import BasicAccordion, {AccordionShowMode} from "@/components/BasicAccordion.jsx";
import SearchResultContent from "./SearchResultContent.jsx";
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

const CompletionHeader = styled('div')(() => ({
  display: 'block',
  textAlign: 'end'
}));

const SearchPanel = ({
  searchSettings,
  onChangeSearchSettings,
  versionId
}) => {
  const theme = useTheme();
  const [searchResult, setSearchResult] = useState({})
  const currentProjectId = useSelectedProjectId()

  const searchEmbeddingModelValue = useMemo(() =>
      (searchSettings?.embedding_model?.integration_uid && searchSettings?.embedding_model?.model_name ? genModelSelectValue(searchSettings?.embedding_model?.integration_uid, searchSettings?.embedding_model?.model_name, searchSettings?.embedding_model?.integration_name) : '')
    , [searchSettings?.embedding_model?.integration_name, searchSettings?.embedding_model?.integration_uid, searchSettings?.embedding_model?.model_name]);

  const searchInput = useRef(null);

  const [makeSearch, {data, isLoading}] = useSearchMutation()
  const onSearch = useCallback(
    async (query) => {
      const payload = {
        projectId: currentProjectId,
        versionId,
        chat_history: [{role: 'user', content: query}],
        integration_uid: searchSettings?.embedding_model?.integration_uid,
        model_name: searchSettings?.embedding_model?.model_name,
        top_k: searchSettings.top_k,
        cut_off_score: searchSettings.cut_off_score
      }
      await makeSearch(payload)
    },
    [searchSettings, versionId, currentProjectId, makeSearch]);

  useEffect(() => {
    setSearchResult(data)
  }, [data])

  const onClearSearch = useCallback(() => {
      setSearchResult({});
    }, []);

  const onCopyCompletion = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(searchResult, null, 2));
  }, [searchResult])

  const [prettifyResponse, setPrettifyResponse] = useState(true)


  return (
    <>
      <ChatInput
        ref={searchInput}
        onSend={onSearch}
        isLoading={isLoading}
        disabledSend={isLoading}
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
        cut_off_score={searchSettings?.cut_off_score}
        onChangeCutoffScore={(value) => onChangeSearchSettings('cut_off_score', value)}
      />
      <ChatBoxContainer
        role="presentation"
        sx={{marginTop: '24px'}}
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
            <ClearIcon sx={{fontSize: 16}}/>
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
                    {prettifyResponse ? <CodeIcon fontSize={'inherit'}/> :
                      <FormatListBulletedIcon fontSize={'inherit'}/>}
                  </IconButton>
                  <IconButton disabled={!searchResult} onClick={onCopyCompletion}>
                    <CopyIcon sx={{fontSize: '1.13rem'}}/>
                  </IconButton>
                </CompletionHeader>
                <Box 
                  position={'absolute'}
                  top={'50%'}
                  left={'50%'}
                  sx={{transform: 'translate(-50%, 0)'}}
                  hidden={!isLoading}
                >
                  <CircularProgress color="inherit" size={'70px'}/>
                </Box> 
                <Stack spacing={1}>
                  <BasicAccordion
                    style={{visibility: searchResult?.references ? 'visible' : 'hidden'}}
                    showMode={AccordionShowMode.LeftMode}
                    defaultExpanded={false}
                    items={[
                      {
                        title: 'References',
                        content: searchResult?.references?.map((i, index) => <pre key={index}>{i}</pre>),
                      }
                    ]}
                  />
                  {searchResult?.findings?.map((i, index) => (
                    <SearchResultContent data={i} key={index} pretty={prettifyResponse}/>)
                  )}
                </Stack>
              </Message>
            </CompletionContainer>
          }
        </ChatBodyContainer>
      </ChatBoxContainer>
    </>
  )
};

export default SearchPanel;