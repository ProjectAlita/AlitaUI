import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_K,
  DEFAULT_TOP_P,
  GROUP_SELECT_VALUE_SEPARATOR,
  PROMPT_PAYLOAD_KEY,
} from "@/common/constants.js";
import { StyledTypography } from '@/components/BasicAccordion';
import SingleGroupSelect from '@/components/SingleGroupSelect';
import Slider from '@/components/Slider';
import { actions as promptSliceActions } from '@/reducers/prompts';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyledInputEnhancer } from './Common';


const GridItem = styled(Grid)(({ theme }) => ({
  padding: '0 0.75rem',
  [theme.breakpoints.up('md')]: {
    overflowY: 'scroll',
    height: 'calc(100vh - 8.6rem)',
    '::-webkit-scrollbar': {
      display: 'none'
    }
  }
}));

const AdvanceSettingHeaderContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 0rem 0.75rem'
}));

const AdvanceSettingSelectorContainer = styled(Box)(() => ({ marginTop: '0.5rem' }));

const AdvanceSettingSliderContainer = styled(Box)(() => ({
  marginLeft: '0.5rem',
  marginTop: '0.5rem',
  width: '100%',
  paddingRight: '0.5rem'
}));

const AdvanceSettingInputContainer = styled(Box)(() => ({
  marginLeft: '0.5rem',
  marginTop: '0.5rem',
  width: '100%',
  paddingRight: '0.5rem'
}));

const AdvancedSettings = ({ onCloseAdvanceSettings, modelOptions }) => {
  const dispatch = useDispatch();
  const { model_name = '', temperature = DEFAULT_TEMPERATURE,
    integration_uid, top_p, top_k } =
    useSelector(state => state.prompts.currentPrompt);
  const modelValue = useMemo(() =>
    (integration_uid && model_name ? `${integration_uid}${GROUP_SELECT_VALUE_SEPARATOR}${model_name}` : '')
    , [integration_uid, model_name]);
  const onChange = useCallback(
    (key) => (data) => {
      dispatch(promptSliceActions.updateCurrentPromptData({
        key,
        data,
      }));
    },
    [dispatch],
  );

  const onChangeModel = useCallback(
    (integrationUid, model) => {
      dispatch(
        promptSliceActions.batchUpdateCurrentPromptData({
          [PROMPT_PAYLOAD_KEY.integrationUid]: integrationUid,
          [PROMPT_PAYLOAD_KEY.modelName]: model,
        })
      );
    },
    [dispatch]
  );

  return (
    <GridItem item xs={12} lg={2.5}>
      <AdvanceSettingHeaderContainer>
        <StyledTypography>Advanced Settings</StyledTypography>
        <CloseIcon fontSize='1rem' onClick={onCloseAdvanceSettings} />
      </AdvanceSettingHeaderContainer>
      <AdvanceSettingSelectorContainer>
        <SingleGroupSelect
          value={modelValue}
          label={'Model'}
          onValueChange={onChangeModel}
          options={modelOptions}
        />
      </AdvanceSettingSelectorContainer>
      <AdvanceSettingSliderContainer>
        <Slider
          label="Temperature(0.01 - 1.0)"
          defaultValue={temperature}
          step={0.01}
          range={[0.01, 1]}
          onChange={onChange(PROMPT_PAYLOAD_KEY.temperature)}
        />
      </AdvanceSettingSliderContainer>
      <AdvanceSettingSliderContainer>
        <Slider
          label="Top P (0-1)"
          defaultValue={+(top_p ?? DEFAULT_TOP_P)}
          range={[0, 1]}
          onChange={onChange(PROMPT_PAYLOAD_KEY.topP)}
        />
      </AdvanceSettingSliderContainer>
      <AdvanceSettingSliderContainer>
        <Slider
          label="Top K"
          defaultValue={+(top_k ?? DEFAULT_TOP_K)}
          step={1}
          range={[1, 40]}
          onChange={onChange(PROMPT_PAYLOAD_KEY.topK)}
        />
      </AdvanceSettingSliderContainer>
      <AdvanceSettingInputContainer>
        <StyledInputEnhancer
          payloadkey={PROMPT_PAYLOAD_KEY.maxTokens}
          id="maxTokens"
          type="number"
          label="Max Tokens"
          variant="standard"
          placeholder="Input max tokens here"
          defaultValue={DEFAULT_MAX_TOKENS}
          fullWidth
        />
      </AdvanceSettingInputContainer>
    </GridItem>);
}
export default AdvancedSettings;