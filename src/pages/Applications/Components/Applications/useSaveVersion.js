import { useApplicationEditMutation } from '@/api/applications';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const useSaveVersion = ({
  projectId,
  getFormValues,
  chatSettings,
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
    [getFormValues, saveFn, projectId, author_id, chatSettings.embedding_model, chatSettings.top_k, chatSettings.top_p, chatSettings.chat_model, chatSettings.temperature, chatSettings.max_length],
  )



  return { onSave, isSaveError, isSaveSuccess, saveError, isSaving, resetSave }
}

export default useSaveVersion;