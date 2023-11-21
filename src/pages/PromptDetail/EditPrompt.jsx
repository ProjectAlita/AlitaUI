import { useGetPromptQuery, useUpdatePromptMutation } from '@/api/prompts';
import { SOURCE_PROJECT_ID } from '@/common/constants';
import { stateDataToPrompt } from '@/common/promptApiUtils.js';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import EditPromptDetail from './EditPromptDetail';
import EditPromptTabs from './EditPromptTabs';

export default function EditPrompt() {
  const projectId = SOURCE_PROJECT_ID;
  const { currentPrompt } = useSelector((state) => state.prompts);
  const [updatePrompt] = useUpdatePromptMutation();
  const { promptId, version } = useParams();
  const { isLoading, data } = useGetPromptQuery({ projectId, promptId });
  const {
    versions, version_details: {
      name: currentVersionName = ''
    }
  } = data || { version_details: { name: '' } };

  const onSave = React.useCallback(async () => {
    await updatePrompt({
      ...stateDataToPrompt(currentPrompt),
      projectId,
    })
  }, [currentPrompt, updatePrompt, projectId]);

  if (!promptId) {
    return <div>No prompt id</div>;
  }

  return (
    <EditPromptTabs
      isLoading={isLoading}
      runTabContent={
        <EditPromptDetail
          onSave={onSave}
          versions={versions}
          currentVersionName={version || currentVersionName}
        />}
    />);
}

