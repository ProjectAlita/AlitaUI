import { useDatasourceEditMutation } from '@/api/datasources';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const useSaveVersion = (
  projectId, 
  formik, 
  context, 
  chatSettings, 
  searchSettings, 
  deduplicateSettings) => {
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
          datasource_settings: {
            chat: {
              embedding_model: chatSettings.embedding_model?.model_name ? chatSettings.embedding_model : undefined,
              top_k: chatSettings.top_k,
              top_p: chatSettings.top_p,
              chat_model: chatSettings.chat_model?.model_name ? chatSettings.chat_model : undefined,
              temperature: chatSettings.temperature,
              max_length: chatSettings.max_length,
            },
            search: {
              embedding_model: searchSettings.embedding_model?.model_name ? searchSettings.embedding_model : undefined,
              top_k: searchSettings.top_k,
              cut_off_score: searchSettings.cut_off_score
            },
            deduplicate: {
              embedding_model: deduplicateSettings.embedding_model?.model_name ? deduplicateSettings.embedding_model : undefined,
              cut_off_score: deduplicateSettings.cut_off_score
            }
          }
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
      chatSettings.embedding_model,
      chatSettings.top_k,
      chatSettings.top_p,
      chatSettings.chat_model,
      chatSettings.temperature,
      chatSettings.max_length,
      searchSettings.embedding_model,
      searchSettings.top_k,
      searchSettings.cut_off_score,
      deduplicateSettings.embedding_model,
      deduplicateSettings.cut_off_score,
      projectId,
      saveFn],
  )



  return { onSave, isSaveError, isSaveSuccess, saveError, isSaving, resetSave }
}

export default useSaveVersion;