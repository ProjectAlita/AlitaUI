import { typographyVariants } from "@/MainTheme";
import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_K,
  DEFAULT_TOP_P,
  PROMPT_PAYLOAD_KEY,
} from "@/common/constants.js";
import { genModelSelectValue } from '@/common/promptApiUtils';
import SingleGroupSelect from '@/components/SingleGroupSelect';
import Slider from '@/components/Slider';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Typography } from '@mui/material';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ContentContainer } from '../Common';


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

const AdvancedSettings = ({
  onCloseAdvanceSettings,
  modelOptions,
  onChangeModel,
  settings,
  onChangeSettings,
  sx,
  itemSX
}) => {
  const focusOnMaxTokens = useRef(false);
  const {
    model_name = '',
    temperature = DEFAULT_TEMPERATURE,
    integration_uid,
    top_p,
    top_k,
    max_tokens
  } = settings;
  const modelValue = useMemo(() =>
    (integration_uid && model_name ? genModelSelectValue(integration_uid, model_name) : '')
    , [integration_uid, model_name]);

  const [maxTokens, setMaxTokens] = useState(max_tokens);

  const onMaxTokensBlur = useCallback(
    () => {
      focusOnMaxTokens.current = false;
      setTimeout(() => {
        if (!focusOnMaxTokens.current && !maxTokens) {
          onChangeSettings(PROMPT_PAYLOAD_KEY.maxTokens)(DEFAULT_MAX_TOKENS);
          setMaxTokens(DEFAULT_MAX_TOKENS);
        } else {
          if (maxTokens !== max_tokens) {
            onChangeSettings(PROMPT_PAYLOAD_KEY.maxTokens)(parseInt(maxTokens));
          }
        }
      }, 50);
    },
    [maxTokens, max_tokens, onChangeSettings],
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
    <GridItem item sx={sx} xs={12} lg={3} paddingBottom='16px'>
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
            onChange={onChangeSettings(PROMPT_PAYLOAD_KEY.temperature)}
          />
        </AdvanceSettingSliderContainer>
        <AdvanceSettingSliderContainer sx={itemSX}>
          <Slider
            label='Top P (0-1)'
            value={+(top_p ?? DEFAULT_TOP_P)}
            range={[0, 1]}
            onChange={onChangeSettings(PROMPT_PAYLOAD_KEY.topP)}
          />
        </AdvanceSettingSliderContainer>
        <AdvanceSettingSliderContainer sx={itemSX}>
          <Slider
            label='Top K'
            value={+(top_k ?? DEFAULT_TOP_K)}
            step={1}
            range={[1, 40]}
            onChange={onChangeSettings(PROMPT_PAYLOAD_KEY.topK)}
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