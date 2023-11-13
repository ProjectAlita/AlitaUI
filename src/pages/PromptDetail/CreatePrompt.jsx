import { useCreatePromptMutation } from '@/api/prompts';
import { SOURCE_PROJECT_ID } from '@/common/constants';
import Toast from '@/components/Toast';
import { actions } from '@/reducers/prompts';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EditPromptDetail from './EditPromptDetail';
import EditPromptTabs from './EditPromptTabs';

export default function CreatePrompt() {
  const navigate = useNavigate();
  const { currentPrompt } = useSelector((state) => state.prompts);

  const [createPrompt, {isSuccess, data, isError, error}] = useCreatePromptMutation();

  const dispatch = useDispatch();
  const doCreate = React.useCallback(async () => {
    const { name, description, prompt } = currentPrompt;
    if (!name) {
      dispatch(actions.setValidationError({
        name: 'Name is required',
      }))
      return
    }
    await createPrompt({
      projectId: SOURCE_PROJECT_ID,
      type: 'chat',
      name, 
      description,
      prompt,
      model_settings: {
        model_name: 'gpt-3.5-turbo',
        temperature: 1.0,
        max_tokens: 117,
        top_p: 0.5
      }
    });
    
  }, [currentPrompt, createPrompt, dispatch]);

  React.useEffect(()=> {
    const promptId = data?.id;
    if (promptId) {
      navigate('/prompt/'+ promptId);
    }
  }, [data, navigate]);

  React.useEffect(()=> {
    dispatch(actions.setValidationError({}));
    return () => {
      dispatch(actions.setValidationError({}));
    }
  }, [dispatch]);

  return <>
    <EditPromptTabs runTabContent={<EditPromptDetail onSave={doCreate} />}/>
    <Toast 
      open={isError || isSuccess} 
      severity={isError ? 'error' : 'success' }
      message={isError ? error?.data?.message : 'Create prompt success'}
    />
  </>;
}
