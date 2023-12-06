import { useGetPromptQuery } from '@/api/prompts';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import EditPromptTabs from './EditPromptTabs'
import { useProjectId } from './hooks';

export default function EditPrompt() {
  const projectId = useProjectId();
  const { promptId } = useParams();
  const { isLoading, isFetching, refetch } = useGetPromptQuery({ projectId, promptId }, { skip: !projectId });

  React.useEffect(() => {
    if (projectId && promptId) {
      refetch();
    }
  }, [projectId, promptId, refetch]);
 
  if (!promptId) {
    return <div>No prompt id</div>;
  }
  return (<EditPromptTabs isLoading={isLoading || isFetching} />);
}

