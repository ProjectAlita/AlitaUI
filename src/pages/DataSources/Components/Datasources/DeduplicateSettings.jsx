import SingleGroupSelect from '@/components/SingleGroupSelect';
import {Box, FormControl, Input, InputLabel, Typography} from '@mui/material';
import {useCallback} from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {useTheme} from '@emotion/react';
import useModelOptions from './useModelOptions';
import ModelCompatibleIcon from './ModelCompatibleIcon';
import GroupedButton from "@/components/GroupedButton.jsx";
import {dedupCutoffOptions} from "@/pages/DataSources/constants.js";
import InputAdornment from "@mui/material/InputAdornment";

const DeduplicateSettings = ({
                               onChangeEmbeddingModel,
                               selectedEmbeddingModel,
                               isSelectedEmbeddingModelCompatible,
                               cut_off_score,
                               onChangeCutoffScore,
                               cut_off_option,
                               onChangeCutoffOption,
                               generateFile,
                               onChangeGenerateFile,
                             }) => {
  const theme = useTheme();
  const {embeddingModelOptions} = useModelOptions();

  const onCheckedGenerateFile = useCallback(
    (event, checked) => {
      onChangeGenerateFile(checked);
    },
    [onChangeGenerateFile],
  );

  return (
    <Box sx={{marginTop: '24px', gap: '24px 24px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
      <SingleGroupSelect
        label={'Embedding model'}
        value={selectedEmbeddingModel}
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
      <Box flex={1} marginRight={'24px'} alignItems={'baseline'}>
        <FormControl sx={{flexGrow: 1}}>
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
        <FormControl sx={{ml: 2}}>
          <FormControlLabel
            control={
              <Checkbox checked={generateFile}
                        disabled
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
        </FormControl>
      </Box>
    </Box>
  );
}
export default DeduplicateSettings;