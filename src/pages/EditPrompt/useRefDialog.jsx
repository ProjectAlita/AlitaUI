import React from 'react';

const useRefDialog = (ref) => {
  const [open, setOpen] = React.useState(false);

  const closeDialog = React.useCallback(() => {
      setOpen(false);
  }, []);

  React.useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: closeDialog
  }), [closeDialog]);
  return {
    open,
    closeDialog
  }
}

export default useRefDialog;