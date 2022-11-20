const express = require("express");
const app = express();
var { Client } = require("pg");
require("dotenv").config();
const port = 8888;

const env = process.env;
// posgreの情報を入力
var client = new Client({
  user: env.POSTGRE_USER,
  host: "localhost",
  database: "chat_app_db",
  password: env.POSTGRE_PASSWORD,
  port: 5432,
});
client.connect();

// ユーザー情報の全件取得
app.get("/getAllUser", (_, res) => {
  client
    .query({ text: "SELECT * FROM usertable" })
    .then((queryRes) => {
      res.send(queryRes.rows);
    })
    .catch((e) => console.error(e.stack));
});

// postパラメータを受け取るため
app.use(express.json());
// 受け取ったユーザー情報を登録
app.post("/registerUser", (req, res) => {
  client
    .query({
      // $1はidなので入力せずに自動インクリメントにしたいけど今は1
      text: "INSERT INTO usertable VALUES($1, $2, $3)",
      values: [1, req.body.username, req.body.password],
    })
    .then((_) => {
      res.send("ユーザーを登録しました");
    })
    .catch((e) => console.error(e.stack));
});

// 画像データを登録
app.post("/registerAvatar", (req, res) => {
  client
    .query({
      // $1はidなので入力せずに自動インクリメントにしたいけど今は1
      text: "INSERT INTO avatars VALUES(nextval('seq'),$1)",
      values: [req.body.img],
    })
    .then((_) => {
      res.send("アバターを登録しました");
    })
    .catch((e) => console.error(e.stack));
});

// 画像データを全件取得
app.get("/getAllAvatars", (_, res) => {
  client
    .query({ text: "SELECT * FROM avatars" })
    .then((queryRes) => {
      res.send(queryRes.rows);
    })
    .catch((e) => console.error(e.stack));
});

// HTTPサーバを起動する
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
