import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import {
  StyledCancelButton,
  StyledDialog,
  StyledDialogActions,
  StyledDialogContentText,
} from './StyledDialog';

const AlertDialogV2 = React.forwardRef(({ title, content, onConfirm }, ref) => {
  const [open, setOpenAlert] = React.useState(false);

  const closeAlert = React.useCallback(() => {
      setOpenAlert(false);
  }, []);

  const doConfirm = React.useCallback(() => {
    closeAlert();
    onConfirm();
  }, [onConfirm, closeAlert]);

  React.useImperativeHandle(ref, () => ({
    open: () => setOpenAlert(true),
    close: closeAlert
  }), [closeAlert]);

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
});

AlertDialogV2.displayName = 'AlertDialogV2';

export default AlertDialogV2;