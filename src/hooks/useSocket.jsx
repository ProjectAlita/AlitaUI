import { useEffect, useCallback, useContext } from 'react';
import SocketContext from '@/context/SocketContext';


const useSocket = (event, responseHandler) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    // eslint-disable-next-line no-console
    socket && responseHandler && socket.on(event, responseHandler) && console.log('subscribing to', event)
    return () => {
      // eslint-disable-next-line no-console
      console.log('unsubscribing from', event)
      socket && socket.off(event, responseHandler);
    };
  }, [event, responseHandler, socket]);

  const emit = useCallback((payload) => {
    socket.emit(event, payload);
  }, [socket, event]);

  return {
    emit,
  }
};

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
      socket && socket.off(event, responseHandler);
    },
    [event, responseHandler, socket],
  )
  

  const emit = useCallback((payload) => {
    socket.emit(event, payload);
  }, [socket, event]);

  return {
    subscribe,
    unsubscribe,
    emit,
  }
};

export default useSocket;