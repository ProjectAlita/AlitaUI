import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  StyledCancelButton,
  StyledDialog,
  StyledDialogActions,
  StyledDialogContentText,
} from './StyledDialog';

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