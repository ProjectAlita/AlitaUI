import { useGetPromptQuery, useGetPublicPromptQuery } from '@/api/prompts';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import EditPromptTabs from './EditPromptTabs'
import { useProjectId, useViewModeFromUrl } from '../hooks';
import { PromptView, ViewMode } from '@/common/constants';

export default function EditPrompt() {
  const projectId = useProjectId();
  const viewMode = useViewModeFromUrl();
  const { promptId } = useParams();
  const { isLoading, isFetching, refetch } =
    useGetPromptQuery({ projectId, promptId }, { skip: !projectId || viewMode === ViewMode.Public });
  const { isLoading: isLoadingPublic, isFetching: isFetchingPublic, refetch: refetchPublicPrompt } =
    useGetPublicPromptQuery({ promptId }, { skip: viewMode !== ViewMode.Public });
  const isLoadingData = React.useMemo(() => {
    return isLoading || isFetching || isLoadingPublic || isFetchingPublic;
  }, [isFetching, isFetchingPublic, isLoading, isLoadingPublic]);


  React.useEffect(() => {
    if (projectId && promptId && viewMode !== ViewMode.Public) {
      refetch();
    } else if (viewMode === ViewMode.Public ) {
      refetchPublicPrompt();
    }
  }, [projectId, promptId, refetch, refetchPublicPrompt, viewMode]);

  if (!promptId) {
    return <div>No prompt id</div>;
  }
  return (<EditPromptTabs 
      isLoading={isLoadingData} 
      mode={viewMode === ViewMode.Moderator ? PromptView.MODERATOR : PromptView.EDIT}
  />);
}

