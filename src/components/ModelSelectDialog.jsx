/* eslint-disable react/jsx-no-bind */
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  StyledDialog,
  StyledDialogActions,
} from './StyledDialog';
import {Typography} from '@mui/material';
import NormalRoundButton from './NormalRoundButton';
import Button from '@/components/Button';
import SingleGroupSelect from './SingleGroupSelect';
import useModelOptions from '@/pages/DataSources/Components/Datasources/useModelOptions';
import {useCallback, useMemo,} from 'react';
import {genModelSelectValue, getIntegrationNameByUid} from '@/common/promptApiUtils';
import {useTheme} from '@emotion/react';

const StyledButton = styled(Button)(({theme}) => (`
  background: ${theme.palette.background.icon.default};
  color: ${theme.palette.text.secondary};
`));


const makeChatModelValue = (alita_model, modelOptions) => {
  const modelExists = Object.values(modelOptions).find(models => models.find(m => m.group === alita_model?.integration_uid && m.value === alita_model?.model_name))
  if (modelExists) {
    return (
      alita_model?.integration_uid &&
      alita_model?.model_name ?
        genModelSelectValue(alita_model?.integration_uid,
          alita_model?.model_name,
          getIntegrationNameByUid(alita_model?.integration_uid, modelOptions))
        : '')
  } else {
    return ''
  }
  
}

const PromptModelDropdown = ({modelOptions, prompt, onChangePrompt, index, error}) => {
  const {name, alita_model, versions} = prompt

  const chatModelValue = useMemo(
    () => makeChatModelValue(alita_model, modelOptions),
    [modelOptions, alita_model])
  ;
  const onSelectDial = useCallback((integrationUid, modelName, integrationName) => {
    onChangePrompt(
      index,
      {
        alita_model: {
          integration_uid: integrationUid,
          model_name: modelName,
          integration_name: integrationName,
        }
      })
  }, [onChangePrompt, index])

  const onSelectAlita = idx => (integrationUid, modelName, integrationName) => {
    versions[idx].model_settings.model = {
      integration_uid: integrationUid,
      model_name: modelName,
      integration_name: integrationName,
    }
    onChangePrompt(index, {versions: versions})
  }


  if (versions) {
    return (
      <>
        {versions.map(((i, idx) => {
          return <SingleGroupSelect
            key={idx}
            label={`${name}-${i.name} model:`}
            value={makeChatModelValue(i.model_settings.model, modelOptions)}
            onValueChange={onSelectAlita(idx)}
            options={modelOptions}
            fullwidth
            required
            error={error?.msg}
            helperText={error?.msg}
          />
        }))}
      </>

    )
  } else {
    return (
      <>
        <SingleGroupSelect
          label={`${name} model:`}
          value={chatModelValue}
          onValueChange={onSelectDial}
          options={modelOptions}
          fullwidth
          required
          error={error?.msg}
          helperText={error?.msg}
        />
      </>
    )
  }


}

export default function ModelSelectDialog({
                                            title,
                                            open,
                                            onClose,
                                            onCancel,
                                            onConfirm,
                                            importBody,
                                            setImportBody,
                                            errors
                                          }) {
  const theme = useTheme();
  const {modelOptions} = useModelOptions();


  const handleChangePrompt = (index, modelData) => {
    setImportBody(prev => {
      Object.assign(prev.prompts[index], modelData)
      return {...prev}
    })
  }


  const onCancelClick = useCallback(
    () => {
      onCancel()
    },
    [onCancel],
  )

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >

      {
        title &&
        <DialogTitle width={'100%'}>
          <Typography variant='headingSmall'>
            {title}
          </Typography>
        </DialogTitle>
      }
      <DialogContent sx={{width: '100%'}}>
        {importBody?.prompts?.map(
          (i, index) => <PromptModelDropdown key={index} modelOptions={modelOptions} prompt={i} index={index}
                                             onChangePrompt={handleChangePrompt}
                                             error={
                                               errors &&
                                               Array.isArray(errors) &&
                                               errors.find(e => e.loc[1] === index)
                                             }/>
        )}
      </DialogContent>
      <StyledDialogActions>
        <StyledButton sx={{color: theme.palette.text.secondary, background: theme.palette.background.button.danger}}
                      onClick={onCancelClick}>
          Cancel
        </StyledButton>
        <NormalRoundButton
          onClick={onConfirm}
        >
          Confirm
        </NormalRoundButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}