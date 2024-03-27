import {useEffect, useCallback, useContext} from 'react';
import SocketContext from '@/context/SocketContext';

export const STOP_GENERATING_EVENT = 'leave_rooms'

export const useManualSocket = (event, responseHandler) => {
  const socket = useContext(SocketContext);

  const subscribe = useCallback(
    () => {
      // eslint-disable-next-line no-console
      socket && responseHandler && socket.on(event, responseHandler) && console.log('subscribing to', event)
    },
    [event, responseHandler, socket],
  )

  const unsubscribe = useCallback(
    () => {
      // eslint-disable-next-line no-console
      socket && socket.off(event, responseHandler) && console.log('unsubscribing from', event);
    },
    [event, responseHandler, socket],
  )

  const emit = useCallback((payload) => {
    socket?.emit(event, payload);
  }, [socket, event]);

  return {
    subscribe,
    unsubscribe,
    emit,
    socket
  }
};

const useSocket = (event, responseHandler) => {
  const {subscribe, unsubscribe, emit, socket} = useManualSocket(event, responseHandler)

  useEffect(() => {
    subscribe()
    return () => {
      unsubscribe()
    }
  }, [subscribe, unsubscribe]);

  return {
    emit,
    connected: socket?.connected || false
  }
};

export default useSocket;