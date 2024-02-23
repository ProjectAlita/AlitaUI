import { useDatasetDeleteMutation } from "@/api/datasources";
import DotMenu from "@/components/DotMenu";
import { useSelectedProjectId } from "@/pages/hooks";
import { useCallback, useMemo } from "react";

export default function DataSetActions({
  datasetId,
  setIsEdit
}) {
  const projectId = useSelectedProjectId();
  const [deleteDataset] = useDatasetDeleteMutation();
  const handleDelete = useCallback(async () => {
    await deleteDataset({
      projectId,
      datasetId,
    })
  }, [deleteDataset, projectId, datasetId])

  const turnToEdit = useCallback(() => {
    setIsEdit(true)
  }, [setIsEdit])

  const menuItems = useMemo(() => [{
    label: 'Update',
    onClick: turnToEdit
  }, {
    label: 'Delete',
    confirmText: 'Are you sure to delete this dataset?',
    onConfirm: handleDelete
  }], [handleDelete, turnToEdit]);

  return (
    <DotMenu
      id='data-set-actions'
    >
      {menuItems}
    </DotMenu>
  )
}