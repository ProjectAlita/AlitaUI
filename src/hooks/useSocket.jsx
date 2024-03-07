import { useState, useEffect, useCallback, useContext } from 'react';
import SocketContext from '@/context/SocketContext';


const useSocket = (eventName) => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);

  const handleEvent = useCallback((message) => {
    setMessages((prevState) => [...prevState, message]);
  }, [setMessages])

  useEffect(() => {
      socket && socket.on(eventName, handleEvent);
    return () => {
      socket && socket.off(eventName, handleEvent);
    };
  }, [eventName, handleEvent, socket]);

  const sendMessage = useCallback((payload) => {
    socket.emit(eventName, payload);
  }, [socket, eventName]);

  return {
    messages,
    sendMessage,
  }
};

export default useSocket;