/* eslint-disable react/jsx-no-bind */
import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { MuiMarkdown } from 'mui-markdown';
import { useCallback, useState, useMemo, useRef } from 'react';
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

const CompletionHeader = styled('div')(() => ({
  display: 'block',
  textAlign: 'end'
}));

const SearchPanel = (
  {
    searchSettings,
    onChangeSearchSettings
  }
) => {
  const theme = useTheme();
  const [searchResult, setSearchResult] = useState('');

  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const searchEmbeddingModelValue = useMemo(() =>
    (searchSettings?.embedding_model?.integration_uid && searchSettings?.embedding_model?.model_name ? genModelSelectValue(searchSettings?.embedding_model?.integration_uid, searchSettings?.embedding_model?.model_name, searchSettings?.embedding_model?.integration_name) : '')
    , [searchSettings?.embedding_model?.integration_name, searchSettings?.embedding_model?.integration_uid, searchSettings?.embedding_model?.model_name]);

  const searchInput = useRef(null);

  const onSearch = useCallback(
    async (query) => {
      setSearchResult(query);
      //askAlita
    },
    []);

  const onClearSearch = useCallback(
    () => {
      setSearchResult('');
    },
    [],
  );

  const onCopyCompletion = useCallback(() => {
    navigator.clipboard.writeText(searchResult);
  }, [searchResult])


  return (
    <>
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
    </>
  )
};

export default SearchPanel;