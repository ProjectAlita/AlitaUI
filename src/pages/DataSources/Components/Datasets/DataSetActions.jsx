import { useDatasetDeleteMutation } from "@/api/datasources";
import { buildErrorMessage } from "@/common/utils";
import DotMenu from "@/components/DotMenu";
import useToast from "@/components/useToast";
import { useProjectId } from "@/pages/hooks";
import { useCallback, useEffect, useMemo } from "react";

export default function DataSetActions({
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

  const menuItems = useMemo(() => [{
    label: 'Update',
    onClick: turnToEdit
  }, {
    label: 'Delete',
    confirmText: 'Are you sure to delete this dataset?',
    onConfirm: handleDelete
  }], [handleDelete, turnToEdit]);



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