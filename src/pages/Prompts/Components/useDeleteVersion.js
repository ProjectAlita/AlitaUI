import { useDeleteVersionMutation } from '@/api/prompts';
import { useEffect, useCallback, useMemo } from 'react';
import { buildErrorMessage } from '@/common/utils';
import { useProjectId } from '../../hooks';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const replaceVersionInPath = (newVersionName, pathname, currentVersionName, promptId) => {
  const encodedVersion = encodeURIComponent(newVersionName);
  const originalPathname = decodeURI(pathname);
  return currentVersionName
    ?
    originalPathname.replace(`${promptId}/${encodeURIComponent(currentVersionName)}`, `${promptId}/${encodedVersion}`)
    :
    newVersionName
      ?
      originalPathname + '/' + encodedVersion
      :
      originalPathname;
}

export const useReplaceVersionInPath = (versions, currentVersionId) => {
  const { pathname, search } = useLocation();
  const { promptId, version } = useParams();
  const newVersionName = useMemo(() => {
    const newVersion = versions.find(item => item.name === 'latest') || versions.find(item => item.id !== currentVersionId);
    return newVersion?.name;
  }, [currentVersionId, versions]);

  const newPath = useMemo(() => {
    return replaceVersionInPath(newVersionName, pathname, version, promptId);
  }, [newVersionName, pathname, promptId, version]);
  return { newPath, search }
}

const useDeleteVersion = (currentVersionId, promptId, setOpenToast, setToastSeverity, setToastMessage) => {
  const navigate = useNavigate();
  const projectId = useProjectId();
  const { versions } = useSelector((state) => state.prompts);
  const { state } = useLocation();

  const [deleteVersion, {
    isLoading: isDeletingVersion,
    isSuccess: isDeleteVersionSuccess,
    isError: isDeleteVersionError,
    error: deleteVersionError,
    reset: resetDeleteVersion }] = useDeleteVersionMutation();

  useEffect(() => {
    if (isDeleteVersionSuccess || isDeleteVersionError) {
      setOpenToast(true);
    }
    if (isDeleteVersionError) {
      setToastSeverity('error');
      setToastMessage(buildErrorMessage(deleteVersionError));
    } else if (isDeleteVersionSuccess) {
      setToastSeverity('info');
      setToastMessage('Version has been deleted!');
    }
  }, [
    isDeleteVersionSuccess,
    isDeleteVersionError,
    deleteVersionError,
    setOpenToast,
    setToastSeverity,
    setToastMessage]);

  const doDeleteVersion = useCallback(
    async () => {
      await deleteVersion({ promptId, projectId, version: currentVersionId })
    },
    [currentVersionId, deleteVersion, projectId, promptId],
  );

  const { newPath, search } = useReplaceVersionInPath(versions, currentVersionId);

  const handleDeleteSuccess = useCallback(
    () => {
      navigate(
        {
          pathname: encodeURI(newPath),
          search,
        },
        {
          state,
          replace: true,
        });
      resetDeleteVersion();
    },
    [navigate, newPath, resetDeleteVersion, search, state]
  );

  const onFinishDeleteVersion = useCallback(
    () => {
      if (isDeleteVersionError) {
        resetDeleteVersion();
      } else if (isDeleteVersionSuccess) {
        handleDeleteSuccess();
      }
    },
    [handleDeleteSuccess, isDeleteVersionError, isDeleteVersionSuccess, resetDeleteVersion]);

  return {
    doDeleteVersion,
    isDeletingVersion,
    resetDeleteVersion,
    onFinishDeleteVersion,
    isDeleteVersionError,
    isDeleteVersionSuccess
  };
}

export default useDeleteVersion;