import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';

export default function AlertDialog({ title, alertContent, open, onClose, onCancel, onConfirm }) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          title &&
          <DialogTitle id="alert-dialog-title">
            {title}
          </DialogTitle>
        }
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { alertContent }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} autoFocus>Cancel</Button>
          <Button onClick={onConfirm} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}