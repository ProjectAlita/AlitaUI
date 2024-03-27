import SingleGroupSelect from '@/components/SingleGroupSelect';
import {Box, FormControl, Input, InputLabel} from '@mui/material';
import useModelOptions from './useModelOptions';
import ModelCompatibleIcon from './ModelCompatibleIcon';
import GroupedButton from "@/components/GroupedButton.jsx";
import {dedupCutoffOptions} from "@/pages/DataSources/constants.js";
import InputAdornment from "@mui/material/InputAdornment";
import React, { useMemo } from 'react'
import { genModelSelectValue, getIntegrationNameByUid } from '@/common/promptApiUtils';
import {RunButton} from "@/components/ChatBox/StyledComponents.jsx";

const DeduplicateSettings = ({
  onChangeEmbeddingModel,
  selectedEmbeddingModel,
  isSelectedEmbeddingModelCompatible,
  cut_off_score,
  onChangeCutoffScore,
  cut_off_option,
  onChangeCutoffOption,
  onClickRun,
  runDisabled
}) => {
  const {embeddingModelOptions} = useModelOptions();
  const duplicateEmbeddingModelValue = useMemo(() =>
  (
    selectedEmbeddingModel.integration_uid &&
     selectedEmbeddingModel.model_name ? 
     genModelSelectValue(selectedEmbeddingModel.integration_uid, 
      selectedEmbeddingModel.model_name, 
      getIntegrationNameByUid(selectedEmbeddingModel.integration_uid, embeddingModelOptions))
      : '')
  , [embeddingModelOptions, selectedEmbeddingModel.integration_uid, selectedEmbeddingModel.model_name]);


  return (
    <Box sx={{marginTop: '24px', gap: '24px 24px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
      <SingleGroupSelect
        label={'Embedding model'}
        value={duplicateEmbeddingModelValue}
        onValueChange={onChangeEmbeddingModel}
        options={embeddingModelOptions}
        extraSelectedContent={isSelectedEmbeddingModelCompatible ? <ModelCompatibleIcon/> : null}
        sx={{
          height: '56px',
          boxSizing: 'border-box',
          paddingTop: '8px',
          '& .MuiInputLabel-shrink': {
            top: '12px !important',
          },
          '& .MuiInputLabel-root': {
            top: '6px',
          },
        }}
      />
      <Box flex={1} marginRight={'24px'} alignItems={'baseline'} display={"flex"} justifyContent={"space-between"}>
        <FormControl>
          <InputLabel htmlFor={'cut-off-option'}>
            Cut-off score
          </InputLabel>
          <Input
            id={'cutoff_func'}
            type="number"
            inputProps={{
              step: 0.1,
              max: 1,
              min: -1
            }}
            variant="standard"
            value={cut_off_score || 0}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={e => {
              onChangeCutoffScore(e.target.value)
            }}
            startAdornment={
              <InputAdornment position="start" sx={{mr: 2}}>
                <GroupedButton
                  // readOnly
                  value={cut_off_option}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(e) => {
                    onChangeCutoffOption(e.target.value)
                  }}
                  buttonItems={dedupCutoffOptions}
                />
              </InputAdornment>
            }
          />
        </FormControl>
        <RunButton
          disabled={runDisabled}
          onClick={onClickRun}
        >
          Run
        </RunButton>
      </Box>
    </Box>
  );
}
export default DeduplicateSettings;