import MuiAlert from '@mui/material/Alert';

import { TOAST_DURATION } from '@/common/constants';
import Snackbar from '@mui/material/Snackbar';
import { forwardRef, useCallback, useEffect, useState } from 'react';

const Alert = forwardRef(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toast = ({ open, severity, message, autoHideDuration = TOAST_DURATION, onClose }) => {
  const [showToast, setShowToast] = useState(open);
  const onCloseHandler = useCallback(
    () => {
      if (onClose) {
        onClose();
      }
      setShowToast(false);
    },
    [onClose],
  );

  useEffect(() => {
    setShowToast(open);
  }, [open]);
  
  return (
    <Snackbar open={showToast} autoHideDuration={autoHideDuration} onClose={onCloseHandler}>
      <Alert onClose={onCloseHandler} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Toast;
