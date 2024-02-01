import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import React, { useCallback, useState } from 'react';
import AttentionIcon from '@/components/Icons/AttentionIcon';
import { NormalRoundButton } from '../../EditPrompt/Common';
import { handleCopy } from '@/common/utils';
import { useTheme } from '@emotion/react';
import CancelIcon from '@/components/Icons/CancelIcon';

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
  padding: 0px 1.5rem 1rem;
  justify-content: flex-end;
`));

const StyledTipsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '16px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: `${theme.palette.border.attention}`,
  borderRadius: '8px',
  marginTop: '16px',
  backgroundColor: `${theme.palette.background.attention}`,
  width: '452px',
  gap: '12px',
}));

const COPY_DISABLED_DURATION = 5000;

export default function GeneratedTokenDialog({
  open,
  name = 'Nice token',
  token,
  onClose,
}) {
  const theme = useTheme();
  const [disabledCopy, setDisabledCopy] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Copy')
  const onCopy = useCallback(() => {
    handleCopy(token);
    setButtonTitle('Copied!');
    setDisabledCopy(true);
    setTimeout(() => {
      setButtonTitle('Copy');
      setDisabledCopy(false);
    }, COPY_DISABLED_DURATION);
  }, [token]);

  return (
    <React.Fragment>
      <StyledDialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <StyledDialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title>
              New token generated!
            </Title>
            <Box sx={{ cursor: 'pointer'}} onClick={onClose}>
              <CancelIcon fill={theme.palette.icon.fill.default} />
            </Box>
          </Box>
          <StyledTipsContainer>
            <Box>
              <AttentionIcon width={16} height={16} fill={theme.palette.icon.fill.attention} />
            </Box>
            <Typography variant='bodySmall' color='text.attention'>
              {'This token will only be shown once, so make sure to copy and save it.'}
            </Typography>
          </StyledTipsContainer>
          <Box sx={{ marginY: '16px', padding: '8px 12px', borderBottom: `1px solid ${theme.palette.border.lines}` }}>
            <Typography variant='bodySmall' color='text.default'>
              {name}
            </Typography>
            <Box sx={{
              maxHeight: '48px',
              overflowY: 'scroll',
              scrollbarWidth: 'none',
              'msOverflowStyle': 'none',
              '::-webkit-scrollbar': {
                width: '0 !important;',
                height: '0;',
              }
            }}>
              <Typography sx={{ wordWrap: 'break-word' }} variant='bodyMedium' color='text.default'>
                {token}
              </Typography>
            </Box>
          </Box>
        </StyledDialogContent>
        <StyledDialogActions>
          <NormalRoundButton sx={{ marginRight: '0px' }} disabled={disabledCopy} onClick={onCopy}>
            {buttonTitle}
          </NormalRoundButton>
        </StyledDialogActions>
      </StyledDialog>
    </React.Fragment>
  );
}