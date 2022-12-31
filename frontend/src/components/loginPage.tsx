import React, { FC, memo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export const LoginPage: FC = memo(() => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const req = {
      name: username,
      password: password,
    };
    try {
      await axios.post('/api/login', req);
      history.push('/top'); // ログインに成功するとトップページに移動する
    } catch (err: any) {
      alert('ログインに失敗しました。' + err.response.data);
    }
  };

  return (
    <div>
      <h2>ログインページ</h2>
      ユーザー名：
      <input onChange={(e) => setUsername(e.target.value)} />
      <br />
      パスワード：
      <input onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={() => login()}>Login</button>
      <br />
      <br />
      新規ユーザー登録はこちら→
      <button onClick={() => history.push('/register')}>新規登録</button>
    </div>
  );
});
