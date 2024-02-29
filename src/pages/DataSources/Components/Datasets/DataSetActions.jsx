import { useDatasetDeleteMutation } from "@/api/datasources";
import { buildErrorMessage } from "@/common/utils";
import DotMenu from "@/components/DotMenu";
import useToast from "@/components/useToast";
import { useProjectId } from "@/pages/hooks";
import { useCallback, useEffect, useMemo } from "react";
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import DeleteIcon from "@/components/Icons/DeleteIcon";
import { datasetStatus } from "../../constants";
import RemoveIcon from '@/components/Icons/RemoveIcon';

export default function DataSetActions({
  status,
  datasetId,
  turnToEdit
}) {
  const projectId = useProjectId();
  const [deleteDataset, { isSuccess, isError, error }] = useDatasetDeleteMutation();
  const handleDelete = useCallback(async () => {
    await deleteDataset({
      projectId,
      datasetId,
    })
  }, [deleteDataset, projectId, datasetId])


  const isPreparing = useMemo(() => status === datasetStatus.preparing.value, [status]);
  const handleStop = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('stop dataset preparation')
  }, []);

  const menuItems = useMemo(() => {
    const items = [{
      label: 'Update',
      icon: <AutorenewOutlinedIcon sx={{ fontSize: '1.13rem' }} />,
      onClick: turnToEdit,
      // disabled: isPreparing
    }, {
      label: 'Delete',
      icon: <DeleteIcon sx={{ fontSize: '1.13rem' }} />,
      confirmText: 'Are you sure to delete this dataset?',
      onConfirm: handleDelete
    }]

    const STOP_API_READY = false;
    if (isPreparing && STOP_API_READY) {
      items.push({
        label: <span style={{ color: 'red' }}>Stop</span>,
        icon: <RemoveIcon fill='red' />,
        confirmText: 'Are you sure to stop dataset creation process?',
        onConfirm: handleStop
      })
    }
    return items
  }, [handleDelete, handleStop, isPreparing, turnToEdit]);



  const { ToastComponent: Toast, toastInfo, toastError } = useToast();
  useEffect(() => {
    if (isError) {
      toastError(buildErrorMessage(error));
    } else if (isSuccess) {
      toastInfo('Success');
    }
  }, [error, isError, isSuccess, toastError, toastInfo]);

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