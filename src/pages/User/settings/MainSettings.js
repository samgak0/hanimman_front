import React from "react";
import "./MainSettings.css";
import { useNavigate } from "react-router-dom";

const MainSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <header className="settings-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ◀
        </button>
        <h1>설정</h1>
      </header>

      <div className="settings-section">
        <h2>알림 설정</h2>
        <div className="settings-item">
          <span>알림 수신 설정</span>
          <input type="checkbox" className="toggle-switch" />
        </div>
        <div className="settings-item">
          <span>방해금지 시간 설정</span>
          <input type="checkbox" className="toggle-switch" />
        </div>
        <div className="settings-item time-setting">
          <span>시작 시간</span>
          <span className="time-value">오후 11:00</span>
        </div>
        <div className="settings-item time-setting">
          <span>종료 시간</span>
          <span className="time-value">오전 7:00</span>
        </div>
      </div>

      <div className="settings-section">
        <h2>사용자 설정</h2>
        <div className="settings-item" onClick={() => navigate("/user/account")}>
          <span>계정 / 정보 관리</span>
        </div>
        <div
          className="settings-item"
          onClick={() => navigate("/user/collections")}
        >
          <span>모아보기 사용자 관리</span>
        </div>
        <div
          className="settings-item"
          onClick={() => navigate("/user/blocked")}
        >
          <span>차단 사용자 관리</span>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-item">
          <span>캐시 데이터 삭제</span>
        </div>
        <div className="settings-item">
          <span>최신버전 업데이트</span>
          <span className="version-value">24.45.2 (244502)</span>
        </div>
        <div className="settings-item logout" onClick={() => alert("로그아웃")}>
          <span>로그아웃</span>
        </div>
        <div
          className="settings-item delete-account"
          onClick={() => alert("탈퇴하기")}
        >
          <span>탈퇴하기</span>
        </div>
      </div>
    </div>
  );
};

export default MainSettings;