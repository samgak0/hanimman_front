import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import 추가
import '../maincss/ZzimList.css';
import { ReactComponent as HeartIcon } from '../../../assets/icons/heart.svg';
import { ReactComponent as CommentIcon } from '../../../assets/icons/chat.svg';
import zzimData from '../../../data/zzimData.json';

const ZzimList = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    setItems(zzimData);
  }, []);

  return (
    <div className='mobile-container'>
    <div className="zzim-list">
      <header className="zzim-header">
        <button className="back-button" onClick={() => navigate(-1)}>◀</button> {/* 이전 페이지로 이동 */}
        <h1>관심목록</h1>
      </header>
      {items.map(item => (
        <div key={item.id} className="zzim-item">
          <img src={item.imageUrl} alt={item.title} className="item-image" />
          <div className="item-details">
            <h2 className="item-title">{item.title}</h2>
            <p className="item-location">{item.location}</p>
            <div className="item-status-price">
              <span className="item-status">{item.status}</span>
              <span className="item-price">{item.price}</span>
            </div>
            <div className="item-icons">
              <span className="item-comments">
                <CommentIcon /> {item.comments}
              </span>
              <span className="item-likes">
                <HeartIcon /> {item.likes}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ZzimList;