import { useDeleteVersionMutation } from '@/api/prompts';
import { useEffect } from 'react';
import { buildErrorMessage } from '@/common/utils';

const useDeleteVersion = (setOpenToast, setToastSeverity, setToastMessage) => {
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
        setToastSeverity('success');
        setToastMessage('Deleted the version successfully');
      }
    }, [
      isDeleteVersionSuccess, 
      isDeleteVersionError, 
      deleteVersionError, 
      setOpenToast, 
      setToastSeverity, 
      setToastMessage]);

  return {
    deleteVersion,
    isDeletingVersion,
    isDeleteVersionSuccess,
    isDeleteVersionError,
    resetDeleteVersion
  };
}

export default useDeleteVersion;