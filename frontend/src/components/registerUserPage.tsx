import axios from 'axios';
import React, { FC, memo, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const RegisterUserPage: FC = memo(() => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = async () => {
    try {
      await axios.post(`/api/registerUser`, { name: username, password: password });
      alert(`${username}を登録しました`);
      history.push('/');
    } catch (err: any) {
      alert(err.response.data);
    }
  };

  return (
    <>
      <div>
        <h2>新規ユーザー登録ページ</h2>
        ユーザー名：
        <input onChange={(e) => setUsername(e.target.value)} />
        <br />
        パスワード：
        <input onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button onClick={() => registerUser()}>新規登録</button>
        <br />
      </div>
    </>
  );
});
