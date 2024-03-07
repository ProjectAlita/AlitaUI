import { useState, useEffect, useCallback, useContext } from 'react';
import SocketContext from '@/context/SocketContext';


const useSocket = (eventName) => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);

  const handleEvent = useCallback((receivedMessage) => {
    setMessages((msgs) => [...msgs, receivedMessage]);
  }, []);

  useEffect(() => {
      socket && socket.on(eventName, handleEvent);
    return () => {
      socket && socket.off(eventName, handleEvent);
    };
  }, [eventName, handleEvent, socket]);

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