import {
  useApproveVersionMutation,
  useRejectVersionMutation
} from '@/api/prompts';
import { PromptStatus } from "@/common/constants";
import React from 'react';
import { useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import ModerationActions from '@/components/ModerationActions';
import Toast from '@/components/Toast';
import { buildErrorMessage } from '@/common/utils';

export default function ModeratorToolBar() {
  const navigate = useNavigate();
  const [approveVersion, { isSuccess: isApproveSuccess, error: approveError }] = useApproveVersionMutation();
  const [rejectVersion, { isSuccess: isRejectSuccess, error: rejectError }] = useRejectVersionMutation();

  const { version } = useParams();
  const { versions, currentVersionFromDetail } = useSelector(state => state.prompts);
  const versionName = version || currentVersionFromDetail;
  const versionId = React.useMemo(() => versions.find(v => v.name === versionName)?.id, [versions, versionName]);
  const versionStatus = React.useMemo(() => versions.find(v => v.name === versionName)?.status, [versions, versionName]);
  const isOnModeration = React.useMemo(() => versionStatus === PromptStatus.OnModeration, [versionStatus]);
  const restOptionLength = React.useMemo(
    () => versions.filter(
      item => item.status === PromptStatus.OnModeration &&
        item.name !== versionName
    )?.length,
    [versions, versionName]
  );

  const onApprove = React.useCallback(async () => {
    await approveVersion({ versionId });
  }, [approveVersion, versionId]);

  const onReject = React.useCallback(async () => {
    await rejectVersion({ versionId });
  }, [rejectVersion, versionId]);

  React.useEffect(() => {
    if ((isApproveSuccess || isRejectSuccess) && (restOptionLength < 1)) {
      navigate(-1);
    }  
  }, [isApproveSuccess, isRejectSuccess, navigate, restOptionLength]);
 
  return (
    <>
      <ModerationActions
        approveWarningMessage='Are you sure you want to approve this prompt version?'
        rejectWarningMessage='Are you sure you want to decline this prompt version?'
        onApprove={onApprove}
        onReject={onReject}
        disabled={!isOnModeration}
      />
      <Toast
        open={isRejectSuccess || isRejectSuccess}
        severity={isRejectSuccess ? 'info' : 'success'}
        message={isRejectSuccess ? 'Prompt has been declined successfully!' : 'Prompt has been approved successfully!'}
      />
      <Toast
        open={rejectError || approveError}
        severity={'error'}
        message={buildErrorMessage(rejectError || approveError)}
      />
    </>
  )
}
