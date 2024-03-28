import {
  ActionButton,
  StyledDialog,
  StyledDialogActions,
  StyledDialogContentText,
} from '@/components/StyledDialog';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Box, Typography } from "@mui/material";
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useCallback, useState } from "react";

const BackLink = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  '&:hover': {
    '& > svg': {
      fill: theme.palette.icon.fill.secondary
    },
    '& > .MuiTypography-root': {
      color: theme.palette.text.secondary
    }
  }
}));

export default function ToolFormBackButton({
  isAdding,
  isDirty,
  toolType,
  validate = () => { },
  handleGoBack = () => { },
}) {
  const [openAlert, setOpenAlert] = useState(false);
  const onCloseAlert = useCallback(() => {
    setOpenAlert(false);
  }, []);


  const handleBack = useCallback(() => {
    if (!isDirty) {
      handleGoBack({ saveChanges: false });
      return
    }

    const isError = validate();
    if (isError) {
      setOpenAlert(true);
    } else {
      handleGoBack({ saveChanges: true });
    }
  }, [handleGoBack, isDirty, validate])

  const handleDiscard = useCallback(() => {
    setOpenAlert(false);
    handleGoBack({ saveChanges: false });
  }, [handleGoBack])

  return (
    <>
      <BackLink onClick={handleBack}>
        <ArrowBackOutlinedIcon sx={{ fontSize: '1rem' }} />
        <Typography variant='labelMedium' component='div' color='text.secondary'>
          {`New ${toolType} tool`}
        </Typography>
      </BackLink>

      <StyledDialog
        open={openAlert}
        onClose={onCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography variant='headingSmall' >
            Some fields have missing or invalid data!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <StyledDialogContentText id="alert-dialog-description">
          <Typography variant='labelMedium'>Choose the action to proceed.</Typography>
          </StyledDialogContentText>
        </DialogContent>
        <StyledDialogActions>
          <ActionButton color='error' variant='contained' onClick={handleDiscard}>
            <Typography variant='labelSmall'>
              {isAdding ? 'Delete tool' : 'Discard changes'}
            </Typography>
          </ActionButton>
          <ActionButton color='primary' variant='contained' onClick={onCloseAlert} autoFocus>
            <Typography variant='labelSmall'>
              Continue editing
            </Typography>
          </ActionButton>
        </StyledDialogActions>
      </StyledDialog>
    </>
  )
}