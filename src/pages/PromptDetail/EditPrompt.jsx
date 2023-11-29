import { useGetPromptQuery } from '@/api/prompts';
import { SOURCE_PROJECT_ID } from '@/common/constants';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import EditPromptTabs from './EditPromptTabs'

export default function EditPrompt() {
  const projectId = SOURCE_PROJECT_ID;
  const { promptId,  } = useParams();
  const { isLoading } = useGetPromptQuery({ projectId, promptId });
  if (!promptId) {
    return <div>No prompt id</div>;
  }
  return (<EditPromptTabs isLoading={isLoading} />);
}

