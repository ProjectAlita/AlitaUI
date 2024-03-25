import AlertDialog from "@/components/AlertDialog";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Box, Typography } from "@mui/material";
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
  isDirty,
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

    const isValid = validate();
    if (isValid) {
      handleGoBack({ saveChanges: true });
    } else {
      setOpenAlert(true);
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
        <Typography variant='labelMedium' component='div' color='text.primary'>
          New datasource tool
        </Typography>
      </BackLink>
      <AlertDialog
        title='Warning'
        open={openAlert}
        onClose={onCloseAlert}
        onCancel={onCloseAlert}
        alertContent='Required fields are missing. Going back will discard changes here. Are you sure to continue?'
        onConfirm={handleDiscard}
      />
    </>
  )
}