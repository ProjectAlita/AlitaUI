import Button from '@/components/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import React, { useCallback } from 'react';
import { SaveButton } from '../Common';
import { useCtrlEnterKeyEventsHandler } from '@/components/ChatBox/hooks';
import { CREATE_VERSION, SAVE } from '@/common/constants';

export const StyledInput = styled(TextField)(({ theme }) => ({
  marginTop: '1rem',
  marginBottom: '0.75rem',
  '& .MuiFormLabel-root': {
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    top: '-0.25rem',
    left: '0.75rem',
  },
  '& .MuiInputBase-root': {
    padding: '1rem 0.75rem',
    marginTop: '0',
  },
  '& .MuiInputBase-root:before': {
    borderBottom: `1px solid ${theme.palette.border.lines}`
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input': {
    color: `${theme.palette.text.secondary}`,
  },
  '& label': {
    color: `${theme.palette.text.primary}`,
  }
}));

const Title = styled(Typography)(({theme}) => (`
  font-family: Montserrat;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem; /* 171.429% */
  color: ${theme.palette.text.secondary};
`));

const StyledDialog = styled(Dialog)(() => (`
  display: flex;
  padding: 1rem 1.5rem;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`));

const StyledDialogContent = styled(DialogContent)(({ theme }) => (`
  width: 23.375rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-top: 1px solid ${theme.palette.border.lines};
  border-left: 1px solid ${theme.palette.border.lines};
  border-right: 1px solid ${theme.palette.border.lines};
  background: ${theme.palette.background.secondary};
  padding: 1rem 1.5rem 0px
`));

const StyledDialogActions = styled(DialogActions)(({ theme }) => (`
  width: 23.375rem;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-bottom: 1px solid ${theme.palette.border.lines};
  border-left: 1px solid ${theme.palette.border.lines};
  border-right: 1px solid ${theme.palette.border.lines};
  background: ${theme.palette.background.secondary};
  padding: 0px 1.5rem 1rem;
  justify-content: flex-start;
`));

const StyledButton = styled(Button)(({ theme }) => (`
  background: ${theme.palette.background.icon.default};
`));

export default function InputVersionDialog({ 
  title = CREATE_VERSION, 
  doButtonTitle = SAVE, 
  disabled, 
  open, 
  onCancel, 
  onConfirm, 
  onChange, 
}) {
  const onEnterPressed = useCallback((event) => {
    if (!disabled) {
      event.stopPropagation();
      event.preventDefault()
      onConfirm();
    }
  }, [disabled, onConfirm]);

  const { onKeyDown, onKeyUp, onCompositionStart, onCompositionEnd } = useCtrlEnterKeyEventsHandler(
    null,
    onEnterPressed,
  );
  return (
    <React.Fragment>
      <StyledDialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <StyledDialogContent>
          <Title>
            {title}
          </Title>
          <StyledInput
            fullWidth
            variant='standard'
            label='Name'
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            onChange={onChange}
          />
        </StyledDialogContent>
        <StyledDialogActions>
          <SaveButton disabled={disabled} onClick={onConfirm} autoFocus>{doButtonTitle}</SaveButton>
          <StyledButton onClick={onCancel}>
            Cancel
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>
    </React.Fragment>
  );
}