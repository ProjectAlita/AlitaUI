import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_K,
  DEFAULT_TOP_P,
  PROMPT_PAYLOAD_KEY,
} from "@/common/constants.js";
import SingleGroupSelect from '@/components/SingleGroupSelect';
import Slider from '@/components/Slider';
import { actions as promptSliceActions } from '@/slices/prompts';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Typography } from '@mui/material';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ContentContainer } from '../Common';
import StyledInputEnhancer from '@/components/StyledInputEnhancer'
import { typographyVariants } from "@/MainTheme";
import { genModelSelectValue } from '@/common/promptApiUtils';


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

const AdvancedSettings = ({ onCloseAdvanceSettings, modelOptions, sx, itemSX }) => {
  const dispatch = useDispatch();
  const focusOnMaxTokens = useRef(false);
  const {
    model_name = '',
    temperature = DEFAULT_TEMPERATURE,
    integration_uid,
    integration_name,
    top_p,
    top_k,
    max_tokens } = useSelector(state => state.prompts.currentPrompt);
  const modelValue = useMemo(() =>
    (integration_uid && model_name ? genModelSelectValue(integration_uid, model_name, integration_name) : '')
    , [integration_name, integration_uid, model_name]);
  const onChange = useCallback(
    (key) => (data) => {
      dispatch(promptSliceActions.updateCurrentPromptData({
        key,
        data,
      }));
    },
    [dispatch],
  );
  const [maxTokens, setMaxTokens] = useState(max_tokens);

  const onChangeModel = useCallback(
    (integrationUid, model, integrationName) => {
      dispatch(
        promptSliceActions.batchUpdateCurrentPromptData({
          [PROMPT_PAYLOAD_KEY.integrationUid]: integrationUid,
          [PROMPT_PAYLOAD_KEY.integrationName]: integrationName,
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
        if (!focusOnMaxTokens.current && !maxTokens) {
          dispatch(
            promptSliceActions.updateCurrentPromptData({
              key: PROMPT_PAYLOAD_KEY.maxTokens,
              data: DEFAULT_MAX_TOKENS,
            })
          );
          setMaxTokens(DEFAULT_MAX_TOKENS);
        } else {
          if (maxTokens !== max_tokens) {
            dispatch(
              promptSliceActions.updateCurrentPromptData({
                key: PROMPT_PAYLOAD_KEY.maxTokens,
                data: parseInt(maxTokens),
              })
            );
          }
        }
      }, 50);
    },
    [dispatch, maxTokens, max_tokens],
  );

  const onMaxTokensFocus = useCallback(
    () => {
      focusOnMaxTokens.current = true;
    },
    [],
  );

  const onInputMaxTokens = useCallback((event) => {
    event.preventDefault();
    setMaxTokens(event.target.value);
  }, []);

  return (
    <GridItem item sx={sx} xs={12} lg={3}>
      <ContentContainer>
        <AdvanceSettingHeaderContainer sx={itemSX}>
          <Typography variant='subtitle'>Advanced Settings</Typography>
          <CloseIcon fontSize='1rem' onClick={onCloseAdvanceSettings} />
        </AdvanceSettingHeaderContainer>
        <AdvanceSettingSelectorContainer sx={itemSX}>
          <SingleGroupSelect
            value={modelValue}
            label={'Model'}
            onValueChange={onChangeModel}
            options={modelOptions}
          />
        </AdvanceSettingSelectorContainer>
        <AdvanceSettingSliderContainer sx={itemSX}>
          <Slider
            label='Temperature (0.1 - 1.0)'
            value={temperature}
            step={0.1}
            range={[0.1, 1]}
            onChange={onChange(PROMPT_PAYLOAD_KEY.temperature)}
          />
        </AdvanceSettingSliderContainer>
        <AdvanceSettingSliderContainer sx={itemSX}>
          <Slider
            label='Top P (0-1)'
            value={+(top_p ?? DEFAULT_TOP_P)}
            range={[0, 1]}
            onChange={onChange(PROMPT_PAYLOAD_KEY.topP)}
          />
        </AdvanceSettingSliderContainer>
        <AdvanceSettingSliderContainer sx={itemSX}>
          <Slider
            label='Top K'
            value={+(top_k ?? DEFAULT_TOP_K)}
            step={1}
            range={[1, 40]}
            onChange={onChange(PROMPT_PAYLOAD_KEY.topK)}
          />
        </AdvanceSettingSliderContainer>
        <AdvanceSettingInputContainer sx={itemSX}>
          <StyledInputEnhancer
            onBlur={onMaxTokensBlur}
            onFocus={onMaxTokensFocus}
            onInput={onInputMaxTokens}
            value={maxTokens}
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