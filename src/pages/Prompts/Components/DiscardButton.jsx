import AlertDialog from '@/components/AlertDialog';
import Button from '@/components/Button';
import { useHasPromptChange } from '@/pages/hooks';
import { actions as promptSliceActions } from '@/slices/prompts';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function DiscardButton() {
  const dispatch = useDispatch();
  const hasCurrentPromptBeenChanged = useHasPromptChange();

  const [openAlert, setOpenAlert] = useState(false);
  const onClickDiscard = useCallback(() => {
    setOpenAlert(true);
  }, []);

  const onCloseAlert = useCallback(() => {
    setOpenAlert(false);
  }, []);

  const onConfirmDelete = useCallback(
    () => {
      onCloseAlert();
      dispatch(
        promptSliceActions.useCurrentPromptDataSnapshot()
      );
    },
    [dispatch, onCloseAlert],
  );

  return (
    <>
      <Button disabled={!hasCurrentPromptBeenChanged} variant='contained' color='secondary' onClick={onClickDiscard}>
        Discard
      </Button>
      <AlertDialog
        title='Warning'
        alertContent="Are you sure to drop the changes?"
        open={openAlert}
        onClose={onCloseAlert}
        onCancel={onCloseAlert}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}