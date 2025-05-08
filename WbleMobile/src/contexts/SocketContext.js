import React, {useState, useEffect, createContext, useContext} from 'react';
import {AuthContext} from './AuthContext';
import {io} from 'socket.io-client';
import config from '@/config/config.json';

export const SocketContext = createContext({});

export default function SocketProvider({children}) {
  const [socket, setSocket] = useState('');
  const {userInfo, userToken} = useContext(AuthContext);

  useEffect(() => {
    // if user exists, create a socket connection
    if (userToken) {
      const newSocket = io(`${config.socketServerUrl}`, {
        query: {userToken},
        transport: ['websocket'],
      });

      newSocket.on('connect', () => console.log('Socket connected'));
      newSocket.on('disconnect', () => console.log('Socket disconnected'));

      setSocket(newSocket);
    }
  }, [userToken]);

  return (
    <SocketContext.Provider value={{socket: socket}}>
      {children}
    </SocketContext.Provider>
  );
}
