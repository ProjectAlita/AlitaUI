import {
  useApproveVersionMutation,
  useRejectVersionMutation
} from '@/api/prompts';
import { PERMISSIONS, PromptStatus } from "@/common/constants";
import { buildErrorMessage } from '@/common/utils';
import AlertDialogV2 from '@/components/AlertDialogV2';
import Toast from '@/components/Toast';
import React from 'react';
import { useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import { NormalRoundButton } from './Common';
import { HeaderContainer } from './EditModeToolBar';

export default function ModeratorToolBar() {
  const navigate = useNavigate();
  const { permissions = [] } = useSelector(state => state.user);
  const [approveVersion, { isSuccess: isApproveSuccess, error: approveError }] = useApproveVersionMutation();
  const [rejectVersion, { isSuccess: isRejectSuccess, error: rejectError }] = useRejectVersionMutation();

  const [openApproveDialog, setOpenApproveDialog] = React.useState(false);
  const [openRejectDialog, setOpenRejectDialog] = React.useState(false);

  const onClickApprove = React.useCallback(() => {
    setOpenApproveDialog(true);
  }, []);
  const onClickReject = React.useCallback(() => {
    setOpenRejectDialog(true);
  }, []);

  const { version } = useParams();
  const { versions, currentVersionFromDetail } = useSelector(state => state.prompts);
  const versionName = version || currentVersionFromDetail;
  const versionId = React.useMemo(() => versions.find(v => v.name === versionName)?.id, [versions, versionName]);
  const versionStatus = React.useMemo(() => versions.find(v => v.name === versionName)?.status, [versions, versionName]);
  const isOnModeration = React.useMemo(() => versionStatus === PromptStatus.OnModeration, [versionStatus]);
  const isPublished = React.useMemo(() => versionStatus === PromptStatus.Published, [versionStatus]);
  const isRejected = React.useMemo(() => versionStatus === PromptStatus.Rejected, [versionStatus]);
  const restOptionLength = React.useMemo(
    () => versions.filter(
      item => item.status === PromptStatus.OnModeration &&
        item.name !== versionName
    )?.length,
    [versions, versionName]
  );

  const onConfirmApprove = React.useCallback(async () => {
    await approveVersion({ versionId });
  }, [approveVersion, versionId]);

  const onConfirmReject = React.useCallback(async () => {
    await rejectVersion({ versionId });
  }, [rejectVersion, versionId]);

  React.useEffect(() => {
    if ((isApproveSuccess || isRejectSuccess) && (restOptionLength < 1)) {
      navigate(-1);
    }
  }, [isApproveSuccess, isRejectSuccess, navigate, restOptionLength]);

  return <>
    <HeaderContainer>
      {
        permissions.includes(PERMISSIONS.moderation.reject) &&
        <>
          <NormalRoundButton
            variant='contained'
            color={isRejected ? 'primary' : 'secondary'}
            disabled={!isOnModeration}
            onClick={onClickReject}
          >
            {isRejected ? 'Declined' : 'Decline'}
          </NormalRoundButton>
          <AlertDialogV2
            open={openRejectDialog}
            setOpen={setOpenRejectDialog}
            title='Warning'
            content='Are you sure you want to decline this prompt version?'
            onConfirm={onConfirmReject}
          />
          <Toast
            open={isRejectSuccess}
            severity='info'
            message='Prompt has been declined successfuly!'
          />
        </>
      }

      {
        permissions.includes(PERMISSIONS.moderation.approve) &&
        <>
          <NormalRoundButton
            variant='contained'
            color={isPublished ? 'primary' : 'secondary'}
            disabled={!isOnModeration}
            onClick={onClickApprove}
          >
            {isPublished ? 'Approved' : 'Approve'}
          </NormalRoundButton>
          <AlertDialogV2
            open={openApproveDialog}
            setOpen={setOpenApproveDialog}
            title='Warning'
            content='Are you sure you want to approve this prompt version?'
            onConfirm={onConfirmApprove}
          />
          <Toast
            open={isApproveSuccess}
            severity='success'
            message='Prompt has been approved successfuly!'
          />
        </>
      }

      <Toast
        open={rejectError || approveError}
        severity={'error'}
        message={buildErrorMessage(rejectError || approveError)}
      />
    </HeaderContainer>
  </>
}
