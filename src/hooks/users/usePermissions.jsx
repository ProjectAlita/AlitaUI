import { ViewMode } from "@/common/constants";
import { useViewMode } from "@/pages/hooks";
import { useMemo } from "react";
import { useSelector } from "react-redux";


export function useDataSoucePermissions() {
  const { permissions = [] } = useSelector(state => state.user);
  const viewMode = useViewMode();
  const isOwnerView = useMemo(() => viewMode === ViewMode.Owner, [viewMode]);
  const canCreate = useMemo(() => isOwnerView &&
    permissions.includes('models.datasources.datasources.create'), [isOwnerView, permissions]);
  const canUpdate = useMemo(() => isOwnerView &&
    permissions.includes('models.datasources.datasources.update'), [isOwnerView, permissions]);
  const canDelete = useMemo(() => isOwnerView &&
    permissions.includes('models.datasources.datasource.delete'), [isOwnerView, permissions]);
  return {
    canCreate,
    canUpdate,
    canDelete,
  }
}