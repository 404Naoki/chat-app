import express from 'express';
const session = require('express-session');
import { createServer } from 'http';
import { Server } from 'socket.io';
import config from 'config';
import socket from './socket';

const port = config.get<number>('port');
const host = config.get<string>('host');
const corsOrigin = config.get<string>('corsOrigin');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

app.get('/', (_, res) => res.send(`Server is up`));

// postパラメータを受け取るため
app.use(express.json());
// セッション管理
app.use(
  session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

// apiで始まるリクエストの処理はapi.tsで行う
app.use('/api', require('./router/api.ts'));

httpServer.listen(port, host, () => {
  console.log(`http://${host}:${port}`);
  socket({ io });
});
