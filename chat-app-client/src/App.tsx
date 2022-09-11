import React, { useRef } from 'react';
import { useSockets } from './context/socket.context';

const App: React.FC = () => {
  const { socket, messages, setMessages } = useSockets();
  const messageRef = useRef<HTMLInputElement>(null);

  const handleClick = (): void => {
    if (messageRef.current != null) {
      const message = messageRef.current.value;
      console.log(message);
      if (String(message).trim().length !== 0) {
        socket.emit('sendMessage', message);
        messageRef.current.value = '';
      }
    }
  };

  socket.on('responseMessage', (message) => {
    console.log({ message });
    setMessages([...(messages ?? []), message]);
    console.log({ messages });
  });

  return (
    <>
      <input type="text" ref={messageRef} placeholder="write message" />
      <button onClick={handleClick}>Send</button>
      <Messages />
    </>
  );
};

const Messages: React.FC = () => {
  const { messages } = useSockets();
  return (
    <>
      {messages != null && (
        <div>
          {messages.map((message, index) => {
            return <li key={index}>{message}</li>;
          })}
        </div>
      )}
    </>
  );
};

export default App;
