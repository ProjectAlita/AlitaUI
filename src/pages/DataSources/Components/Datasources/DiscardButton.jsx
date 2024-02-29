import AlertDialog from '@/components/AlertDialog';
import Button from '@/components/Button';
import { useCallback, useState } from 'react';

export default function DiscardButton({ disabled, onDiscard }) {
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
      onDiscard();
    },
    [onCloseAlert, onDiscard],
  );

  return (
    <>
      <Button disabled={disabled} variant='contained' color='secondary' onClick={onClickDiscard}>
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