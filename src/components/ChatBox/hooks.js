import { useCallback, useMemo, useState } from 'react';

export const useCtrlEnterKeyEventsHandler = (onCtrlEnterDown, onEnterDown) => {
  const keysPressed = useMemo(() => ({}), [])
  const [isInComposition, setIsInComposition] = useState(false)
  const onKeyDown = useCallback(
    (event) => {
      if (isInComposition) {
        return
      }
      keysPressed[event.key] = true
      if (keysPressed['Control'] && event.key === 'Enter' && onCtrlEnterDown) {
        onCtrlEnterDown()
      } else if (!keysPressed['Control'] && event.key === 'Enter' && onEnterDown) {
        onEnterDown(event)
      }
    },
    [isInComposition, keysPressed, onCtrlEnterDown, onEnterDown],
  );

  const onKeyUp = useCallback(
    (event) => {
      delete keysPressed[event.key]
    },
    [keysPressed],
  )

  const onCompositionStart = useCallback(() => {
    setIsInComposition(true)
  }, [])
  const onCompositionEnd = useCallback(() => {
    setIsInComposition(false)
  }, [])

  return { onKeyDown, onKeyUp, onCompositionStart, onCompositionEnd }
}
