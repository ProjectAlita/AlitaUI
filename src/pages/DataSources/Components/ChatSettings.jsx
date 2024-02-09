import SingleGroupSelect from '@/components/SingleGroupSelect';
import { Box, Typography } from '@mui/material';
import Slider from '@/components/Slider';
import { useEffect, useState, useCallback } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DEFAULT_TOP_P, DEFAULT_TOP_K, DEFAULT_CUT_OFF_SCORE, DEFAULT_TEMPERATURE, DataSourceChatBoxMode } from '@/common/constants';
import { useGetModelsQuery } from '@/api/integrations';
import { useSelectedProjectId } from '@/pages/hooks';
import { StyledInput } from '@/pages/EditPrompt/Common';
import { useTheme } from '@emotion/react';

export const ChatSettings = ({
  showAdvancedSettings = false,
  onChangeModel,
  selectedModel,
  top_k,
  onChangeTopK,
  temperature,
  onChangeTemperature,
  top_p,
  onChangeTopP,
  cutoff_score,
  onChangeCutoffScore,
  applyMaxTokens = false,
  onChangeApplyMaxTokens,
  max_tokens,
  onChangeMaxTokens,
  generateFile,
  onChangeGenerateFile,
  mode
}) => {
  const theme = useTheme();
  const projectId = useSelectedProjectId();

  const { isSuccess, data: integrations } = useGetModelsQuery(projectId, { skip: !projectId });
  const [modelOptions, setModelOptions] =
    useState({});

  const onCheckedApplyMaxTokens = useCallback(
    (event, checked) => {
      onChangeApplyMaxTokens(checked);
    },
    [onChangeApplyMaxTokens],
  );

  const onChangeInternalMaxTokens = useCallback(
    (event) => {
      onChangeMaxTokens(event.target.value);
    },
    [onChangeMaxTokens],
  );

  const onCheckedGenerateFile = useCallback(
    (event, checked) => {
      onChangeGenerateFile(checked);
    },
    [onChangeGenerateFile],
  );

  useEffect(() => {
    if (isSuccess && integrations && integrations.length) {
      const configNameModelMap = integrations.reduce((accumulator, item) => {
        return {
          ...accumulator,
          [item.config.name]: item.settings.models?.map(
            ({ name: modelName, id }) => ({
              label: modelName,
              value: id,
              group: item.uid,
              group_name: item.name,
              config_name: item.config.name,
            })),
        };
      }, {});
      setModelOptions(configNameModelMap);
    }
  }, [integrations, isSuccess, projectId]);

  return mode === DataSourceChatBoxMode.Chat ? (
    <Box sx={{ marginTop: '24px', gap: '24px 24px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      <Box sx={{ width: 'calc(50% - 12px)' }}>
        <SingleGroupSelect
          label={'Model'}
          value={selectedModel}
          onValueChange={onChangeModel}
          options={modelOptions} />
      </Box>
      <Box sx={{ width: 'calc(50% - 12px)' }}>
        <Slider
          label='Top K'
          value={+(top_k ?? DEFAULT_TOP_K)}
          step={1}
          range={[1, 40]}
          onChange={onChangeTopK}
        />
      </Box>
      {
        showAdvancedSettings &&
        <>
          <Box sx={{ width: 'calc(50% - 12px)' }}>
            <Slider
              label='Temperature (0.1 - 1.0)'
              value={temperature ?? DEFAULT_TEMPERATURE}
              step={0.1}
              range={[0.1, 1]}
              onChange={onChangeTemperature} />
          </Box>
          <Box sx={{ width: 'calc(50% - 12px)' }}>
            <Slider
              label='Cut-off score (0 – 1.00)'
              value={cutoff_score ?? DEFAULT_CUT_OFF_SCORE}
              step={0.1}
              range={[0, 1]}
              onChange={onChangeCutoffScore} />
          </Box>
          <Box sx={{ width: 'calc(50% - 12px)' }}>
            <Slider
              label='Top P (0-1)'
              value={+(top_p ?? DEFAULT_TOP_P)}
              range={[0, 1]}
              onChange={onChangeTopP}
            />
          </Box>
          <Box sx={{ width: 'calc(50% - 12px)', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <FormControlLabel
              control={
                <Checkbox checked={applyMaxTokens}
                  size='medium'
                  sx={{
                    color: theme.palette.icon.fill.default,
                  }}
                  onChange={onCheckedApplyMaxTokens}
                />
              }
              label={
                <Typography variant='bodyMedium'>
                  Maximum length
                </Typography>}
            />
            <Box sx={{ flex: 1, marginLeft: '20px', paddingTop: '9px' }}>
              <StyledInput
                variant='standard'
                fullWidth
                id='expiration'
                name='expiration'
                label=''
                type="number"
                value={max_tokens}
                onChange={onChangeInternalMaxTokens}
                inputProps={{
                  style: { textAlign: 'right' },
                }}
              />
            </Box>
          </Box>

        </>
      }
    </Box>
  ) :
    mode === DataSourceChatBoxMode.Search ? (
      <Box sx={{ marginTop: '24px', gap: '24px 24px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <Box sx={{ width: 'calc(50% - 12px)' }}>
          <Slider
            label='Top K'
            value={+(top_k ?? DEFAULT_TOP_K)}
            step={1}
            range={[1, 40]}
            onChange={onChangeTopK}
          />
        </Box>
        <Box sx={{ width: 'calc(50% - 12px)' }}>
          <Slider
            label='Cut-off score (0 – 1.00)'
            value={cutoff_score ?? DEFAULT_CUT_OFF_SCORE}
            step={0.1}
            range={[0, 1]}
            onChange={onChangeCutoffScore} />
        </Box>
      </Box>
    ) : (
      <Box sx={{ marginTop: '24px', gap: '24px 24px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, marginRight: '24px' }}>
          <Slider
            label='Cut-off score (0 – 1.00)'
            value={cutoff_score ?? DEFAULT_CUT_OFF_SCORE}
            step={0.1}
            range={[0, 1]}
            onChange={onChangeCutoffScore} />
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
          <FormControlLabel
            control={
              <Checkbox checked={generateFile}
                size='medium'
                sx={{
                  color: theme.palette.icon.fill.default,
                }}
                onChange={onCheckedGenerateFile}
              />
            }
            label={
              <Typography variant='bodyMedium'>
                Generate file
              </Typography>}
          />
        </Box>
      </Box>
    );
}
export default ChatSettings;