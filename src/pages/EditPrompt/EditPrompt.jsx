import { useGetPromptQuery } from '@/api/prompts';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import EditPromptTabs from './EditPromptTabs'
import { useProjectId } from './hooks';

export default function EditPrompt() {
  const projectId = useProjectId();
  const { promptId } = useParams();
  const { isLoading } = useGetPromptQuery({ projectId, promptId }, { skip: !projectId });
  if (!promptId) {
    return <div>No prompt id</div>;
  }
  return (<EditPromptTabs isLoading={isLoading} />);
}

