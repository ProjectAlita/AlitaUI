import { VITE_SOCKET_SERVER, VITE_SOCKET_PATH} from '@/common/constants';
import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const useSocket = (eventName) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(VITE_SOCKET_SERVER, {path: VITE_SOCKET_PATH});
    window.qqq = newSocket
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.on(eventName, (receivedMessage) => {
        setMessages((msgs) => [...msgs, receivedMessage]);
      });
    }
  }, [socket, eventName]);

  const sendMessage = useCallback((id, message) => {
    if (message.trim()) {
      socket.emit(id, message);
    }
  }, [socket]);

  return {
    messages,
    sendMessage,
  }
};

export default useSocket;