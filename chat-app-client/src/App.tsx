/* eslint no-unused-vars: 0 */
import React, { useEffect, useRef } from 'react';
import { useSockets, Position } from './context/socket.context';

const App: React.FC = () => {
  const { socket, setPositions } = useSockets();
  const localPositions = useRef<Position[]>([]); // useEffect内ではsetPositionsで更新されたpositionsが取得できないので参照用のpositionsを定義

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

  useEffect(() => {
    addEventListener('click', (e) => {
      socket.emit('sendData', updatePositionList({ id: socket.id, x: e.pageX, y: e.pageY }));
    });
    addEventListener('keydown', (e) => {
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
    });
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

  return <Mark />;
};

const Mark: React.FC = () => {
  const { positions } = useSockets();
  return (
    <>
      {positions != null && (
        <div>
          {positions.map((p, index) => {
            return (
              <div key={index} style={{ position: 'relative' }}>
                {/* どのidの■か分かるように「←<idの頭3文字>」つけてるだけ */}
                <div style={{ position: 'absolute', top: p.y, left: p.x }}>{`■←${p.id.substring(0, 3)}`}</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default App;
