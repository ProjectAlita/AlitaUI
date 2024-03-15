import AlertDialog from "./AlertDialog";
import React from 'react';
import { useBlocker } from 'react-router-dom';
import { useNavBlocker } from '@/pages/hooks';

export default function UnsavedDialog() {
  const {
    isBlockNav,
    isResetApiState,
    setBlockNav,
    setIsResetApiState,
    resetApiState,
  } = useNavBlocker();

  const blockerFn = React.useCallback(
    ({ currentLocation, nextLocation }) => {
      return isBlockNav &&
        (currentLocation.pathname !== nextLocation.pathname)
    },
    [isBlockNav]
  );
  const blocker = useBlocker(blockerFn);

  const isBlocked = React.useMemo(() =>
    blocker.state === 'blocked',
    [blocker]);

  const cancelNavigate = React.useCallback(
    () => {
      blocker.reset();
    },
    [blocker],
  );

  const confirmNavigate = React.useCallback(
    () => {
      if (isResetApiState && resetApiState) {
        resetApiState();
        setIsResetApiState(false);
      }
      setBlockNav(false);
      blocker.proceed();
    },
    [blocker, isResetApiState, resetApiState, setBlockNav, setIsResetApiState],
  );

  const unloadHandler = React.useCallback(() => {
    function alertLeave(e) {
      if (!isBlockNav) {
        return;
      }

      e.preventDefault();
      return true;
    }
    window.addEventListener("beforeunload", alertLeave);
    return () => {
      window.removeEventListener("beforeunload", alertLeave);
    };
  }, [isBlockNav]);

  React.useEffect(unloadHandler, [unloadHandler]);

  return <AlertDialog
    title='Warning'
    alertContent="There are unsaved changes. Are you sure you want to leave?"
    open={isBlocked}
    onClose={cancelNavigate}
    onCancel={cancelNavigate}
    onConfirm={confirmNavigate}
  />
}