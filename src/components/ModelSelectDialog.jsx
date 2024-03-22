import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  StyledDialog,
  StyledDialogActions,
} from './StyledDialog';
import { Typography, Box } from '@mui/material';
import NormalRoundButton from './NormalRoundButton';
import Button from '@/components/Button';
import SingleGroupSelect from './SingleGroupSelect';
import useModelOptions from '@/pages/DataSources/Components/Datasources/useModelOptions';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { genModelSelectValue, getIntegrationNameByUid } from '@/common/promptApiUtils';
import { useTheme } from '@emotion/react';

const StyledButton = styled(Button)(({ theme }) => (`
  background: ${theme.palette.background.icon.default};
  color: ${theme.palette.text.secondary};
`));

export default function ModelSelectDialog({ title, open, onClose, onCancel, onConfirm }) {
  const theme = useTheme();
  const { modelOptions } = useModelOptions();
  const [selectedChatModel, setSelectedChatModel] = useState({})

  useEffect(() => {
    if (open) {
      setSelectedChatModel({})
    }
  }, [open])

  const chatModelValue = useMemo(() =>
  (
    selectedChatModel.integration_uid &&
      selectedChatModel.model_name ?
      genModelSelectValue(selectedChatModel.integration_uid,
        selectedChatModel.model_name,
        getIntegrationNameByUid(selectedChatModel.integration_uid, modelOptions))
      : ''),
    [modelOptions, selectedChatModel.integration_uid, selectedChatModel.model_name]);

  const onSelect = useCallback((integrationUid, modelName, integrationName) => {
    setSelectedChatModel(
      {
        integration_uid: integrationUid,
        integration_name: integrationName,
        model_name: modelName,
      });
  }, [])

  const onConfirmClick = useCallback(
    () => {
      onConfirm(selectedChatModel);
    },
    [onConfirm, selectedChatModel],
  )

  const onCancelClick = useCallback(
    () => {
      setSelectedChatModel({})
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
        <DialogTitle id="alert-dialog-title">
          <Typography variant='headingSmall' >
            {title}
          </Typography>
        </DialogTitle>
      }
      <DialogContent>
        <Box sx={{ width: '400px', height: '56px' }}>
          <SingleGroupSelect
            label={'Chat model'}
            value={chatModelValue}
            onValueChange={onSelect}
            options={modelOptions}
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
        </Box>
      </DialogContent>
      <StyledDialogActions>
        <StyledButton sx={{ color: theme.palette.text.secondary, background: theme.palette.background.button.danger }} onClick={onCancelClick}>
          Cancel
        </StyledButton>
        <NormalRoundButton disabled={!selectedChatModel.integration_uid} onClick={onConfirmClick}>
          Confirm
        </NormalRoundButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}