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

export default function EditApplicationTabBar({
  getFormValues,
  chatSettings,
  onSuccess,
  hasChangedTheApplication,
  onDiscard,
  versionStatus,
  applicationId,
}) {

  const projectId = useSelectedProjectId();
  const canPublish = useMemo(() => projectId == PUBLIC_PROJECT_ID && versionStatus === PromptStatus.Draft, [projectId, versionStatus])
  const canUnpublish = useMemo(() => projectId == PUBLIC_PROJECT_ID && versionStatus === PromptStatus.Published, [projectId, versionStatus])

  const { onSave, isSaveError, isSaveSuccess, saveError, isSaving, resetSave } = useSaveVersion({
    projectId,
    getFormValues,
    chatSettings,
  })
  const {
    onPublish,
    isPublishingVersion,
    isPublishError,
    isPublishSuccess,
    publishError,
    resetPublish
  } = usePublishVersion(projectId, applicationId)
  const {
    onUnpublish,
    isUnpublishingVersion,
    isUnpublishError,
    isUnpublishSuccess,
    unpublishError,
    resetUnpublish
  } = useUnpublishVersion(projectId, applicationId);
  useNavBlocker({
    blockCondition: hasChangedTheApplication,
  });

  const onCloseToast = useCallback(
    () => {
      if (isSaveSuccess) {
        onSuccess();
        resetSave();
      } else if (isSaveError) {
        resetSave();
      } else if (isPublishSuccess) {
        onSuccess();
        resetPublish();
      } else if (isPublishError) {
        resetPublish();
      } else if (isUnpublishSuccess) {
        onSuccess();
        resetUnpublish();
      } else if (isUnpublishError) {
        resetUnpublish();
      }
    },
    [
      isPublishError,
      isPublishSuccess,
      isSaveError,
      isSaveSuccess,
      isUnpublishError,
      isUnpublishSuccess,
      onSuccess,
      resetPublish,
      resetSave,
      resetUnpublish],
  )

  const { ToastComponent: Toast, toastSuccess, toastError } = useToast({ onCloseToast });

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
      toastSuccess('The application has been updated');
    } else if (isPublishSuccess) {
      toastSuccess('The application has been published');
    } else if (isUnpublishSuccess) {
      toastSuccess('The application has been unpublished');
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
      <NormalRoundButton
        disabled={isSaving || isSaveSuccess || !hasChangedTheApplication}
        variant="contained"
        color="secondary"
        onClick={onSave}>
        Save
        {isSaving && <StyledCircleProgress size={20} />}
      </NormalRoundButton>
      <DiscardButton disabled={isSaving || !hasChangedTheApplication} onDiscard={onDiscard} />
    </TabBarItems>
    <Toast />
  </>
}