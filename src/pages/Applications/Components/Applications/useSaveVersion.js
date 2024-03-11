import { useApplicationEditMutation } from '@/api/applications';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const useSaveVersion = (
  projectId,
  formik,
  context,
  chatSettings,
) => {
  const { id: author_id } = useSelector((state => state.user));
  const [saveFn, { isError: isSaveError, isSuccess: isSaveSuccess, error: saveError, isLoading: isSaving, reset: resetSave }] = useApplicationEditMutation();

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
          application_settings: {
            chat: {
              embedding_model: chatSettings.embedding_model?.model_name ? chatSettings.embedding_model : undefined,
              top_k: chatSettings.top_k,
              top_p: chatSettings.top_p,
              chat_model: chatSettings.chat_model?.model_name ? chatSettings.chat_model : undefined,
              temperature: chatSettings.temperature,
              max_length: chatSettings.max_length,
            }
          }
        }
      });
    },
    [saveFn, formik.values?.id, formik.values?.owner_id, formik.values?.name, formik.values?.description, formik.values?.storage, formik.values?.embedding_model, formik.values?.embedding_model_settings, formik.values?.version_details?.name, formik.values?.version_details?.id, formik.values?.version_details?.tags, projectId, author_id, context, chatSettings.embedding_model, chatSettings.top_k, chatSettings.top_p, chatSettings.chat_model, chatSettings.temperature, chatSettings.max_length],
  )



  return { onSave, isSaveError, isSaveSuccess, saveError, isSaving, resetSave }
}

export default useSaveVersion;