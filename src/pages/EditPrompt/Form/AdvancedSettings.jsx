import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_K,
  DEFAULT_TOP_P,
  GROUP_SELECT_VALUE_SEPARATOR,
  PROMPT_PAYLOAD_KEY,
} from "@/common/constants.js";
import SingleGroupSelect from '@/components/SingleGroupSelect';
import Slider from '@/components/Slider';
import { actions as promptSliceActions } from '@/slices/prompts';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Typography } from '@mui/material';
import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyledInputEnhancer, ContentContainer } from '../Common';
import { typographyVariants } from "@/MainTheme";


const GridItem = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    paddingRight: '16px'
  }
}));

const AdvanceSettingHeaderContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem',
  paddingRight: '8px',
}));

const AdvanceSettingSelectorContainer = styled(Box)(() => ({ marginTop: '0.5rem', paddingRight: '0.5rem' }));

const AdvanceSettingSliderContainer = styled(Box)(({ theme }) => ({
  marginTop: '0.5rem',
  width: '100%',
  paddingLeft: '12px',
  paddingRight: '0.5rem',
  '& p.MuiTypography-root': {
    marginBottom: '4px',
  },
  '& .MuiInputBase-root.MuiInput-root>input': {
    ...typographyVariants.bodyMedium,
    color: theme.palette.text.secondary,
  }
}));

const AdvanceSettingInputContainer = styled(Box)(() => ({
  marginTop: '0',
  width: '100%',
  paddingRight: '0.5rem'
}));

const AdvancedSettings = ({ onCloseAdvanceSettings, modelOptions }) => {
  const dispatch = useDispatch();
  const focusOnMaxTokens = useRef(false);
  const {
    model_name = '',
    temperature = DEFAULT_TEMPERATURE,
    integration_uid,
    top_p,
    top_k,
    max_tokens} = useSelector(state => state.prompts.currentPrompt);
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

  const onMaxTokensBlur = useCallback(
    () => {
      focusOnMaxTokens.current = false;
      setTimeout(() => {
        if (!focusOnMaxTokens.current) {
          if (!max_tokens) {
            dispatch(
              promptSliceActions.updateCurrentPromptData({
                key: PROMPT_PAYLOAD_KEY.maxTokens,
                data: DEFAULT_MAX_TOKENS,
              })
            );
          }
        }
      }, 50);
    },
    [dispatch, max_tokens],
  );

  const onMaxTokensFocus = useCallback(
    () => {
      focusOnMaxTokens.current = true;
    },
    [],
  );

  return (
    <GridItem item xs={12} lg={2.5}>
      <ContentContainer>
        <AdvanceSettingHeaderContainer>
          <Typography variant='subtitle'>Advanced Settings</Typography>
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
            label='Temperature (0.1 - 1.0)'
            value={temperature}
            step={0.1}
            range={[0.1, 1]}
            onChange={onChange(PROMPT_PAYLOAD_KEY.temperature)}
          />
        </AdvanceSettingSliderContainer>
        <AdvanceSettingSliderContainer>
          <Slider
            label='Top P (0-1)'
            value={+(top_p ?? DEFAULT_TOP_P)}
            range={[0, 1]}
            onChange={onChange(PROMPT_PAYLOAD_KEY.topP)}
          />
        </AdvanceSettingSliderContainer>
        <AdvanceSettingSliderContainer>
          <Slider
            label='Top K'
            value={+(top_k ?? DEFAULT_TOP_K)}
            step={1}
            range={[1, 40]}
            onChange={onChange(PROMPT_PAYLOAD_KEY.topK)}
          />
        </AdvanceSettingSliderContainer>
        <AdvanceSettingInputContainer>
          <StyledInputEnhancer
            onBlur={onMaxTokensBlur}
            onFocus={onMaxTokensFocus}
            payloadkey={PROMPT_PAYLOAD_KEY.maxTokens}
            id="maxTokens"
            type="number"
            label="Maximum length"
            variant="standard"
            placeholder="Input maximum length here"
            fullWidth
          />
        </AdvanceSettingInputContainer>
      </ContentContainer>
    </GridItem>
  );
}
export default AdvancedSettings;