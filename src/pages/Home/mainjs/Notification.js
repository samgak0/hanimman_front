// src/main/Notification.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../maincss/Notification.css';
import notificationsData from '../../../data/notifications.json'; // 알림 JSON 파일 import
import keywordsData from '../../../data/keywords.json'; // 키워드 JSON 파일 import

const Notification = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('activity');
  const [notifications, setNotifications] = useState({ activity: [], keyword: [] });
  const [isEditing, setIsEditing] = useState(false);
  const keywordCount = keywordsData.keywords.length; // 키워드 JSON에서 키워드 개수 가져오기

  useEffect(() => {
    // 알림 JSON 데이터를 상태에 저장
    setNotifications(notificationsData);
  }, []);

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleBackClick = () => navigate(-1); // MainPage로 이동

  const handleEditClick = () => setIsEditing(!isEditing);

  const handleDelete = (tab, id) => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      [tab]: prevNotifications[tab].filter((item) => item.id !== id),
    }));
  };

  const handleSettingsClick = () => navigate('/keynoti'); // KeyNoti 페이지로 이동

  return (
    <div className="notification-container">
      <header className="notification-header">
        <button className="back-button" onClick={handleBackClick}>◀︎</button>
        <h1>알림</h1>
        <button className="edit-button" onClick={handleEditClick}>
          {isEditing ? '완료' : '편집'}
        </button>
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
        {activeTab === 'activity' &&
          notifications.activity.map((item) => (
            <div key={item.id} className="notification-item">
              <div className="notification-text">
                <p>{item.message}</p>
                <span className="notification-time">{item.time}</span>
              </div>
              {isEditing && (
                <button className="delete-button" onClick={() => handleDelete('activity', item.id)}>x</button>
              )}
            </div>
          ))}

        {activeTab === 'keyword' && (
          <>
            <div className="settings-container">
              <span>🔔 알림 받는 키워드 {keywordCount}개</span>
              <button className="settings-button" onClick={handleSettingsClick}>설정</button>
            </div>
            {notifications.keyword.map((item) => (
              <div key={item.id} className="notification-item">
                <div className="notification-text">
                  <p>{item.message}</p>
                  <span className="notification-time">{item.time}</span>
                </div>
                {isEditing && (
                  <button className="delete-button" onClick={() => handleDelete('keyword', item.id)}>x</button>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Notification;