import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import {
  useNavBlocker,
  useSelectedProjectId,
} from '@/pages/hooks';

import NormalRoundButton from '@/components/NormalRoundButton';
import DiscardButton from './DiscardButton';
import { PUBLIC_PROJECT_ID, PromptStatus } from '@/common/constants';
import { useMemo, useCallback, useEffect } from 'react';
import usePublishVersion from './usePublishVersion';
import useToast from '@/components/useToast';
import { buildErrorMessage } from '@/common/utils';
import useSaveVersion from './useSaveVersion';
import useUnpublishVersion from './useUnpublishVersion';

const TabBarItems = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'reverse-row',
}));

export default function EditDataSourceTabBar({
  formik,
  context,
  chatSettings,
  searchSettings,
  deduplicateSettings,
  fetchFn,
  onSuccess,
  hasChangedTheDataSource,
  onDiscard,
  versionStatus,
  datasourceId,
}) {

  const projectId = useSelectedProjectId();
  const canPublish = useMemo(() => projectId == PUBLIC_PROJECT_ID && versionStatus === PromptStatus.Draft, [projectId, versionStatus])
  const canUnpublish = useMemo(() => projectId == PUBLIC_PROJECT_ID && versionStatus === PromptStatus.Published, [projectId, versionStatus])

  const { onSave, isSaveError, isSaveSuccess, saveError, isSaving, resetSave } = useSaveVersion(
    projectId,
    formik,
    context,
    chatSettings,
    searchSettings,
    deduplicateSettings)
  const {
    onPublish,
    isPublishingVersion,
    isPublishError,
    isPublishSuccess,
    publishError,
    resetPublish
  } = usePublishVersion(projectId, datasourceId)
  const {
    onUnpublish,
    isUnpublishingVersion,
    isUnpublishError,
    isUnpublishSuccess,
    unpublishError,
    resetUnpublish
  } = useUnpublishVersion(projectId, datasourceId);
  useNavBlocker({
    blockCondition: hasChangedTheDataSource,
  });

  const onCloseToast = useCallback(
    () => {
      if (isSaveSuccess) {
        fetchFn({ projectId, datasourceId }, false)
        onSuccess();
        resetSave();
      } else if (isSaveError) {
        resetSave();
      } else if (isPublishSuccess) {
        fetchFn({ projectId, datasourceId }, false)
        onSuccess();
        resetPublish();
      } else if (isPublishError) {
        resetPublish();
      } else if (isUnpublishSuccess) {
        fetchFn({ projectId, datasourceId }, false)
        onSuccess();
        resetUnpublish();
      } else if (isUnpublishError) {
        resetUnpublish();
      }
    },
    [
      datasourceId, 
      fetchFn, 
      isPublishError, 
      isPublishSuccess, 
      isSaveError, 
      isSaveSuccess, 
      isUnpublishError, 
      isUnpublishSuccess, 
      onSuccess, 
      projectId, 
      resetPublish, 
      resetSave, 
      resetUnpublish],
  )

  const { ToastComponent: Toast, toastSuccess, toastError } = useToast({onCloseToast});

  useEffect(() => {
    if (isSaveError) {
      toastError(buildErrorMessage(saveError));
    } else if (isPublishError) {
      toastError(buildErrorMessage(publishError));
    } else if (isUnpublishError) {
      toastError(buildErrorMessage(unpublishError));
    }
  }, [isPublishError, isSaveError, isUnpublishError, publishError, saveError, toastError, unpublishError])

  useEffect(() => {
    if (isSaveSuccess) {
      toastSuccess('The datasource has been updated');
    } else if (isPublishSuccess) {
      toastSuccess('The datasource has been published');
    } else if (isUnpublishSuccess) {
      toastSuccess('The datasource has been unpublished');
    }
  }, [isPublishSuccess, isSaveSuccess, isUnpublishSuccess, toastSuccess])

  return <>
    <TabBarItems>
      {
        canPublish && <NormalRoundButton
          disabled={isPublishingVersion || isPublishSuccess}
          variant='contained'
          color='secondary'
          onClick={onPublish}
        >
          Publish
          {isPublishingVersion && <StyledCircleProgress size={20} />}
        </NormalRoundButton>
      }
      {
        canUnpublish &&
        <NormalRoundButton
          disabled={isUnpublishSuccess || isUnpublishingVersion}
          variant='contained'
          color='secondary'
          onClick={onUnpublish}
        >
          Unpublish
          {isUnpublishingVersion && <StyledCircleProgress size={20} />}
        </NormalRoundButton>
      }
      <NormalRoundButton disabled={isSaving || isSaveSuccess || !hasChangedTheDataSource} variant="contained" color="secondary" onClick={onSave}>
        Save
        {isSaving && <StyledCircleProgress size={20} />}
      </NormalRoundButton>
      <DiscardButton disabled={isSaving || !hasChangedTheDataSource} onDiscard={onDiscard} />
    </TabBarItems>
    <Toast />
  </>
}