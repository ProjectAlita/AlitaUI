import { useCallback, useMemo, useState } from 'react';
import Toast from './Toast';

const useToast = (options = {}) => {
  const { autoHideDuration = 3000, topPosition = '90px', onCloseToast, icon } = options;
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
    if (onCloseToast) {
      onCloseToast();
    }
  }, [onCloseToast]);

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
      autoHideDuration={autoHideDuration}
      topPosition={topPosition}
      icon={icon}
    />
  ), [toastProps.open, toastProps.severity, toastProps.message, clearToast, autoHideDuration, topPosition, icon]);

  return {
    ...toastHandlers,
    clearToast,
    ToastComponent,
  };
};

export default useToast;