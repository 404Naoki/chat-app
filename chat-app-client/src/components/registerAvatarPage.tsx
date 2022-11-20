import React, { FC, memo, useState } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export const RegisterAvatarPage: FC = memo(() => {
  const colors = ['red', 'yellow', 'orange', 'green', 'blue', 'purple', 'black', 'white']; // ドットお絵かき用カラーセット
  const [currentColor, setCurrentColor] = useState('black'); // 選択中のカラー
  const [drawnData, setDrawnData] = useState(new Array<string>(187).fill('transparent')); // お絵かき中の色データ
  const [drawnAvatar, setDrawnAvatar] = useState(''); // 出来上がった画像データを格納する
  const [border, setBorder] = useState('1px solid #999'); // お絵かきスペースのBorder
  const history = useHistory();
  const SaveImg = () => {
    const elem = document.querySelector<HTMLElement>('#pic');
    {
      elem &&
        html2canvas(elem, { scale: 2, backgroundColor: null }).then((canvas) => {
          let downloadEle = document.createElement('a');
          downloadEle.href = canvas.toDataURL('image/png');
          setDrawnAvatar(downloadEle.toString());
          console.log('保存した画像データ：', downloadEle.toString());
          // 画像データをStringでDBに保存
          axios.post(`/registerAvatar`, { img: downloadEle.toString() }).then((res) => {
            console.log(res.data);
          });
        });
    }
  };

  // 枠線を消す
  const deleteBorder = () => {
    setBorder('1px solid transparent');
  };

  return (
    <div>
      <h2>アバター作成ページ</h2>
      <div>
        {colors.map((color) => (
          <button
            key={color}
            style={{ width: '30px', height: '30px', marginLeft: '1px', border: 'solid 1px', backgroundColor: color }}
            onClick={() => setCurrentColor(color)}
          />
        ))}
        <div style={{ display: 'inline-block', marginLeft: '10px' }} onClick={() => setCurrentColor('transparent')}>
          <svg width="30" height="30" viewBox="0 0 199.997 200">
            <path
              d="M235.177,4027.791l38.549-38.552,83.632-83.63-77.816-77.818-83.632,83.635-38.549,38.549Zm31.834-45.265L235.735,4013.8l-64.386-64.392,31.274-31.274Z"
              transform="translate(-157.361 -3827.791)"
            />
          </svg>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
        <span>現在のカラー：</span>
        <div
          style={{
            width: '20px',
            height: '20px',
            border: 'solid 1px',
            borderRadius: '100%',
            backgroundColor: currentColor,
          }}
        />
      </div>

      {/* お絵かきスペース囲う枠 */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          margin: '30px',
          width: '550px',
          height: '350px',
          paddingTop: '15px',
        }}
      >
        <div id="pic" style={{ display: 'inline-block' }}>
          {drawnData.map((color, index) => (
            <div
              style={{
                display: 'inline-block',
                border: `${border}`,
                width: '30px',
                height: '30px',
                marginRight: '0px',
                marginTop: '-5px',
                backgroundColor: `${color}`,
              }}
              onClick={() => setDrawnData(drawnData.map((d, i) => (i == index ? currentColor : d)))}
            />
          ))}
        </div>
      </div>
      <button onClick={() => deleteBorder()}>枠線を消す</button>
      <br />
      <button onClick={() => SaveImg()}>保存</button>
      <br />
      <button onClick={() => history.push('/top')}>TOPページに戻る</button>
      {drawnAvatar.length !== 0 && (
        <div
          style={{ width: '500px', height: '500px', position: 'relative', backgroundColor: '#fffaf0', margin: '30px' }}
        >
          【完成したアバター】
          <img
            src={drawnAvatar}
            style={{ width: '400px', height: '310px', position: 'absolute', top: '50px', left: '50px' }}
          />
        </div>
      )}
    </div>
  );
});
