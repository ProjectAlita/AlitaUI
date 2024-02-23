/* eslint-disable react/jsx-no-bind */
import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useCallback, useState, useMemo } from 'react';
import ClearIcon from '@/components/Icons/ClearIcon';
import CopyIcon from '@/components/Icons/CopyIcon';
import {
  ActionButton,
  ChatBodyContainer,
  ChatBoxContainer,
  CompletionContainer,
  Message,
  RunButton
} from '@/components/ChatBox/StyledComponents';
import styled from '@emotion/styled';
import { genModelSelectValue } from '@/common/promptApiUtils';
import GenerateFile from './GenerateFile';
import DuplicateSettings from './DuplicateSettings';
import Markdown from '@/components/Markdown';

const CompletionHeader = styled('div')(() => ({
  display: 'block',
  textAlign: 'end'
}));

const DuplicatePanel = ({ duplicateSettings, onChangeDuplicateSettings }) => {
  const [searchResult, setSearchResult] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const duplicateEmbeddingModelValue = useMemo(() =>
    (duplicateSettings?.embedding_model?.integration_uid && duplicateSettings?.embedding_model?.model_name ? genModelSelectValue(duplicateSettings?.embedding_model?.integration_uid, duplicateSettings?.embedding_model?.model_name, duplicateSettings?.embedding_model?.integration_name) : '')
    , [duplicateSettings?.embedding_model?.integration_name, duplicateSettings?.embedding_model?.integration_uid, duplicateSettings?.embedding_model?.model_name]);

  const onRunDuplicate = useCallback(
    () => {
      // to duplicate
    },
    [],
  )

  const onClearSearch = useCallback(
    () => {
      setSearchResult('');
    },
    [],
  );

  const onCopyCompletion = useCallback(() => {
    navigator.clipboard.writeText(searchResult);
  }, [searchResult])

  const onGenerateFile = useCallback(
    () => {
      //Generate file
    },
    [],
  )

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: '-50px', right: '0px' }}>
        <RunButton disabled={isLoading} onClick={onRunDuplicate}>
          Run
        </RunButton>
      </Box>

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
      {
        duplicateSettings.generate_file &&
        <GenerateFile onGenerateFile={onGenerateFile} />
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
            aria-label="clear the chat"
            disabled={isLoading}
            onClick={onClearSearch}
          >
            <ClearIcon sx={{ fontSize: 16 }} />
          </ActionButton>
        </Box>
        <ChatBodyContainer>
          <CompletionContainer>
            <Message>
              <CompletionHeader>
                <IconButton disabled={!searchResult} onClick={onCopyCompletion}>
                  <CopyIcon sx={{ fontSize: '1.13rem' }} />
                </IconButton>
              </CompletionHeader>
              <Markdown>
                {searchResult}
              </Markdown>
            </Message>
          </CompletionContainer>
        </ChatBodyContainer>
      </ChatBoxContainer>
    </Box>
  )
};

DuplicatePanel.propTypes = {
}


export default DuplicatePanel;