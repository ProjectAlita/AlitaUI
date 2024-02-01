import React, { useCallback, useState } from 'react';
import Tooltip from '@/components/Tooltip';
import AlertDialog from '../../../components/AlertDialog';
import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import DeleteFilledIcon from '../../../components/Icons/DeleteFilledIcon';


const DeleteModelButton = ({ onDelete }) => {
  const theme = useTheme();
  const [openAlert, setOpenAlert] = useState(false);
  const onDeleteModel = useCallback(
    () => {
      setOpenAlert(true);
    },
    [],
  )

  const onCloseAlert = useCallback(
    () => {
      setOpenAlert(false);
    },
    [],
  );
  const onConfirmAlert = useCallback(
    async () => {
      onCloseAlert();
      onDelete();
    }, [onCloseAlert, onDelete]);

  return (
    <>
      <Tooltip title='Delete model' placement="top">
        <Box sx={{ cursor: 'pointer' }} onClick={onDeleteModel}>
          <DeleteFilledIcon fill={theme.palette.icon.fill.default} />
        </Box>
      </Tooltip>
      <AlertDialog
        title={'Delete model'}
        alertContent={"Are you sure to delete this model?"}
        open={openAlert}
        onClose={onCloseAlert}
        onCancel={onCloseAlert}
        onConfirm={onConfirmAlert}
      />
    </>
  );
}

export default DeleteModelButton;