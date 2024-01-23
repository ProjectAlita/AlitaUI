import { PERMISSIONS } from "@/common/constants";
import AlertDialogV2 from '@/components/AlertDialogV2';
import React from 'react';
import { useSelector } from "react-redux";
import NormalRoundButton from '@/components/NormalRoundButton';
import HeaderContainer from '@/components/HeaderContainer';


export default function ModerationActions({
  approveWarningMessage,
  rejectWarningMessage,
  onApprove,
  onReject,
  disabled,
}) {
  const { permissions = [] } = useSelector(state => state.user);

  const [openApproveDialog, setOpenApproveDialog] = React.useState(false);
  const [openRejectDialog, setOpenRejectDialog] = React.useState(false);

  const onClickApprove = React.useCallback(() => {
    setOpenApproveDialog(true);
  }, []);
  const onClickReject = React.useCallback(() => {
    setOpenRejectDialog(true);
  }, []);

  const onConfirmApprove = React.useCallback(async () => {
    await onApprove();
  }, [onApprove]);

  const onConfirmReject = React.useCallback(async () => {
    await onReject();
  }, [onReject]);

  return <HeaderContainer>
    {
      permissions.includes(PERMISSIONS.moderation.reject) &&
      <>
        <NormalRoundButton
          variant='contained'
          color='secondary'
          disabled={disabled}
          onClick={onClickReject}
        >
          {'Decline'}
        </NormalRoundButton>
        <AlertDialogV2
          open={openRejectDialog}
          setOpen={setOpenRejectDialog}
          title='Warning'
          content={rejectWarningMessage}
          onConfirm={onConfirmReject}
        />

      </>
    }

    {
      permissions.includes(PERMISSIONS.moderation.approve) &&
      <>
        <NormalRoundButton
          variant='contained'
          color='secondary'
          disabled={disabled}
          onClick={onClickApprove}
        >
          {'Approve'}
        </NormalRoundButton>
        <AlertDialogV2
          open={openApproveDialog}
          setOpen={setOpenApproveDialog}
          title='Warning'
          content={approveWarningMessage}
          onConfirm={onConfirmApprove}
        />
      </>
    }
  </HeaderContainer>
}
