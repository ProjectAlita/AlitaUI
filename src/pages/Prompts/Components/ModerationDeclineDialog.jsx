import Button from '@/components/Button';
import InfoIcon from '@/components/Icons/InfoIcon';
import {
  StyledDialog,
  StyledDialogContentText,
} from '@/components/StyledDialog';
import { Box, Typography, useTheme } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import { StyledInput } from './Common';

export default function ModerationDeclineDialog({ open, setOpen, onConfirm }) {
  const theme = useTheme();
  const setCloseRejectDialog = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const [isEmptyComment, setIsEmptyComment] = React.useState(false);
  const [declineComment, setDeclineComment] = React.useState('');
  const handleCommentChange = React.useCallback((event) => {
    setDeclineComment(event.target.value);
  }, []);

  const checkAndConfirm = React.useCallback(async () => {
    if (!declineComment) {
      setIsEmptyComment(true);
      return;
    }
    setIsEmptyComment(false);
    await onConfirm();
    setOpen(false);
  }, [declineComment, onConfirm, setOpen]);
  return (
    <StyledDialog
      open={open}
      onClose={setCloseRejectDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant='headingSmall' >
          Publish Decline
        </Typography>
      </DialogTitle>
      <DialogContent>
        <StyledDialogContentText id="alert-dialog-description">
          <Box sx={{
            display: 'flex',
            alignItems: 'top',
            padding: '16px',
            border: `1px solid ${theme.palette.border.tips}`,
            borderRadius: '8px',
            background: theme.palette.background.tips,
            gap: '12px'
          }}>
            <InfoIcon width={24} height={16} fill={theme.palette.text.info} />
            <Typography component='div' variant='bodySmall'>
              Before decline this version of prompt it must be commented with highlighting the reason of rejection!
            </Typography>
          </Box>
          <StyledInput
            variant='standard'
            fullWidth
            id='declineComment'
            name='declineComment'
            label=''
            value={declineComment}
            onChange={handleCommentChange}
            error={isEmptyComment && !declineComment}
            helperText={isEmptyComment && !declineComment && 'Decline comment is required'}
          />
        </StyledDialogContentText>
      </DialogContent>
      <Box sx={{ padding: '0.5rem 1.5rem 1.5rem 1.5rem' }} display='flex' justifyContent='flex-start'>
        <Button variant='contained' color='primary' onClick={checkAndConfirm}>
          Decline
        </Button>
        <Button variant='contained' color='secondary' onClick={setCloseRejectDialog} autoFocus >
          Cancel
        </Button>
      </Box>
    </StyledDialog>
  );
}