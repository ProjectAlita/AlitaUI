/* eslint-disable react/jsx-no-bind */
import {Box, Typography, CircularProgress, Link, Tooltip} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, {useCallback, useState, useMemo, useEffect} from 'react';
import ClearIcon from '@/components/Icons/ClearIcon';
import CopyIcon from '@/components/Icons/CopyIcon';
import {
  ActionButton,
  ChatBodyContainer,
  ChatBoxContainer,
  CompletionContainer,
  RunButton
} from '@/components/ChatBox/StyledComponents';
import styled from '@emotion/styled';
import {genModelSelectValue} from '@/common/promptApiUtils';
import GenerateFile from './GenerateFile';
import DeduplicateSettings from './DeduplicateSettings';
import {useDeduplicateMutation} from "@/api/datasources.js";
import {useSelectedProjectId} from "@/pages/hooks.jsx";
import DeduplicateResultContent from "@/pages/DataSources/Components/Datasources/DeduplicateResultContent.jsx";
import CodeIcon from "@mui/icons-material/Code.js";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted.js";
import DownloadIcon from '@mui/icons-material/Download';
import {VITE_SERVER_URL} from "@/common/constants.js";
import DifferenceIcon from '@mui/icons-material/Difference';

const CompletionHeader = styled('div')(() => ({
  display: 'block',
  textAlign: 'end'
}));

const DeduplicatePanel = ({
                            deduplicateSettings,
                            onChangeDeduplicateSettings,
                            versionId,
                            deduplicateResult,
                            setDeduplicateResult
                          }) => {
  const duplicateEmbeddingModelValue = useMemo(() =>
      (deduplicateSettings?.embedding_model?.integration_uid && deduplicateSettings?.embedding_model?.model_name ? genModelSelectValue(deduplicateSettings?.embedding_model?.integration_uid, deduplicateSettings?.embedding_model?.model_name, deduplicateSettings?.embedding_model?.integration_name) : '')
    , [deduplicateSettings?.embedding_model?.integration_name, deduplicateSettings?.embedding_model?.integration_uid, deduplicateSettings?.embedding_model?.model_name]);

  const currentProjectId = useSelectedProjectId()
  const [makeDeduplicate, {data, isLoading, isSuccess}] = useDeduplicateMutation()
  const onRunDuplicate = useCallback(
    async () => {
      setDeduplicateResult([]);
      const payload = {
        projectId: currentProjectId,
        versionId,
        integration_uid: deduplicateSettings?.embedding_model?.integration_uid,
        model_name: deduplicateSettings?.embedding_model?.model_name,
        cut_off_score: deduplicateSettings.cut_off_score
      }
      await makeDeduplicate(payload)
    },
    [setDeduplicateResult, currentProjectId, versionId, deduplicateSettings?.embedding_model?.integration_uid, deduplicateSettings?.embedding_model?.model_name, deduplicateSettings.cut_off_score, makeDeduplicate]);

  useEffect(() => {
    if (isSuccess) {
      setDeduplicateResult(data)
    }
  }, [data, isSuccess, setDeduplicateResult])

  const onClearSearch = useCallback(() => {
    setDeduplicateResult([]);
  }, [setDeduplicateResult]);

  const onCopyCompletion = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(deduplicateResult.pairs, null, 2));
  }, [deduplicateResult?.pairs])

  const onGenerateFile = useCallback(
    () => {
      //Generate file
    },
    [],
  )
  const [prettifyResponse, setPrettifyResponse] = useState(true)
  const [showOnlyDiff, setShowOnlyDiff] = useState(false)

  return (
    <Box sx={{position: 'relative'}}>
      <Box sx={{position: 'absolute', top: '-50px', right: '0px'}}>
        <RunButton disabled={isLoading || !duplicateEmbeddingModelValue} onClick={onRunDuplicate}>
          Run
        </RunButton>
      </Box>

      <DeduplicateSettings
        selectedEmbeddingModel={duplicateEmbeddingModelValue}
        onChangeEmbeddingModel={(integrationUid, modelName, integrationName) => {
          onChangeDeduplicateSettings('embedding_model',
            {
              integration_uid: integrationUid,
              model_name: modelName,
              integration_name: integrationName,
            });
        }}
        generateFile={deduplicateSettings?.generate_file}
        onChangeGenerateFile={(value) => onChangeDeduplicateSettings('generate_file', value)}
        cut_off_option={deduplicateSettings?.cut_off_option}
        onChangeCutoffOption={(value) => onChangeDeduplicateSettings('cut_off_option', value)}
        cut_off_score={deduplicateSettings?.cut_off_score}
        onChangeCutoffScore={(value) => onChangeDeduplicateSettings('cut_off_score', value)}
      />
      {
        deduplicateSettings.generate_file &&
        <GenerateFile onGenerateFile={onGenerateFile}/>
      }
      <ChatBoxContainer
        role="presentation"
        sx={{marginTop: '24px'}}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
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
            <ClearIcon sx={{fontSize: 16}}/>
          </ActionButton>
        </Box>
        <ChatBodyContainer>
          <CompletionContainer>
            <CompletionHeader>
              <Tooltip title={prettifyResponse ? 'Code format' : 'Pretty format'} placement="top">
                <IconButton onClick={() => {
                  setPrettifyResponse(prevState => !prevState)
                }} color={'secondary'}>
                  {prettifyResponse ? <CodeIcon fontSize={'inherit'}/> :
                    <FormatListBulletedIcon fontSize={'inherit'}/>}
                </IconButton>
              </Tooltip>
              <Tooltip title='Show differences' placement="top">
                <IconButton onClick={() => {
                  setShowOnlyDiff(prevState => !prevState)
                }} color={'secondary'}>
                  <DifferenceIcon fontSize={'inherit'} color={showOnlyDiff ? 'primary' : 'secondary'}/>
                </IconButton>
              </Tooltip>
              <IconButton
                color={'secondary'}
                component={Link}
                download
                href={`${VITE_SERVER_URL}/artifacts/artifact/default/${currentProjectId}/datasource-deduplicate/${deduplicateResult?.xlsx_object}`}
                disabled={!deduplicateResult?.xlsx_object}
              >
                <DownloadIcon fontSize={'inherit'}/>
              </IconButton>
              <IconButton disabled={!deduplicateResult?.pairs} onClick={onCopyCompletion}>
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
            <DeduplicateResultContent data={deduplicateResult?.pairs} pretty={prettifyResponse}
                                      showOnlyDiff={showOnlyDiff}/>
          </CompletionContainer>
        </ChatBodyContainer>
      </ChatBoxContainer>
    </Box>
  )
};

DeduplicatePanel.propTypes = {}


export default DeduplicatePanel;