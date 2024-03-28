import { ROLES, SocketMessageType } from '@/common/constants';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AUTO_SCROLL_KEY } from './AutoScrollToggle';

export const useCtrlEnterKeyEventsHandler = ({ onShiftEnterPressed, onCtrlEnterDown, onEnterDown }) => {
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
      } else if (keysPressed['Shift'] && event.key === 'Enter' && onShiftEnterPressed) {
        onShiftEnterPressed()
      } else if (!keysPressed['Control'] && !keysPressed['Shift'] && event.key === 'Enter' && onEnterDown) {
        onEnterDown(event)
      }
    },
    [isInComposition, keysPressed, onCtrlEnterDown, onEnterDown, onShiftEnterPressed],
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

export const useStopStreaming = ({
  chatHistoryRef,
  chatHistory,
  setChatHistory,
  manualEmit,
}) => {
  const isStreaming = useMemo(() => chatHistory.some(msg => msg.isStreaming), [chatHistory]);

  const onStopStreaming = useCallback(
    (streamId) => () => {
      manualEmit([streamId]);
      setTimeout(() => setChatHistory(prevState =>
        prevState.map(msg => ({
          ...msg,
          isStreaming: msg.id === streamId ? false : msg.isStreaming
        }))
      ), 200);
    },
    [manualEmit, setChatHistory],
  );

  const onStopAll = useCallback(() => {
    const streamIds = chatHistoryRef.current.filter(message => message.role !== ROLES.User).map(message => message.id);
    manualEmit(streamIds);
    setTimeout(() => setChatHistory(prevState =>
      prevState.map(msg => ({ ...msg, isStreaming: false }))
    ), 200);
  }, [chatHistoryRef, manualEmit, setChatHistory]);


  useEffect(() => {
    return () => {
      onStopAll();
    };
  }, [onStopAll])

  return {
    isStreaming,
    onStopAll,
    onStopStreaming
  }
}

export const useChatSocket = ({
  chatHistory,
  setChatHistory,
  handleError,
}) => {
  const listRefs = useRef([]);
  const messagesEndRef = useRef();
  const chatHistoryRef = useRef(chatHistory);

  const getChatMessage = useCallback((messageId) => {
    const msgIdx = chatHistoryRef.current?.findIndex(i => i.id === messageId) || -1;
    let msg
    if (msgIdx < 0) {
      msg = {
        id: messageId,
        role: ROLES.Assistant,
        content: '',
        isLoading: false,
      }
    } else {
      msg = chatHistoryRef.current[msgIdx]
    }
    return [msgIdx, msg]
  }, [])

  const handleChatEvent = useCallback(async message => {
    const { stream_id, type: socketMessageType, message_type, response_metadata } = message
    const [msgIndex, msg] = getChatMessage(stream_id, message_type)

    const scrollToMessageBottom = () => {
      if (sessionStorage.getItem(AUTO_SCROLL_KEY) === 'true') {
        (listRefs.current[msgIndex] || messagesEndRef?.current)?.scrollIntoView({ block: "end" });
      }
    };

    switch (socketMessageType) {
      case SocketMessageType.References:
        msg.references = message.references
        break
      case SocketMessageType.Chunk:
      case SocketMessageType.AIMessageChunk:
        msg.content += message.content
        msg.isLoading = false
        msg.isStreaming = true
        setTimeout(scrollToMessageBottom, 0);
        if (response_metadata?.finish_reason) {
          msg.isStreaming = false
        }
        break
      case SocketMessageType.StartTask:
        msg.isLoading = true
        msg.isStreaming = false
        msg.content = ''
        msg.references = []
        msgIndex === -1 ? setChatHistory(prevState => [...prevState, msg]) : setChatHistory(prevState => {
          prevState[msgIndex] = msg
          return [...prevState]
        })
        setTimeout(scrollToMessageBottom, 0);
        break
      case SocketMessageType.Error:
        msg.isStreaming = false
        handleError({ data: message.content || [] })
        return
      case SocketMessageType.Freeform:
        break
      default:
        // eslint-disable-next-line no-console
        console.warn('unknown message type', socketMessageType)
        return
    }
    msgIndex === -1 ? setChatHistory(prevState => [...prevState, msg]) : setChatHistory(prevState => {
      prevState[msgIndex] = msg
      return [...prevState]
    })
  }, [getChatMessage, handleError, setChatHistory])

  return {
    handleChatEvent,
    listRefs,
    messagesEndRef
  }
}
