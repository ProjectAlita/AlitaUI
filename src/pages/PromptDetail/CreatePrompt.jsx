import { useCreatePromptMutation } from '@/api/prompts';
import { SOURCE_PROJECT_ID } from '@/constants/constants';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EditPromptTabs from './EditPromptTabs';

export default function CreatePrompt() {
  const navigate = useNavigate();
  const { currentPrompt } = useSelector((state) => state.prompts);

  const [createPrompt] = useCreatePromptMutation();

  const onSave = React.useCallback(async () => {
    const {name, description, prompt} = currentPrompt;
    const { id: promptId } = await createPrompt({
      projectId: SOURCE_PROJECT_ID,
      type: 'chat',
      name, 
      description,
      prompt
    })
    if (promptId) {
      navigate('/prompt/'+ promptId);
    }
  }, [currentPrompt, createPrompt, navigate]);

  return <EditPromptTabs onSave={onSave}/>;
}
