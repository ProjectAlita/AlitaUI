import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import {
  useNavBlocker,
  useSelectedProjectId,
} from '@/pages/hooks';

import NormalRoundButton from '@/components/NormalRoundButton';
import DiscardButton from './DiscardButton';
import { useMemo, useCallback, useEffect } from 'react';
import useToast from '@/components/useToast';
import { buildErrorMessage } from '@/common/utils';
import useSaveVersion from './useSaveVersion';

const TabBarItems = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'reverse-row',
}));

export default function CreateApplicationTabBar({
  getFormValues,
  isFormDirty,
  onSuccess,
  onDiscard,
}) {

  const projectId = useSelectedProjectId();

  const { onSave, isSaveError, isSaveSuccess, saveError, isSaving, resetSave } = useSaveVersion({
    projectId,
    getFormValues,
  })
  const blockOptions = useMemo(() => {
    return {
      blockCondition: !!isFormDirty
    }
  }, [isFormDirty]);
  useNavBlocker(blockOptions);

  const onCloseToast = useCallback(
    () => {
      if (isSaveSuccess) {
        onSuccess();
        resetSave();
      } else if (isSaveError) {
        resetSave();
      }
    },
    [isSaveError, isSaveSuccess, onSuccess, resetSave],
  )

  const { ToastComponent: Toast, toastSuccess, toastError } = useToast({ onCloseToast });

  useEffect(() => {
    if (isSaveError) {
      toastError(buildErrorMessage(saveError));
    }
  }, [isSaveError, saveError, toastError])

  useEffect(() => {
    if (isSaveSuccess) {
      toastSuccess('The application has been updated');
    }
  }, [isSaveSuccess, toastSuccess])

  return <>
    <TabBarItems>
      
      <NormalRoundButton
        disabled={isSaving || isSaveSuccess || !isFormDirty}
        variant="contained"
        color="secondary"
        onClick={onSave}>
        Save
        {isSaving && <StyledCircleProgress size={20} />}
      </NormalRoundButton>
      <DiscardButton disabled={isSaving || !isFormDirty} onDiscard={onDiscard} />
    </TabBarItems>
    <Toast />
  </>
}