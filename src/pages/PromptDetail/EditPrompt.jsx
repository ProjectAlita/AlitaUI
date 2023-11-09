import { useGetPromptQuery, useUpdatePromptMutation } from '@/api/prompts';
import { SOURCE_PROJECT_ID } from '@/constants/constants';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import EditPromptTabs from './EditPromptTabs';

export default function EditPrompt() {
  const projectId = SOURCE_PROJECT_ID;
  const { currentPromptData } = useSelector((state) => state.prompts);
  const [updatePrompt] = useUpdatePromptMutation();
  const { promptId } = useParams();
  const { isLoading } = useGetPromptQuery({projectId, promptId});

  const onSave = React.useCallback(async () => {
    await updatePrompt({
      ...currentPromptData,
      projectId,
    })
  }, [currentPromptData, updatePrompt, projectId]);

  if (!promptId) {
    return <div>No prompt id</div>;
  }

  return (isLoading ? <div>Loading...</div> : <EditPromptTabs onSave={onSave}/>);
}

