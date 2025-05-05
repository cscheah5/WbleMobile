import React, {useState, useEffect, createContext, useContext} from 'react';
import {AuthContext} from './AuthContext';
import {io} from 'socket.io-client';

export const ChatContext = createContext({});

export default function ChatProvider({children}) {
  const [socket, setSocket] = useState('');
  const {userInfo, userToken} = useContext(AuthContext);

  useEffect(() => {
    // if user exists, create a socket connection
    if (userToken) {
      const newSocket = io('http://192.168.0.2:5000/chat', {
        query: {userToken},
        transport: ['websocket'],
      });

      newSocket.on('connect', () => console.log('Socket connected'));
      newSocket.on('disconnect', () => console.log('Socket disconnected'));

      setSocket(newSocket);
    }
  }, [userToken]);

  return (
    <ChatContext.Provider value={{socket: socket}}>
      {children}
    </ChatContext.Provider>
  );
}
