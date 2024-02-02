import React, { useCallback, useState } from 'react';
import IconButton from '@/components/IconButton';
import DeleteIcon from '@/components/Icons/DeleteIcon';
import Tooltip from '@/components/Tooltip';
import AlertDialog from '../../../components/AlertDialog';


const ClearModelsButton = ({ onClear, disabled }) => {
  const [openAlert, setOpenAlert] = useState(false);
  const onClearModels = useCallback(
    () => {
      if (!disabled) {
        setOpenAlert(true);
      }
    },
    [disabled],
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
      onClear();
    }, [onClear, onCloseAlert]);

  return (
    <>
      <Tooltip title='Clear models' placement="top">
        <IconButton onClick={onClearModels}>
          <DeleteIcon sx={{ width: '16px', height: '16px' }} />
        </IconButton>
      </Tooltip>
      <AlertDialog
        title={'Delete models'}
        alertContent={"Are you sure to delete all models?"}
        open={openAlert}
        onClose={onCloseAlert}
        onCancel={onCloseAlert}
        onConfirm={onConfirmAlert}
      />
    </>
  );
}

export default ClearModelsButton;