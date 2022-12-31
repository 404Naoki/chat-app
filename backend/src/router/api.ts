var router = require('express').Router();
const session = require('express-session');
var { Client } = require('pg');
require('dotenv').config();
const env = process.env;

// posgreの情報を入力
var client = new Client({
  user: env.POSTGRE_USER,
  host: 'localhost',
  database: 'chat_app_db',
  password: env.POSTGRE_PASSWORD,
  port: 5432,
});
client.connect();
router.get('/test', (_: any, res: any) => {
  res.status(200).send('testtest!none');
});

// 認証確認処理
router.get('/cfm', (req: any, res: any) => {
  if (!req.session.user) {
    return res.status(403).send('セッション情報がありません');
  }

  res.status(200).send(req.session.user);
});
router.get(
  // ログアウト処理
  '/logout',
  (req: any, res: any) => {
    req.session.destroy(); // セッションを破棄
    res.status(200).send('ログアウトしました');
  }
);

// ログイン処理
router.post('/login', (req: any, res: any) => {
  // ユーザー情報の全件取得
  client
    .query({ text: 'SELECT * FROM users' })
    .then((queryRes: any) => {
      const registeredUserInfo = queryRes.rows.find((r: any) => r.name === req.body.name);
      // ユーザー未登録の場合
      if (!registeredUserInfo) {
        return res.status(404).send('未登録のユーザーです');
      }
      // パスワードが一致しない場合
      if (registeredUserInfo.password !== req.body.password) {
        return res.status(403).send('パスワードが間違っています');
      }
      // ログインユーザーのセッション情報を保存
      req.session.user = {
        id: registeredUserInfo.id, // ユーザーID
        name: registeredUserInfo.name, // ユーザー名
      };
      res.status(200).send('OK');
    })
    // なにかしらのエラーがでた時
    .catch((e: any) => res.status(500).send('ログイン失敗:' + e));
});

// ユーザー情報登録処理
router.post('/registerUser', (req: any, res: any) => {
  client
    .query({
      text: 'INSERT INTO users(name,password) VALUES($1, $2)',
      values: [req.body.name, req.body.password],
    })
    .then(() => {
      res.status(201).send();
    })
    .catch((e: any) => res.status(500).send('登録に失敗しました:' + e));
});

// 画像データを登録
router.post('/registerAvatar', (req: any, res: any) => {
  console.log('id', req.session.user.id);
  client
    .query({
      text: 'UPDATE users SET avatar = $1 WHERE id = $2 ',
      values: [req.body.img, req.session.user.id],
    })
    .then(() => {
      res.status(201).send('アバターを登録しました');
    })
    .catch((e: any) => res.status(500).send('登録に失敗しました:' + e));
});

// 画像データを取得
router.get('/getAvatar', (req: any, res: any) => {
  // TODO:ログアウト後のログイン画面で/getAvatarが呼ばれてしまう。なおしたい
  if (!req.session.user) {
    return;
  }
  client
    .query({
      text: `SELECT avatar FROM users WHERE id = ${req.session.user.id}`,
    })
    .then((queryRes: any) => {
      res.status(200).send(queryRes.rows[0].avatar);
    })
    .catch((e: any) => console.error(e.stack));
});

module.exports = router;
