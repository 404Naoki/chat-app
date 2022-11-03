import React, { FC, memo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { User } from 'models/user';

export const LoginPage: FC = memo(() => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const checkUsers = () => {
    axios.get('/getAllUser').then((res: AxiosResponse<User[]>) => {
      const exist = res.data.find((user) => {
        return user.name === username && user.password === password;
      });
      if (exist) {
        // 登録されているユーザーならtop画面に遷移する
        history.push('/top');
      } else {
        alert('登録されていないユーザーです');
      }
    });
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
      <button onClick={() => checkUsers()}>Login</button>
      <br />
      <br />
      新規ユーザー登録はこちら→
      <button onClick={() => history.push('/register')}>新規登録</button>
    </div>
  );
});
