import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  StyledConfirmButton,
  StyledDialog,
  StyledDialogActions,
  StyledDialogContentText,
} from './StyledDialog';
import { Typography } from '@mui/material';

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
        <DialogTitle id="alert-dialog-title">
          <Typography variant='headingSmall' >
            {title}
          </Typography>
        </DialogTitle>
      }
      <DialogContent>
        <StyledDialogContentText id="alert-dialog-description">
          {alertContent}
        </StyledDialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <StyledConfirmButton onClick={onCancel} autoFocus disableRipple>Cancel</StyledConfirmButton>
        <StyledConfirmButton danger onClick={onConfirm} disableRipple>
          Confirm
        </StyledConfirmButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}