import { useEffect, useCallback, useContext } from 'react';
import SocketContext from '@/context/SocketContext';


const useSocket = (event, responseHandler) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
      socket && responseHandler && socket.on(event, responseHandler);
    return () => {
      socket && responseHandler && socket.off(event, responseHandler);
    };
  }, [event, responseHandler, socket]);

  const emit = useCallback((payload) => {
    socket.emit(event, payload);
  }, [socket, event]);

  return {
    emit,
  }
};

export default useSocket;