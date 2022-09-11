import React, { useContext, createContext, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from 'config/default';

// interface MassageType {
//   message: string;
//   username: string;
//   time: string;
// }

interface ContextType {
  socket: Socket;
  setUsername: Function;
  messages?: string[];
  setMessages: Function;
}

// SOCKET_URLの中身のところに接続を要求
const socket = io(SOCKET_URL);

const SocketContext = createContext<ContextType>({
  socket,
  setUsername: () => false,
  setMessages: () => false,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const SocketsProvier = (props: any) => {
  const [messages, setMessages] = useState([]);

  return <SocketContext.Provider value={{ socket, messages, setMessages }} {...props} />;
};

export const useSockets = (): ContextType => useContext(SocketContext);

export default SocketsProvier;
