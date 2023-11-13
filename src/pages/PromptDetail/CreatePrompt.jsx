import { useCreatePromptMutation } from '@/api/prompts';
import { SOURCE_PROJECT_ID } from '@/common/constants';
import Toast from '@/components/Toast';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EditPromptTabs from './EditPromptTabs';

export default function CreatePrompt() {
  const navigate = useNavigate();
  const { currentPrompt } = useSelector((state) => state.prompts);

  const [createPrompt, {isSuccess, data, isError, error}] = useCreatePromptMutation();

  const doCreate = React.useCallback(async () => {
    const { name, description, prompt } = currentPrompt;
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
    
  }, [currentPrompt, createPrompt]);

  React.useEffect(()=> {
    const promptId = data?.id;
    if (promptId) {
      navigate('/prompt/'+ promptId);
    }
  }, [data, navigate]);

  return <>
    <EditPromptTabs onSave={doCreate}/>
    <Toast 
      open={isError || isSuccess} 
      severity={isError ? 'error' : 'success' }
      message={isError ? error?.data?.message : 'Create prompt success'}
    />
  </>;
}
