import Button from '@/components/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import React, { useCallback } from 'react';
import { SaveButton } from '../Common';
import { useCtrlEnterKeyEventsHandler } from '@/components/ChatBox/hooks';
import { CREATE_VERSION, SAVE } from '@/common/constants';
import FrameIcon from '@/components/Icons/FrameIcon';
import { useTheme } from '@emotion/react';

export const StyledInput = styled(TextField)(({ theme }) => ({
  marginTop: '1rem',
  marginBottom: '1rem',
  '& .MuiFormLabel-root': {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: 400,
    left: '12px',
  },
  '& .MuiInputLabel-shrink': {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
    top: '6px',
  },
  '& .MuiInputBase-root': {
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
  '& textarea::-webkit-scrollbar': {
    display: 'none'
  },
  '& #prompt-context': {
    overflowY: 'scroll',
  },
  '& label': {
    color: theme.palette.text.primary
  },
  '& input': {
    color: theme.palette.text.secondary,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '24px',
    height: '24px',
    boxSizing: 'border-box',
    marginBottom: '8px',
  },
  '& textarea': {
    color: theme.palette.text.secondary,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '24px',
    boxSizing: 'border-box',
    marginBottom: '8px',
  },
  '& .MuiInput-underline': {
    padding: '0 12px'
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: theme.palette.border.lines,
  },
}));

const Title = styled(Typography)(({ theme }) => (`
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
  width: 500px;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-top: 1px solid ${theme.palette.border.lines};
  border-left: 1px solid ${theme.palette.border.lines};
  border-right: 1px solid ${theme.palette.border.lines};
  background: ${theme.palette.background.secondary};
  padding: 1rem 1.5rem 0px;
  overflow-x: hidden;
`));

const StyledDialogActions = styled(DialogActions)(({ theme }) => (`
  width: 500px;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-bottom: 1px solid ${theme.palette.border.lines};
  border-left: 1px solid ${theme.palette.border.lines};
  border-right: 1px solid ${theme.palette.border.lines};
  background: ${theme.palette.background.secondary};
  padding: 0px 1rem 1rem;
  justify-content: flex-end;
`));

const StyledTipsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '16px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: `${theme.palette.border.tips}`,
  borderRadius: '8px',
  marginTop: '16px',
  backgroundColor: `${theme.palette.background.tips}`,
  width: '452px',
  gap: '12px',
}));

const StyledButton = styled(Button)(({ theme }) => (`
  background: ${theme.palette.background.icon.default};
  color: ${theme.palette.text.secondary};
`));

export default function InputVersionDialog({
  title = CREATE_VERSION,
  doButtonTitle = SAVE,
  showTips = false,
  versionName = '',
  disabledInput = false,
  disabled,
  open,
  onCancel,
  onConfirm,
  onChange,
}) {
  const theme = useTheme();
  const onEnterDown = useCallback((event) => {
    if (!disabled) {
      event.stopPropagation();
      event.preventDefault()
      onConfirm();
    }
  }, [disabled, onConfirm]);

  const { onKeyDown, onKeyUp, onCompositionStart, onCompositionEnd } = useCtrlEnterKeyEventsHandler(
    { onEnterDown },
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
          {
            showTips && <StyledTipsContainer>
              <Box>
                <FrameIcon width={16} height={16} />
              </Box>
              <Typography variant='bodySmall' color='text.tips'>
                {'Before your version of this prompt is published, it will be sent to the moderator to obtain his approval to publish.'}
              </Typography>
            </StyledTipsContainer>
          }
          {!disabledInput ?
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
            :
            <Box sx={{
              display: 'flex',
              padding: '8px 12px;',
              flexDirection: 'column',
              alignItems: 'flex-start;',
              alignSelf: 'stretch;',
              borderRadius: '6px 6px 0px 0px;',
              borderBottom: ` 1px solid ${theme.palette.border.lines};`,
              marginTop: '16px',
              marginBottom: '16px',
            }}>
              <Typography variant='bodySmall' color='text.default'>
                Name
              </Typography>
              <Typography variant='bodyMedium' color='text.secondary'>
                {versionName}
              </Typography>
            </Box>}
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton onClick={onCancel}>
            Cancel
          </StyledButton>
          <SaveButton disabled={disabled} onClick={onConfirm} autoFocus>{doButtonTitle}</SaveButton>
        </StyledDialogActions>
      </StyledDialog>
    </React.Fragment>
  );
}