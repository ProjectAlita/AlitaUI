import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import {
  StyledCancelButton,
  StyledDialog,
  StyledDialogActions,
  StyledDialogContentText,
} from './StyledDialog';

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
        <DialogTitle sx={{ color: 'white' }} id="alert-dialog-title">
          {title}
        </DialogTitle>
      }
      <DialogContent>
        <StyledDialogContentText id="alert-dialog-description">
          {content}
        </StyledDialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <StyledCancelButton onClick={closeAlert} autoFocus>Cancel</StyledCancelButton>
        <StyledCancelButton danger onClick={doConfirm}>
          Confirm
        </StyledCancelButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}