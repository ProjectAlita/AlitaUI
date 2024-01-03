import AlertDialog from "./AlertDialog";
import React from 'react';
import { unstable_useBlocker} from 'react-router-dom';

export default function UnsavedDialog ({blockCondition}) {
  const blockerFn = React.useCallback(
    ({ currentLocation, nextLocation }) => {
      return blockCondition &&
        (currentLocation.pathname !== nextLocation.pathname)
    },
    [blockCondition]
  );
  const blocker = unstable_useBlocker(blockerFn);

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
      blocker.proceed();
    },
    [blocker],
  );

  const unloadHandler = React.useCallback(() => {
    function alertLeave(e) {
      if (!blockCondition) {
        return;
      }

      e.preventDefault();
      return true;
    }
    window.addEventListener("beforeunload", alertLeave);
    return () => {
      window.removeEventListener("beforeunload", alertLeave);
    };
  }, [blockCondition]);

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