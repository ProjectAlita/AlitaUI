import { useApplicationEditMutation } from '@/api/applications';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const useSaveVersion = ({
  projectId,
  getFormValues,
}) => {

  const { id: author_id } = useSelector((state => state.user));
  const [saveFn, { isError: isSaveError, isSuccess: isSaveSuccess, error: saveError, isLoading: isSaving, reset: resetSave }] = useApplicationEditMutation();

  const onSave = useCallback(
    async () => {
      const { version_details, ...values } = getFormValues();
      await saveFn({
        ...values,
        projectId,
        version:
        {
          ...version_details,
          author_id,
        }
      });
    },
    [getFormValues, saveFn, projectId, author_id],
  )



  return { onSave, isSaveError, isSaveSuccess, saveError, isSaving, resetSave }
}

export default useSaveVersion;