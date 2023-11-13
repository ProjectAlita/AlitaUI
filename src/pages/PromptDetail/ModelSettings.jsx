import {
  DEFAULT_TEMPERATURE
} from "@/common/constants.js";
import SettingIcon from '@/components/Icons/SettingIcon';
import SingleSelect from '@/components/SingleSelect';
import Slider from '@/components/Slider';
import styled from '@emotion/styled';
import { Avatar, Box } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  fontSize: '1rem',
  width: '1.75rem',
  height: '1.75rem',
  display: 'flex',
  padding: '0.5rem',
  flex: '0 0 1.75rem',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.secondary.main
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
  paddingRight: '1rem',
  paddingLeft: '0.5rem',
}));

const ModelSettings = ({
  onClickSettings,
  modelOptions,
  showAdvancedSettings,
  onChangeModel,
  onChangeTemperature,
}) => {
  const {
    model_name = '',
    temperature = DEFAULT_TEMPERATURE,
  } = useSelector(state => state.prompts.currentPrompt);
  const containerStyle = useMemo(() => showAdvancedSettings ?
    {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'stretch',
    }
    :
    {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center'
    },
    [showAdvancedSettings])
  return (
    <Box style={containerStyle}>
      <StyleLeftBox>
        <SingleSelect
          label={'Model'}
          value={model_name}
          onValueChange={onChangeModel}
          options={modelOptions} />
      </StyleLeftBox>
      <StyleRightBox>
        <Slider
          label="Temperature(0.01 - 1.0)"
          defaultValue={temperature}
          step={0.01}
          range={[0.01, 1]}
          onChange={onChangeTemperature} />
        <StyledAvatar onClick={onClickSettings}>
          <SettingIcon fontSize="1rem" />
        </StyledAvatar>
      </StyleRightBox>
    </Box>
  );
}
export default ModelSettings;