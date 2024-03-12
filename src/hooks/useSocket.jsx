import { useEffect, useCallback, useContext } from 'react';
import SocketContext from '@/context/SocketContext';


const useSocket = (event, responseHandler) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
      socket && socket.on(event, responseHandler);
    return () => {
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

export default useSocket;