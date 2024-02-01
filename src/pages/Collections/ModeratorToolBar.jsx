import {
  useApproveCollectionMutation,
  useRejectCollectionMutation
} from '@/api/prompts';
import { PromptStatus } from "@/common/constants";
import React from 'react';
import { useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import ModerationActions from '@/components/ModerationActions';
import Toast from '@/components/Toast';
import { buildErrorMessage } from '@/common/utils';

export default function ModeratorToolBar({ collectionId }) {
  const navigate = useNavigate();
  const [approveCollection, { isSuccess: isApproveSuccess, error: approveError }] = useApproveCollectionMutation();
  const [rejectCollection, { isSuccess: isRejectSuccess, error: rejectError }] = useRejectCollectionMutation();

  const { version } = useParams();
  const { versions, currentVersionFromDetail } = useSelector(state => state.prompts);
  const versionName = version || currentVersionFromDetail;
  const restOptionLength = React.useMemo(
    () => versions.filter(
      item => item.status === PromptStatus.OnModeration &&
        item.name !== versionName
    )?.length,
    [versions, versionName]
  );

  const onApprove = React.useCallback(async () => {
    await approveCollection({ collectionId });
  }, [approveCollection, collectionId]);

  const onReject = React.useCallback(async () => {
    await rejectCollection({ collectionId });
  }, [collectionId, rejectCollection]);

  React.useEffect(() => {
    if ((isApproveSuccess || isRejectSuccess) && (restOptionLength < 1)) {
      navigate(-1);
    }  
  }, [isApproveSuccess, isRejectSuccess, navigate, restOptionLength]);
 
  return (
    <>
      <ModerationActions
        approveWarningMessage='Are you sure you want to approve this collection?'
        rejectWarningMessage='Are you sure you want to decline this collection?'
        onApprove={onApprove}
        onReject={onReject}
        disabled={!collectionId}
      />
      <Toast
        open={isRejectSuccess || isRejectSuccess}
        severity={isRejectSuccess ? 'info' : 'success'}
        message={isRejectSuccess ? 'Collection has been declined successfully!' : 'Collection has been approved successfully!'}
      />
      <Toast
        open={rejectError || approveError}
        severity={'error'}
        message={buildErrorMessage(rejectError || approveError)}
      />
    </>
  )
}
