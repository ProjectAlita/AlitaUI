import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import {
  StyledConfirmButton,
  StyledDialog,
  StyledDialogActions,
  StyledDialogContentText,
} from './StyledDialog';
import { Typography } from '@mui/material';

export default function AlertDialogV2 ({ open, setOpen, title, content, onConfirm }) {
  const closeAlert = React.useCallback(() => {
      setOpen(false);
  }, [setOpen]);

  const doConfirm = React.useCallback(() => {
    closeAlert();
    onConfirm();
  }, [onConfirm, closeAlert]);

  return (
    <StyledDialog
      open={open}
      onClose={closeAlert}
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
        <StyledDialogContentText id="alert-dialog-description">
          {content}
        </StyledDialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <StyledConfirmButton onClick={closeAlert} autoFocus>Cancel</StyledConfirmButton>
        <StyledConfirmButton danger onClick={doConfirm}>
          Confirm
        </StyledConfirmButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}