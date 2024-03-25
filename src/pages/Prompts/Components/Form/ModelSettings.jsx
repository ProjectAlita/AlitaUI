import { DEFAULT_TEMPERATURE } from "@/common/constants.js";
import { genModelSelectValue } from '@/common/promptApiUtils';
import SettingIcon from '@/components/Icons/SettingIcon';
import SingleGroupSelect from '@/components/SingleGroupSelect';
import Slider from '@/components/Slider';
import styled from '@emotion/styled';
import { Avatar, Box } from '@mui/material';
import { useMemo } from 'react';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  fontSize: '1rem',
  width: '1.75rem',
  height: '1.75rem',
  display: 'flex',
  padding: '0.5rem',
  flex: '0 0 1.75rem',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '1rem',
  backgroundColor: theme.palette.background.icon.default
}));

const StyleLeftBox = styled(Box)(() => ({
  flex: 6,
  paddingRight: '1rem'
}));

const StyleRightBox = styled(Box)(() => ({
  flex: 7,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '& p.MuiTypography-root': {
    marginBottom: '2px',
  },

}));

const ModelSettings = ({
  onOpenAdvancedSettings,
  modelOptions,
  onChangeModel,
  onChangeTemperature,
  settings,
}) => {
  const {
    model_name = '',
    integration_uid,
    integration_name,
    temperature = DEFAULT_TEMPERATURE,
  } = settings;

  const modelValue = useMemo(() =>
    (integration_uid && model_name ? genModelSelectValue(integration_uid, model_name, integration_name) : '')
    , [integration_name, integration_uid, model_name]);

  return (
    <Box style={{
      flex: 1,
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
    }}>
      <StyleLeftBox>
        <SingleGroupSelect
          label={'Model'}
          value={modelValue}
          onValueChange={onChangeModel}
          options={modelOptions} />
      </StyleLeftBox>
      <StyleRightBox>
        <Slider
          label='Temperature (0.1 - 1.0)'
          value={temperature}
          step={0.1}
          range={[0.1, 1]}
          onChange={onChangeTemperature} />
        <StyledAvatar sx={{ cursor: 'pointer' }} onClick={onOpenAdvancedSettings}>
          <SettingIcon fontSize="1rem" />
        </StyledAvatar>
      </StyleRightBox>
    </Box>
  );
}
export default ModelSettings;