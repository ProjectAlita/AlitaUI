import { useDatasetDeleteMutation, useDatasetStopTaskMutation } from "@/api/datasources";
import { buildErrorMessage } from "@/common/utils";
import DotMenu from "@/components/DotMenu";
import useToast from "@/components/useToast";
import { useProjectId } from "@/pages/hooks";
import { useCallback, useEffect, useMemo } from "react";
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import DeleteIcon from "@/components/Icons/DeleteIcon";
import { datasetStatus } from "../../constants";
import RemoveIcon from '@/components/Icons/RemoveIcon';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';

export default function DataSetActions({
  status,
  datasetId,
  turnToEdit,
  taskId,
  onStopTask,
}) {
  const projectId = useProjectId();
  const [stopTask, { isSuccess: isStopTaskSuccess, isError: isStopTaskError, error: stopTaskError, reset }] = useDatasetStopTaskMutation();
  const [deleteDataset, { isSuccess, isError, error }] = useDatasetDeleteMutation();
  const isPreparing = useMemo(() => status === datasetStatus.preparing.value, [status]);
  const handleDelete = useCallback(async () => {
    if (isPreparing) {
      await stopTask({
        projectId,
        taskId,
      })
    }
    await deleteDataset({
      projectId,
      datasetId,
    })
  }, [isPreparing, deleteDataset, projectId, datasetId, stopTask, taskId])


  const handleStop = useCallback(async() => {
    await stopTask({
      projectId,
      taskId,
    })
  }, [taskId, projectId, stopTask]);

  const menuItems = useMemo(() => {
    const items = [{
      label: 'Update',
      icon: <AutorenewOutlinedIcon sx={{ fontSize: '1.13rem' }} />,
      onClick: turnToEdit,
      disabled: isPreparing
    }, {
      label: 'Delete',
      icon: <DeleteIcon sx={{ fontSize: '1.13rem' }} />,
      confirmText: 'Are you sure to delete this dataset?',
      onConfirm: handleDelete
    }]

    if (isPreparing) {
      items.push({
        label: <span style={{ color: 'red' }}>Stop</span>,
        icon: <RemoveIcon fill='red' />,
        confirmText: 'Are you sure to stop dataset creation process?',
        onConfirm: handleStop
      })
    }
    return items
  }, [handleDelete, handleStop, isPreparing, turnToEdit]);

  const { ToastComponent: Toast, toastInfo, toastError, toastWarning } = useToast({ icon: <DoDisturbOnOutlinedIcon />});
  useEffect(() => {
    if (isError) {
      toastError(buildErrorMessage(error));
    } else if (isSuccess) {
      toastInfo('Success');
    } else if (isStopTaskError) {
      toastError(buildErrorMessage(stopTaskError));
      reset();
    } else if (isStopTaskSuccess) {
      onStopTask();
      toastWarning('Dataset creation was stopped');
    }
  }, [error, isError, isStopTaskError, isStopTaskSuccess, isSuccess, stopTaskError, reset, onStopTask, toastError, toastInfo, toastWarning]);

  return (
    <>
      <DotMenu
        id='data-set-actions'
      >
        {menuItems}
      </DotMenu>
      <Toast />
    </>
  )
}