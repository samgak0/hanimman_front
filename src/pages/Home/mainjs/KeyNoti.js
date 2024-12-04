// src/main/KeyNoti.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import keywordsData from '../../../data/keywords.json'; // JSON 파일을 import로 불러오기
import '../maincss/KeyNoti.css';

const KeyNoti = () => {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    // JSON 파일에서 키워드 설정
    setKeywords(keywordsData.keywords);
  }, []);

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() !== '') {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword('');
    }
  };

  const handleDeleteKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  return (
    <div className='mobile-container'>
    <div className="keynoti-container">
      <header className="keynoti-header">
        <button className="back-button" onClick={handleBackClick}>◀︎</button>
        <h1>키워드 알림 설정 ({keywords.length}/30)</h1>
      </header>

      <div className="input-container">
        <input
          type="text"
          placeholder="알림 받을 키워드를 입력해주세요."
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
        />
        <button className="add-button" onClick={handleAddKeyword}>등록</button>
      </div>

      <ul className="keyword-list">
        {keywords.map((keyword, index) => (
          <li key={index} className="keyword-item">
            <span>{keyword}</span>
            <button className="delete-icon" onClick={() => handleDeleteKeyword(index)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default KeyNoti;