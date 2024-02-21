import DotMenu from "@/components/DotMenu";
import { useCallback, useMemo } from "react";

export default function DataSetActions({
  setIsEdit
}) {
  const turnToEdit = useCallback(() => {
    setIsEdit(true)
  }, [setIsEdit])

  const menuItems = useMemo(() => [{
    label: 'Update',
    onClick: turnToEdit
  }, {
    label: 'Delete',
    confirmText: 'Are you sure to delete this dataset?',
    onConfirm: () => {
      // eslint-disable-next-line no-console
      console.log('delete')
    }
  }], [turnToEdit]);

  return (
    <DotMenu
      id='data-set-actions'
    >
      {menuItems}
    </DotMenu>
  )
}