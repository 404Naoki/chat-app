import axios from 'axios';
import React, { useEffect, useRef, FC, memo, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSockets, Position } from '../context/socket.context';

export const TopPage: FC = memo(() => {
  const { socket, setPositions } = useSockets();
  const [user, setUser] = useState();
  const localPositions = useRef<Position[]>([]); // useEffect内ではsetPositionsで更新されたpositionsが取得できないので参照用のpositionsを定義
  const history = useHistory();
  /**
   * 更新したpositionリストを更新する関数
   * @param newPosition クリックorキーダウンで更新されたローカルのposition
   * @returns 更新されたnewPositionをlocalPositionsに反映させたpositionリスト
   */
  const updatePositionList = (newPosition: { id: string; x: number; y: number }): Position[] => {
    const idList = localPositions.current.map((p) => p.id);
    if (idList.includes(newPosition.id)) {
      return localPositions.current.map((p) => (p.id === socket.id ? { ...p, x: newPosition.x, y: newPosition.y } : p));
    } else {
      return [...localPositions.current, newPosition];
    }
  };

  const logout = async () => {
    await axios.get('/api/logout');
    history.push('/'); // ログインページに移動する
  };

  const click = useCallback(() => {
    // 初期表示位置を固定
    socket.emit('sendData', updatePositionList({ id: socket.id, x: 100, y: 100 }));
  }, []);
  const keydown = useCallback((e: any) => {
    const localPosition = localPositions.current.find((p) => p.id === socket.id);
    if (localPosition !== undefined) {
      if (e.key === 'ArrowRight') {
        socket.emit('sendData', updatePositionList({ id: socket.id, x: localPosition.x + 1, y: localPosition.y }));
      } else if (e.key === 'ArrowLeft') {
        socket.emit('sendData', updatePositionList({ id: socket.id, x: localPosition.x - 1, y: localPosition.y }));
      } else if (e.key === 'ArrowUp') {
        socket.emit('sendData', updatePositionList({ id: socket.id, x: localPosition.x, y: localPosition.y - 1 }));
      } else if (e.key === 'ArrowDown') {
        socket.emit('sendData', updatePositionList({ id: socket.id, x: localPosition.x, y: localPosition.y + 1 }));
      }
    }
  }, []);

  useEffect(() => {
    // 画面表示時にセッション取得
    // ログイン済みかどうかの確認をする
    axios
      .get('/api/cfm')
      .then((res) => setUser(res.data.name))
      .catch(() => {
        history.push('/');
      });
    window.addEventListener('click', () => click());
    window.addEventListener('keydown', (e) => keydown(e));
    return () => {
      // イベントの設定解除
      // TODO:removeと書いているけどイベント削除できてなくて画面遷移後も各イベントが残ったままになってる
      window.removeEventListener('click', () => click());
      window.removeEventListener('keydown', (e) => keydown(e));
    };
  }, []);

  const exPosition = useRef<Position>(); // 重複チェック用
  // イベント名「receiveData」で positions をサーバーから受信
  socket.on('receiveData', (positions) => {
    // TODO:重複してイベントを受信してしまうのでif文で囲って暫定対応
    if (exPosition.current !== positions) {
      localPositions.current = positions;
      setPositions(positions);
      exPosition.current = positions; // 重複チェック用に更新
    }
  });

  return (
    <>
      <h2>トップページ</h2>
      <span>ユーザー【{user}】でログインしています</span>
      <button onClick={() => logout()}>ログアウト</button>
      <br />
      クリックするとアバターが表示されます。表示されない場合はアバターを作成してください。
      <br />
      新規アバター登録はこちら→
      <button onClick={() => history.push('/createAvatar')}>新規登録</button>
      <hr />
      <Mark />
    </>
  );
});

const Mark: React.FC = () => {
  const { positions } = useSockets();
  const [avatarData, setAvatarData] = useState('');
  const getAvatar = () => {
    axios.get('/api/getAvatar').then((res) => {
      setAvatarData(res.data);
    });
  };
  useEffect(() => {
    getAvatar(), [];
  });
  return (
    <>
      {positions != null && (
        <div>
          {positions.map((p, index) => {
            return (
              <div key={index} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: p.y, left: p.x }}>
                  <img src={avatarData} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
