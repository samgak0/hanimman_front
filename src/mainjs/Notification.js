// src/Notification.js
import React, { useState } from 'react';
import '../maincss/Notification.css';

const Notification = () => {
  const [activeTab, setActiveTab] = useState('activity');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="notification-container">
      <header className="notification-header">
        <button className="back-button">◀︎</button>
        <h1>알림</h1>
        <button className="edit-button">편집</button>
      </header>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => handleTabClick('activity')}
        >
          활동 알림
        </button>
        <button
          className={`tab-button ${activeTab === 'keyword' ? 'active' : ''}`}
          onClick={() => handleTabClick('keyword')}
        >
          키워드 알림
        </button>
      </div>

      <div className="notification-content">
        {activeTab === 'activity' && (
          <div className="notification-item">
            <img src={`${process.env.PUBLIC_URL}/notification-icon.png`} alt="Notification Icon" className="notification-icon" />
            <div className="notification-text">
              <p>휴가비 100만원 🌴 vs 장사 대박 🍗</p>
              <span className="notification-time">2일 전</span>
            </div>
          </div>
        )}
        {activeTab === 'keyword' && (
          <p className="no-keyword-alert">등록된 키워드 알림이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Notification;