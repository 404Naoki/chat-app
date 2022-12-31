import React, { useContext, createContext, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from 'config/default';

export interface Position {
  id: string;
  x: number;
  y: number;
}

interface ContextType {
  socket: Socket;
  positions: Position[];
  setPositions: Function;
}

// SOCKET_URLの中身のところに接続を要求
const socket = io(SOCKET_URL);

const SocketContext = createContext<ContextType>({
  socket,
  positions: [],
  setPositions: () => false,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const SocketsProvier = (props: any) => {
  const [positions, setPositions] = useState<Array<{ id: string; x: number; y: number }>>([]);
  return <SocketContext.Provider value={{ socket, positions, setPositions }} {...props} />;
};

export const useSockets = (): ContextType => useContext(SocketContext);

export default SocketsProvier;
