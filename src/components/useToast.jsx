import { useCallback, useMemo, useState } from 'react';
import Toast from './Toast';

const useToast = (topPosition) => {
  const [toastProps, setToastProps] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const openToast = useCallback((severity, message) => {
    setToastProps({ open: true, severity, message });
  }, []);

  const clearToast = useCallback(() => {
    setToastProps((prev) => ({ ...prev, message: '', open: false }));
  }, []);

  const toastHandlers = useMemo(() => ({
    toastError: (message) => openToast('error', message),
    toastSuccess: (message) => openToast('success', message),
    toastInfo: (message) => openToast('info', message),
    toastWarning: (message) => openToast('warning', message),
  }), [openToast]);

  const ToastComponent = useCallback(() => (
    <Toast
      open={toastProps.open}
      severity={toastProps.severity}
      message={toastProps.message}
      onClose={clearToast}
      topPosition={topPosition}
    />
  ), [toastProps.open, toastProps.severity, toastProps.message, clearToast, topPosition]);

  return {
    ...toastHandlers,
    clearToast,
    ToastComponent,
  };
};

export default useToast;