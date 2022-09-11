import { Server, Socket } from 'socket.io';

const socket = ({ io }: { io: Server }) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('sendMessage', (message) => {
      console.log({ message });
      socket.emit('responseMessage', message);
    });
  });
};

export default socket;
