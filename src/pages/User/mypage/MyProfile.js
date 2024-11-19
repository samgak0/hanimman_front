import React from 'react';
import './MyProfile.css'; // CSS 파일 경로
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <header className="profile-header">
        <button className="back-button" onClick={() => navigate(-1)}>◀</button>
        <h1>프로필</h1>
        <button className="share-button">🔗</button>
      </header>

      <div className="profile-main">
        <div className="profile-info">
          <img className="profile-avatar" src="/images/default-avatar.png" alt="프로필 사진" />
          <div className="profile-details">
            <h2>어느새 <span>#5039366</span></h2>
            <button className="edit-profile-btn" onClick={() => navigate('/editprofile')}>프로필 수정</button>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span>매너온도</span>
            <span>37.3°C 😄</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '50%' }}></div>
          </div>
        </div>

        <div className="extra-stats">
          <div className="stat-item">
            <span>재거래 희망률</span>
            <strong>100%</strong>
          </div>
          <div className="stat-item">
            <span>응답률</span>
            <strong>-</strong>
          </div>
        </div>

        <div className="profile-activity">
          <p>명륜동 6회 인증, 부산광역시 해운대구 18회 인증 (최근 30일)</p>
          <p>최근 3일 이내 활동 (2019년 6월 6일 가입)</p>
        </div>
      </div>

      <div className="profile-sections">
        <div className="section">
          <span>활동 배지 11개</span>
        </div>
        <div className="section">
          <span>판매 물품 4개</span>
        </div>
        <div className="section">
          <span>받은 매너 평가</span>
          <ul>
            <li>친절하고 매너가 좋아요.</li>
            <li>응답이 빨라요.</li>
            <li>시간 약속을 잘 지켜요.</li>
          </ul>
        </div>
        <div className="section">
          <span>받은 거래 후기 2</span>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;