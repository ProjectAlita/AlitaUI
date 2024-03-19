import { useDatasourceEditMutation } from '@/api/datasources';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const useSaveVersion = (
  projectId, 
  formik, 
  context, 
  dataSourceSettings
) => {
  const { id: author_id } = useSelector((state => state.user));
  const [saveFn, { isError: isSaveError, isSuccess: isSaveSuccess, error: saveError, isLoading: isSaving, reset: resetSave }] = useDatasourceEditMutation();

  const onSave = useCallback(
    async () => {
      await saveFn({
        id: formik.values?.id,
        owner_id: formik.values?.owner_id,
        name: formik.values?.name,
        description: formik.values?.description,
        storage: formik.values?.storage,
        projectId,
        embedding_model: formik.values?.embedding_model,
        embedding_model_settings: formik.values?.embedding_model_settings,
        version:
        {
          author_id,
          name: formik.values?.version_details?.name,
          id: formik.values?.version_details?.id,
          context,
          tags: formik.values?.version_details?.tags || [],
          datasource_settings: dataSourceSettings
        }
      });
    },
    [
      formik.values?.version_details?.id,
      formik.values?.version_details?.name,
      author_id,
      formik.values?.id,
      formik.values?.owner_id,
      formik.values?.name,
      formik.values?.description,
      formik.values?.embedding_model,
      formik.values?.embedding_model_settings,
      formik.values?.storage,
      context,
      formik.values?.version_details?.tags,
      dataSourceSettings,
      projectId,
      saveFn],
  )



  return { onSave, isSaveError, isSaveSuccess, saveError, isSaving, resetSave }
}

export default useSaveVersion;