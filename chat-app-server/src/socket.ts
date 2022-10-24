import { Server, Socket } from 'socket.io';

const socket = ({ io }: { io: Server }) => {
  // クライアントがサーバーと接続したときに発生する「connection」イベント

  let exData: Array<{}> = [];

  io.on('connection', (socket: Socket) => {
    console.log(`User connected ${socket.id}`);
    io.emit('receiveData', exData); // 初回接続時に別のユーザーのpositionデータを送信する

    // クライアントから「sendData」イベントを受信
    socket.on('sendData', (data) => {
      console.log('サーバーで受信&各クライアントへ送信：', data);
      exData = data;
      // 接続済みのクライアントにdata送信
      io.emit('receiveData', data);
    });
  });
};

export default socket;
