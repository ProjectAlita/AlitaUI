import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import styled from "@emotion/styled";

export const StyledDialog = styled(Dialog)(({theme}) => (`
  & .MuiDialog-paper {
    display: flex;
    width: 28.75rem;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 0.5rem;
    border: 1px solid ${theme.palette.border.lines};
    background: ${theme.palette.background.secondaryBg};
  }
`));

export const StyledDialogContentText = styled(DialogContentText)(({theme}) => (`
  color: ${theme.palette.text.primary};
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
`));

export const StyledDialogActions = styled(DialogActions)(() => (`
  justify-content: flex-end;
  align-self: flex-end;
  padding: 0.5rem 1.5rem 1.5rem 1.5rem;
`));

export const StyledCancelButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'danger'
})(({ theme, danger }) => (`
  display: flex;
  padding: 0.375rem 1rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 1.75rem;
  background: ${danger ? theme.palette.background.button.danger : theme.palette.background.button.normal};
  color: ${theme.palette.text.secondary};
  text-transform: none;
`));

export default function AlertDialog({ title, alertContent, open, onClose, onCancel, onConfirm }) {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
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
          {alertContent}
        </StyledDialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <StyledCancelButton onClick={onCancel} autoFocus>Cancel</StyledCancelButton>
        <StyledCancelButton danger onClick={onConfirm}>
          Confirm
        </StyledCancelButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}